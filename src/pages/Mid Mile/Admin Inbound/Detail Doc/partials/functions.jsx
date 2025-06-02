/* eslint-disable no-unused-vars */
import moment from "moment";
import firebase from "./../../../../../config/firebase";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

export const handleApprove = async ({
  docKey,
  bagList,
  setLoading,
  inboundUser,
  signatureImage,
  setToast,
}) => {
  if (confirm("Konfirmasi approve?") === true) {
    // Filter Bag List from already Received Bags
    const unreceivedBags = bagList.filter(
      (bag) => "Received" !== bag.statusBag
    );

    // Check if all bag is already Received
    const isAllTransporting = unreceivedBags.every(
      (bag) => bag.statusBag === "Dalam Perjalanan"
    );

    // Check for "Missing" bag
    const isMissing = unreceivedBags.some((bag) => "Missing" === bag.statusBag);

    // Check for "Standby" bag
    const isSubmitted = unreceivedBags.some(
      (bag) => "Submitted" === bag.statusBag
    );

    // Check for "Standby" bag
    const isStandby = unreceivedBags.some((bag) => "Standby" === bag.statusBag);

    // Set Document Status
    let finalStatus = "";
    if (isAllTransporting) {
      finalStatus = "Received";
    } else if (isMissing) {
      finalStatus = "Received*";
    } else if (isStandby) {
      finalStatus = "Standby";
    } else if (isSubmitted) {
      finalStatus = "Ongoing";
    }

    try {
      // Database Reference
      // const dbDocRef = firebase.database().ref(`midMile/documents/${docKey}`);
      // const dbBagRef = firebase.database().ref("midMile/bags");
      const dbDocRef = firebase
        .database()
        .ref(`test/midMile/documents/${docKey}`);
      const dbBagRef = firebase.database().ref("test/midMile/bags");

      // Initiate Firebase Storage
      const storage = getStorage();
      const metadata = {
        contentType: "image/png",
      };

      // For Petugas Airport
      const storageRef = ref(
        storage,
        // `midMile/signatures/${docKey}/inboundStation.png`
        `test/midMile/signatures/${docKey}/inboundStation.png`
      );

      // Upload Signature to Storage
      await uploadString(storageRef, signatureImage, "data_url", metadata).then(
        (snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            // Update Document Details
            let docUpdates = {
              receivedDate: moment().locale("fr-ca").format("L LT"),
              latestUpdate: moment().locale("fr-ca").format("L LT"),
              inboundUser: inboundUser,
              inboundSign: url,
            };

            if (finalStatus !== "") {
              docUpdates = {
                ...docUpdates,
                status: finalStatus,
              };
            }

            await dbDocRef.update(docUpdates).then(async () => {
              // Update Bag Details
              await bagList.forEach((bag) => {
                if (bag.statusBag === "Dalam Perjalanan") {
                  dbBagRef.child(bag.key).update({
                    statusBag: "Received",
                  });
                }
              });
              setLoading(false);
              setToast({
                show: true,
                header: "Info",
                message: "Berhasil approve dokumen",
              });
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
