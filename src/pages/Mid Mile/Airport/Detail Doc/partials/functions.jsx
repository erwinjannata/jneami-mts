/* eslint-disable no-unused-vars */
import moment from "moment";
import firebase from "./../../../../../config/firebase";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { Toast } from "react-bootstrap";

// Download the data from database
export const fetchData = ({ dbRef, key, setLoading, setData, setBagList }) => {
  setLoading(true);
  dbRef.child(`documents/${key}`).on("value", (snapshot) => {
    if (snapshot.exists()) {
      setData({
        ...snapshot.val(),
        key: snapshot.key,
      });
      dbRef
        .child(`bags`)
        .orderByChild("documentId")
        .equalTo(key)
        .on("value", (snapshot) => {
          if (snapshot.exists()) {
            let bags = [];
            snapshot.forEach((childSnapshot) => {
              bags.push({
                key: childSnapshot.key,
                ...childSnapshot.val(),
              });
            });
            setBagList(bags);
          }
        });
    }
    setLoading(false);
  });
};

// Handle Received button click
export const handleAction = async ({
  state,
  setState,
  document,
  statusBag,
  bagList,
  setToast,
}) => {
  if (state.searched === "") {
    setToast({
      show: true,
      header: "Warning",
      message: "Nomor bag kosong",
    });
  } else {
    const found = bagList.find((bag) => bag.bagNumber === state.searched);
    if (found) {
      // Initialize Database Reference
      const dbBagRef = firebase.database().ref("midMile/bags");
      const dbDocRef = firebase.database().ref("midMile/documents");
      // const dbBagRef = firebase.database().ref("test/midMile/bags");
      // const dbDocRef = firebase.database().ref("test/midMile/documents");

      let docUpdate = {
        latestUpdate: moment().locale("fr-ca").format("L LT"),
      };

      if (document.status === "Submitted" && statusBag !== "Missing") {
        docUpdate = {
          ...docUpdate,
          status: "Standby",
        };
      }

      // Update bag status to "Standby"
      if (found.statusBag === "Submitted") {
        await dbBagRef
          .child(found.key)
          .update({
            statusBag: statusBag,
            receivingDate: moment().locale("fr-ca").format("L LT"),
          })
          .then(() => {
            dbDocRef
              .child(found.documentId)
              .update(docUpdate)
              .then(() => {
                if (setToast)
                  setToast({
                    show: true,
                    header: "Info",
                    message:
                      statusBag === "Standby"
                        ? `Bag ${found.bagNumber} berhasil di Receiving`
                        : `Bag ${found.bagNumber} dikonfirmasi Missing`,
                  });
              });
          });
      } else {
        if (setToast)
          setToast({
            show: true,
            header: "Warning",
            message: "Bag sudah di Receiving",
          });
      }
      setState({
        ...state,
        searched: "",
      });
    } else {
      if (setToast)
        setToast({
          show: true,
          header: "Warning",
          message: "Bag tidak ditemukan",
        });
    }
  }
};

// Handles Remark button click
export const handleEdit = async ({
  state,
  bagList,
  show,
  setShow,
  setCurrentFocus,
}) => {
  if (state.searched === "") {
    alert("No. Bag kosong!");
  } else {
    const found = bagList.find((bag) => bag.bagNumber === state.searched);
    if (found) {
      const index = bagList.findIndex((bag) => bag.key === found.key);
      await setCurrentFocus(index);
      setShow({
        ...show,
        editBag: true,
      });
    } else {
      alert("Bag tidak ditemukan!");
    }
  }
};

// Handle Approve button click
export const handleApprove = ({ user, bagList, show, setShow }) => {
  const isAllStandby = bagList.every((bag) => bag.statusBag === "Submitted");
  if (isAllStandby) {
    alert("Bag belum dikonfirmasi oleh tim Admin Airport");
  } else if (user === "") {
    alert("User tidak terbaca, silahkan refresh halaman atau login ulang");
  } else {
    setShow({
      ...show,
      checkerSignature: true,
    });
  }
};

