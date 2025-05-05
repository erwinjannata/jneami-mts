/* eslint-disable no-unused-vars */
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import firebase from "../../../../../config/firebase";
import * as XLSX from "xlsx";
import moment from "moment";

export const getDocNumber = ({
  setDocNumber,
  setStorageNumber,
  setCollectionLength,
}) => {
  firebase
    .database()
    .ref("status")
    .on("value", (snapshot) => {
      let count = parseInt(snapshot.child("midMileCollectionLength").val());
      let year = new Date().getFullYear().toString().substring(2, 4);
      let zerofilled = ("00000" + (count + 1)).slice(-5);
      setDocNumber(`MM/${year}/${zerofilled}`);
      setStorageNumber(`${year}-${zerofilled}`);
      setCollectionLength(count + 1);
    });
};

export const fileChange = ({ event, setFile }) => {
  const input = event.target.files[0];

  setFile(input);
};

export const readFile = ({ file, setBagList }) => {
  if (file === undefined) {
    alert("File SMU tidak ditemukan!");
  } else if (
    file.type !==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    alert("Format file tidak sesuai, upload file dengan format Excel(XLSX)");
  } else {
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const raw_data = XLSX.utils.sheet_to_json(worksheet);
      const processed_data = [];

      raw_data.forEach((row) => {
        const bags = row["BAG"].replace(/\r?\n|\r|\s/g, "").split("+");
        bags.forEach((bag) => {
          const bag_split = bag.split("/");
          processed_data.push({
            bagNumber: bag_split[0],
            weight: parseInt(bag_split[1]),
            sm: row["AWB/SMU"],
            koli: 1,
          });
        });
      });

      // Clean the data from duplicated bagNumbers and sum the weight and koli
      const clean_data = processed_data.reduce((a, c) => {
        const obj = a.find((obj) => obj.bagNumber === c.bagNumber);
        if (!obj) {
          a.push(c);
        } else {
          obj.weight += c.weight;
          obj.koli++;
        }
        return a;
      }, []);

      setBagList(clean_data);
    };
    reader.readAsBinaryString(file);
  }
};

export const approveDoc = async ({
  userInfo,
  bagList,
  signatureImage,
  docNumber,
  storageNumber,
  collectionLength,
  setLoading,
}) => {
  if (signatureImage === "") {
    alert("Tanda tangan invalid");
  } else {
    if (confirm("Konfirmasi approve?") === true) {
      setLoading(true);

      // Database References
      const dbDocRef = firebase.database().ref("midMile/documents");
      const keyReference = dbDocRef.push().key;

      const dbBagRef = firebase.database().ref("midMile/bags");
      const collectionLengthRef = firebase
        .database()
        .ref("status/midMileCollectionLength");

      const storage = getStorage();
      const metadata = {
        contentType: "image/png",
      };
      const storageRef = ref(
        storage,
        `midMile/signatures/${keyReference}/submittedSignature.png`
      );

      try {
        // Check if every bag is already submitted
        const bagChecks = await Promise.all(
          bagList.map(async (bag) => {
            const snapshot = await dbBagRef
              .orderByChild("bagNumber")
              .equalTo(bag.bagNumber)
              .get();
            return snapshot.exists();
          })
        );

        const allBagsExist = bagChecks.every((exists) => exists);

        if (allBagsExist) {
          alert("Seluruh bag sudah terdaftar di sistem");
          setLoading(false);
          return;
        }

        // Upload signature image
        await uploadString(
          storageRef,
          signatureImage,
          "data_url",
          metadata
        ).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            const d = new Date();
            const time = moment(d).locale("en-sg").format("LT");
            const date = moment(d).locale("en-ca").format("L");

            // Upload bag data
            await bagList.map((bag) => {
              dbBagRef
                .orderByChild("bagNumber")
                .equalTo(bag.bagNumber)
                .get()
                .then(async (snapshot) => {
                  if (!snapshot.exists()) {
                    await dbBagRef
                      .push({
                        documentId: keyReference,
                        statusBag: "Submitted",
                        bagNumber: bag.bagNumber,
                        weight: bag.weight,
                        sm: bag.sm,
                        koli: bag.koli,
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  }
                });
            });

            // Upload document data
            await dbDocRef
              .child(keyReference)
              .set({
                documentNumber: docNumber,
                status: "Submitted",
                submittedBy: userInfo,
                submittedSignature: url,
                submittedDate: `${date} ${time}`,
                totalPcs: bagList.length,
                totalWeight: bagList.reduce((prev, next) => {
                  return prev + parseInt(next.weight);
                }, 0),
                totalKoli: bagList.reduce((prev, next) => {
                  return prev + parseInt(next.koli);
                }, 0),
              })
              .then(() => {
                collectionLengthRef.set(collectionLength);
                setLoading(false);
                alert("Data berhasil disimpan");
              })
              .catch(() => {
                setLoading(false);
                alert("Data gagal disimpan");
              });
          });
        });
      } catch (error) {
        alert("Error: ", error);
      }
    }
  }
};

export const removeBag = ({ bagNumber, setBagList }) => {
  if (confirm("Hapus bag?") === true) {
    setBagList((current) =>
      current.filter((bag) => bag.bagNumber !== bagNumber)
    );
  }
};
