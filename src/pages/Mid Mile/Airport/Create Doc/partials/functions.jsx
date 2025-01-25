import firebase from "./../../../../../config/firebase";
import moment from "moment";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

export const handleSubmit = ({
  event,
  state,
  bagList,
  setState,
  setBagList,
}) => {
  event.preventDefault();
  if (state.manifestNo === "") {
    alert("Manifest Number invalid");
  } else if (state.pcs <= 0) {
    alert("Pcs must be greater than 0");
  } else if (state.kg <= 0) {
    alert("Weight must be greater than 0");
  } else if (state.koli <= 0) {
    alert("Koli must be greater than 0");
  } else {
    const isExist = bagList.some((element) => {
      if (
        element.manifestNo === state.manifestNo.toUpperCase().replace(/ /g, "")
      ) {
        return true;
      }
      return false;
    });

    if (isExist) {
      alert("Manifest Number sudah ada");
    } else {
      setBagList([
        ...bagList,
        {
          manifestNo: state.manifestNo.toUpperCase().replace(/ /g, ""),
          koli: state.koli,
          pcs: state.pcs,
          kg: state.kg,
          remark: state.remark.toUpperCase(),
          statusBag: "Standby",
        },
      ]);
      var items = JSON.parse(localStorage.getItem("airportBagList")) || [];
      items.push({
        manifestNo: state.manifestNo.toUpperCase().replace(/ /g, ""),
        koli: state.koli,
        pcs: state.pcs,
        kg: state.kg,
        remark: state.remark.toUpperCase(),
        statusBag: "Standby",
      });
      localStorage.setItem("airportBagList", JSON.stringify(items));
      setState({
        ...state,
        manifestNo: "",
        koli: "",
        pcs: "",
        kg: "",
        remark: "",
      });
    }
  }
};

export const handleRemove = ({ index, manifestNo, setBagList }) => {
  if (confirm("Hapus bag?") === true) {
    setBagList((currentBag) =>
      currentBag.filter((number) => {
        return number.manifestNo !== manifestNo;
      })
    );
    var items = JSON.parse(localStorage.getItem("airportBagList"));
    items.splice(index, 1);
    localStorage.setItem("airportBagList", JSON.stringify(items));
  }
};

export const handleEmpty = ({ setBagList }) => {
  if (confirm("Hapus semua bag?") === true) {
    setBagList([]);
    localStorage.removeItem("airportBagList");
  }
};

export const handleApprove = ({ bagList, userOrigin, docNumber, setShow }) => {
  if (docNumber === "") {
    alert(
      "Nomor dokumen tidak valid, silahkan refresh halaman atau login kembali"
    );
  } else if (userOrigin === "") {
    alert(
      "User origin tidak valid, silahkan refresh halaman atau login kembali"
    );
  } else if (bagList.length === 0) {
    alert("Tidak ada data bag");
  } else {
    setShow(true);
  }
};

export const proccessApprove = async ({
  signatureImage,
  userInfo,
  docNumber,
  storageNumber,
  bagList,
  collectionLength,
  setLoading,
}) => {
  if (signatureImage === "") {
    alert("Tanda tangan invalid");
  } else {
    if (confirm("Konfirmasi approve?") === true) {
      setLoading(true);
      const storage = getStorage();
      const metadata = {
        contentType: "image/png",
      };
      const storageRef = ref(
        storage,
        `midMile/signatures/${storageNumber}/adminAirport.png`
      );

      const dbDocRef = firebase.database().ref("midMile/documents");
      const dbBagRef = firebase.database().ref("midMile/bags");
      const collectionLengthRef = firebase
        .database()
        .ref("status/midMileCollectionLength");

      try {
        await uploadString(
          storageRef,
          signatureImage,
          "data_url",
          metadata
        ).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            const keyReference = dbDocRef.push().key;
            const d = new Date();
            const time = moment(d).locale("en-sg").format("LT");
            const date = moment(d).locale("en-ca").format("L");

            await dbDocRef
              .child(keyReference)
              .set({
                documentNumber: docNumber,
                status: "Standby",
                airportUser: userInfo,
                airportSign: url,
                approvedDate: `${date} ${time}`,
                totalKoli: bagList.reduce((prev, next) => {
                  return prev + parseInt(next.koli);
                }, 0),
                totalWeight: bagList.reduce((prev, next) => {
                  return prev + parseInt(next.kg);
                }, 0),
              })
              .then(() => {
                bagList.map(async (bag) => {
                  await dbBagRef
                    .push({
                      documentId: keyReference,
                      ...bag,
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                });
                collectionLengthRef.set(collectionLength);
                setLoading(false);
                alert("Data berhasil disimpan");
                localStorage.removeItem("airportBagList");
              })
              .catch((error) => {
                setLoading(false);
                console.log(error);
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
