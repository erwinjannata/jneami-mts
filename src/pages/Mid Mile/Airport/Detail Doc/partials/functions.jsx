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
export const handleAction = ({ bag, doc, statusBag }) => {
  // Initialize Database Reference
  // const dbBagRef = firebase.database().ref("midMile/bags");
  // const dbDocRef = firebase.database().ref("midMile/documents");
  const dbBagRef = firebase.database().ref("test/midMile/bags");
  const dbDocRef = firebase.database().ref("test/midMile/documents");

  let docUpdate = {
    latestUpdate: moment().locale("fr-ca").format("L LT"),
  };

  if (doc.status === "Submitted" && statusBag !== "Missing") {
    docUpdate = {
      ...docUpdate,
      status: "Standby",
    };
  }

  // Update bag status to "Standby"
  if (bag.statusBag === "Submitted") {
    dbBagRef
      .child(bag.key)
      .update({
        statusBag: statusBag,
        receivedDate: moment().locale("fr-ca").format("L LT"),
      })
      .then(() => {
        dbDocRef
          .child(bag.documentId)
          .update(docUpdate)
          .then(() => {
            alert("Bag telah dikonfirmasi");
          });
      });
  } else {
    return (
      <Toast>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Bootstrap</strong>
          <small>11 mins ago</small>
        </Toast.Header>
        <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
      </Toast>
    );
  }
};

// Handles Remark button click
export const handleEdit = async ({
  index,
  setShow,
  setCurrentFocus,
  setRemark,
}) => {
  await setCurrentFocus(index);
  await setRemark("");
  setShow(true);
};

// Handle Approve button click
export const handleApprove = ({ user, bagList, setShow }) => {
  const isAllStandby = bagList.every((bag) => bag.statusBag === "Submitted");
  if (isAllStandby) {
    alert("Bag belum dikonfirmasi oleh tim Admin Airport");
  } else if (user === "") {
    alert("User tidak terbaca, silahkan refresh halaman atau login ulang");
  } else {
    setShow(true);
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
                    alert("Approved");
                    setLoading(false);
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
}) => {
  if (driverState.signatureImage === "") {
    alert("Tanda tangan invalid");
  } else {
    if (confirm("Konfirmasi proses?") === true) {
      // Initialize Database Reference
      // const dbDocRef = firebase.database().ref("midMile/documents");
      // const dbBagRef = firebase.database().ref("midMile/bags");
      const dbDocRef = firebase.database().ref("test/midMile/documents");
      const dbBagRef = firebase.database().ref("test/midMile/bags");
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
              });
          });
        });
      } catch (error) {
        setLoading(false);
      }
    }
  }
};

export const handleRcc = ({
  state,
  documentData,
  bagList,
  setState,
  inputRef,
}) => {
  if (state.searched === "") {
    alert("No. Bag kosong!");
  } else {
    const found = bagList.find((bag) => bag.bagNumber === state.searched);
    if (found) {
      const findIndex = bagList.findIndex((bag) => bag.key === found.key);
      handleAction({
        bag: bagList[findIndex],
        doc: documentData,
        statusBag: "Standby",
      });
      setState({
        ...state,
        searched: "",
      });
      inputRef.current.focus();
    } else {
      alert("Bag tidak ditemukan!");
    }
  }
};

export const handleRmrk = ({
  state,
  bagList,
  setShow,
  setRemark,
  setCurrentFocus,
  inputRef,
}) => {
  if (state.searched === "") {
    alert("No. Bag kosong!");
  } else {
    const found = bagList.find((bag) => bag.bagNumber === state.searched);
    if (found) {
      const findIndex = bagList.findIndex((bag) => bag.key === found.key);
      handleEdit({
        index: findIndex,
        setShow: setShow,
        setRemark: setRemark,
        setCurrentFocus: setCurrentFocus,
      });
      inputRef.current.focus();
    } else {
      alert("Bag tidak ditemukan!");
    }
  }
};

export const handleRemoveNewBag = ({ bagNo, setBagList }) => {
  if (confirm("Hapus bag?") === true) {
    setBagList((current) =>
      current.filter((number) => {
        return number.bagNumber !== bagNo;
      })
    );
  }
};
