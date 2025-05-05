/* eslint-disable no-unused-vars */
import moment from "moment";
import firebase from "./../../../../../config/firebase";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

export const handleReceive = ({ index, bagList, setBagList }) => {
  setBagList(
    bagList.map((bag, idx) => {
      if (idx === index && bag.statusBag === "Dalam Perjalanan") {
        return {
          ...bag,
          statusBag: "Received",
        };
      } else {
        return bag;
      }
    })
  );
};

export const handleUnreceive = ({ index, bagList, setBagList }) => {
  setBagList(
    bagList.map((bag, idx) => {
      if (idx === index && bag.statusBag === "Dalam Perjalanan") {
        return {
          ...bag,
          statusBag: "Unreceived",
        };
      } else {
        return bag;
      }
    })
  );
};

export const handleCancel = ({ index, bagList, oldBagList, setBagList }) => {
  setBagList(
    bagList.map((bag, idx) => {
      if (idx === index) {
        return {
          ...bag,
          statusBag: `${oldBagList[index].statusBag}`,
        };
      } else {
        return bag;
      }
    })
  );
};

export const handleApprove = async ({
  docKey,
  bagList,
  setLoading,
  inboundUser,
  signatureImage,
}) => {
  if (confirm("Konfirmasi approve?") === true) {
    // Get current DateTime
    const d = new Date();
    const time = moment(d).locale("en-sg").format("LT");
    const date = moment(d).locale("en-ca").format("L");

    // Check if all bag is already Received
    const isAllReceived = bagList.every((bag) => bag.statusBag === "Received");
    // Check if there is a bag has "Dalam Perjalanan" status
    const isTransporting = bagList.some(
      (bag) => "Dalam Perjalanan" === bag.statusBag
    );
    // Check for "Missing" bag
    const isMissing = bagList.some((bag) => "Missing" === bag.statusBag);

    // Set Document Status
    let finalStatus = "";
    if (isAllReceived) {
      finalStatus = "Received";
    } else if (isMissing) {
      finalStatus = "Received*";
    } else if (isTransporting) {
      finalStatus = "Dalam Perjalanan";
    } else {
      finalStatus = "Ongoing";
    }

    try {
      // Database Reference
      const dbDocRef = firebase.database().ref(`midMile/documents/${docKey}`);
      const dbBagRef = firebase.database().ref("midMile/bags");

      // Initiate Firebase Storage
      const storage = getStorage();
      const metadata = {
        contentType: "image/png",
      };

      // For Petugas Airport
      const storageRef = ref(
        storage,
        `midMile/signatures/${docKey}/inboundStation.png`
      );

      // Upload Signature to Storage
      await uploadString(storageRef, signatureImage, "data_url", metadata).then(
        (snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            // Update Document Details
            await dbDocRef
              .update({
                status: finalStatus,
                receivedDate: `${date} ${time}`,
                latestUpdateDate: `${date} ${time}`,
                inboundUser: inboundUser,
                inboundSign: url,
              })
              .then(async () => {
                // Update Bag Details
                await bagList.forEach((bag) => {
                  const { key, ...rest } = bag;
                  if (
                    bag.statusBag === "Received" ||
                    bag.statusBag === "Unreceived"
                  ) {
                    dbBagRef.child(bag.key).update({
                      ...rest,
                    });
                  }
                });
                alert("Berhasil approve");
              });
          });
        }
      );
    } catch (error) {
      setLoading(false);
      alert("Gagal approve");
    }
  }
};