// Update data in database
export const updateData = async ({
  user,
  documentKey,
  data,
  signatureImage,
  stateGudang,
  setLoading,
  setToast,
  onHide,
}) => {
  if (signatureImage === "") {
    alert("Tanda tangan invalid");
  } else if (stateGudang.namaPetugas === "") {
    alert("Nama petugas gudang kosong!");
  } else if (stateGudang.signatureImage === "") {
    alert("Tanda tangan petugas gudang kosong!");
  } else {
    if (confirm("Konfirmasi approve?") === true) {
      // Initiate Firebase Storage
      // const dbDocRef = firebase.database().ref("midMile/documents");
      const dbDocRef = firebase.database().ref("test/midMile/documents");
      const storage = getStorage();
      const metadata = {
        contentType: "image/png",
      };

      // For Petugas Airport
      const storageRefAirport = ref(
        storage,
        // `midMile/signatures/${documentKey}/petugasEMPU.png`
        `test/midMile/signatures/${documentKey}/petugasEMPU.png`
      );

      // For Petugas Gudang
      const storageRefGudang = ref(
        storage,
        // `midMile/signatures/${documentKey}/gudangBandara.png`
        `test/midMile/signatures/${documentKey}/gudangBandara.png`
      );

      try {
        setLoading(true);
        await uploadString(
          storageRefAirport,
          signatureImage,
          "data_url",
          metadata
        ).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (urlAirport) => {
            await uploadString(
              storageRefGudang,
              stateGudang.signatureImage,
              "data_url",
              metadata
            ).then((snapshot2) => {
              getDownloadURL(snapshot2.ref).then(async (urlGudang) => {
                // Setup updates
                let updates = {
                  latestUpdate: moment().locale("fr-ca").format("L LT"),
                  airportUser: user,
                  airportSign: urlAirport,
                  gudangUser: stateGudang.namaPetugas,
                  gudangSign: urlGudang,
                };

                if (data.approvedDate === undefined) {
                  updates = {
                    ...updates,
                    approvedDate: moment().locale("fr-ca").format("L LT"),
                  };
                }

                await dbDocRef
                  .child(documentKey)
                  .update(updates)
                  .then(() => {
                    setLoading(false);
                    onHide();
                    setToast({
                      show: true,
                      header: "Info",
                      message: "Berhasil approve dokumen",
                    });
                  });
              });
            });
          });
        });
      } catch (error) {
        setLoading(false);
        alert("Gagal update data");
      }
    }
  }
};

// Update data in database = Start "Dalam Perjalanan" state
export const handleTransport = async ({
  documentKey,
  bagList,
  setLoading,
  driverState,
  setToast,
}) => {
  if (driverState.signatureImage === "") {
    alert("Tanda tangan invalid");
  } else {
    if (confirm("Konfirmasi proses?") === true) {
      // Initialize Database Reference
      const dbBagRef = firebase.database().ref("midMile/bags");
      const dbDocRef = firebase.database().ref("midMile/documents");
      // const dbBagRef = firebase.database().ref("test/midMile/bags");
      // const dbDocRef = firebase.database().ref("test/midMile/documents");
      const storage = getStorage();
      const metadata = {
        contentType: "image/png",
      };
      const storageRef = ref(
        storage,
        // `midMile/signatures/${documentKey}/driver.png`
        `test/midMile/signatures/${documentKey}/driver.png`
      );

      try {
        setLoading(true);
        await uploadString(
          storageRef,
          driverState.signatureImage,
          "data_url",
          metadata
        ).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            await dbDocRef
              .child(documentKey)
              .update({
                status: "Dalam Perjalanan",
                transportedDate: moment().locale("fr-ca").format("L LT"),
                latestUpdate: moment().locale("fr-ca").format("L LT"),
                driverSign: url,
                driverName: driverState.namaPetugas,
              })
              .then(async () => {
                await bagList.forEach((bag) => {
                  const { key, ...rest } = bag;
                  if (bag.statusBag === "Standby") {
                    dbBagRef.child(bag.key).update({
                      ...rest,
                      statusBag: "Dalam Perjalanan",
                    });
                  }
                });
                if (setToast) {
                  setToast({
                    show: true,
                    header: "Info",
                    message: "Berhasil update data dokumen",
                  });
                }
              });
          });
        });
      } catch (error) {
        setLoading(false);
      }
    }
  }
};

export const onTransportClick = ({
  document,
  bagList,
  show,
  setShow,
  setToast,
}) => {
  const isAllOnTransport = bagList.every(
    (bag) => bag.statusBag === "Dalam Perjalanan"
  );
  const isAllNotStandby = bagList.every((bag) => bag.statusBag === "Submitted");

  if (document.status === "Submitted") {
    setToast({
      show: true,
      header: "Warning",
      message: "Semua bag belum dikonfirmasi oleh petugas EMPU",
    });
  } else if (document.approvedDate === undefined) {
    setToast({
      show: true,
      header: "Warning",
      message: "Dokumen belum di approve oleh Petugas EMPU",
    });
  } else if (isAllOnTransport) {
    setToast({
      show: true,
      header: "Warning",
      message: "Semua bag sedang dalam proses transport menuju Inbound Station",
    });
  } else if (isAllNotStandby) {
    setToast({
      show: true,
      header: "Warning",
      message: "Semua bag belum dikonfirmasi oleh petugas EMPU",
    });
  } else {
    setShow({
      ...show,
      driverSignature: true,
    });
  }
};
