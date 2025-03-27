/* eslint-disable no-unused-vars */
import moment from "moment";
import firebase from "./../../../../../config/firebase";
import {
  ref,
  getStorage,
  uploadString,
  getDownloadURL,
} from "firebase/storage";

// Download the data from database
export const fetchData = ({
  dbRef,
  key,
  setLoading,
  setData,
  setBagList,
  setOldBagList,
  setZeroFilled,
}) => {
  setLoading(true);
  dbRef.child(`documents/${key}`).on("value", (snapshot) => {
    if (snapshot.exists()) {
      setData(snapshot.val());
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
            setOldBagList(bags);
          }
        });
    }
    setZeroFilled(snapshot.val().documentNumber.split("/")[2]);
    setLoading(false);
  });
};

// Handle Received button click
export const handleReceived = ({ index, bagList, setBagList }) => {
  setBagList(
    bagList.map((lists, idx) => {
      if (
        (idx === index && lists.statusBag === "Submitted") ||
        lists.statusBag === "Unreceived"
      ) {
        return {
          ...lists,
          statusBag: "Standby",
        };
      } else {
        return lists;
      }
    })
  );
};

// Handle Overload button click
export const handleMissing = ({ index, bagList, setBagList }) => {
  setBagList(
    bagList.map((lists, idx) => {
      if (idx === index) {
        return {
          ...lists,
          statusBag: "Missing",
        };
      } else {
        return lists;
      }
    })
  );
};

// Handles Remark button click
export const handleRemark = ({
  index,
  setShow,
  setCurrentFocus,
  setRemark,
}) => {
  setShow(true);
  setCurrentFocus(index);
  setRemark("");
};

// Handle Cancel button click
export const handleCancel = ({ index, bagList, setBagList, oldBagList }) => {
  setBagList(
    bagList.map((lists, idx) => {
      if (idx === index) {
        return {
          ...lists,
          statusBag: `${oldBagList[index].statusBag}`,
        };
      } else {
        return lists;
      }
    })
  );
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
  documentNumber,
  data,
  bagList,
  signatureImage,
  setLoading,
  stateGudang,
}) => {
  if (signatureImage === "") {
    alert("Tanda tangan invalid");
  } else if (stateGudang.namaPetugas === "") {
    alert("Nama petugas gudang kosong!");
  } else if (stateGudang.signatureImage === "") {
    alert("Tanda tangan petugas gudang kosong!");
  } else {
    if (confirm("Konfirmasi approve?") === true) {
      // Get current DateTime
      const d = new Date();
      const time = moment(d).locale("en-sg").format("LT");
      const date = moment(d).locale("en-ca").format("L");
      const year = d.getFullYear().toString().substring(2, 4);

      // Initiate Firebase Storage
      const dbDocRef = firebase.database().ref("midMile/documents");
      const dbBagRef = firebase.database().ref("midMile/bags");
      const storage = getStorage();
      const metadata = {
        contentType: "image/png",
      };

      // For Petugas Airport
      const storageRefAirport = ref(
        storage,
        `midMile/signatures/${year}-${documentNumber}/airport.png`
      );

      // For Petugas Gudang
      const storageRefGudang = ref(
        storage,
        `midMile/signatures/${year}-${documentNumber}/petugasGudang.png`
      );

      // Set Document Status
      let finalStatus = "";
      if (data.status === "Submitted") {
        finalStatus = "Standby";
      } else if (data.status === "Dalam Perjalanan") {
        finalStatus = "Dalam Perjalanan";
      } else if (data.status === "Ongoing") {
        const isStandby = bagList.some((bag) => "Standby" === bag.statusBag);
        if (isStandby) {
          finalStatus = "Standby";
        } else {
          finalStatus = "Received*";
        }
      } else if (data.status === "Standby") {
        finalStatus = "Standby";
      }

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
                let updates = {};
                if (data.approvedDate === undefined) {
                  updates = {
                    status: finalStatus,
                    approvedDate: `${date} ${time}`,
                    latestUpdateDate: `${date} ${time}`,
                    airportUser: user,
                    airportSign: urlAirport,
                    gudangUser: stateGudang.namaPetugas,
                    gudangSign: urlGudang,
                    totalPcs: bagList.length,
                    totalWeight: bagList.reduce((prev, next) => {
                      return prev + parseInt(next.weight);
                    }, 0),
                    totalKoli: bagList.reduce((prev, next) => {
                      return prev + parseInt(next.koli);
                    }, 0),
                  };
                } else {
                  updates = {
                    status: finalStatus,
                    latestUpdateDate: `${date} ${time}`,
                    airportUser: user,
                    airportSign: urlAirport,
                    gudangUser: stateGudang.namaPetugas,
                    gudangSign: urlGudang,
                    totalPcs: bagList.length,
                    totalWeight: bagList.reduce((prev, next) => {
                      return prev + parseInt(next.weight);
                    }, 0),
                    totalKoli: bagList.reduce((prev, next) => {
                      return prev + parseInt(next.koli);
                    }, 0),
                  };
                }

                await dbDocRef
                  .child(documentKey)
                  .update(updates)
                  .then(async () => {
                    await bagList.forEach((bag) => {
                      if (bag.key === undefined) {
                        dbBagRef.push({
                          ...bag,
                        });
                      } else {
                        const { key, ...rest } = bag;
                        dbBagRef.child(bag.key).update({
                          ...rest,
                        });
                      }
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
  documentNumber,
  bagList,
  setLoading,
  driverState,
}) => {
  if (driverState.signatureImage === "") {
    alert("Tanda tangan invalid");
  } else {
    if (confirm("Konfirmasi proses?") === true) {
      const d = new Date();
      const time = moment(d).locale("en-sg").format("LT");
      const date = moment(d).locale("en-ca").format("L");
      const year = d.getFullYear().toString().substring(2, 4);

      const dbDocRef = firebase.database().ref("midMile/documents");
      const dbBagRef = firebase.database().ref("midMile/bags");
      const storage = getStorage();
      const metadata = {
        contentType: "image/png",
      };
      const storageRef = ref(
        storage,
        `midMile/signatures/${year}-${documentNumber}/driver.png`
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
                transportedDate: `${date} ${time}`,
                latestUpdateDate: `${date} ${time}`,
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
                  } else {
                    dbBagRef.child(bag.key).update({
                      ...rest,
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
  bagList,
  setBagList,
  setState,
  inputRef,
}) => {
  if (state.searched === "") {
    alert("No. Bag kosong!");
  } else {
    const found = bagList.find((bag) => bag.bagNumber === state.searched);
    if (found) {
      const findIndex = bagList.findIndex((bag) => bag.key === found.key);
      handleReceived({
        index: findIndex,
        bagList: bagList,
        setBagList: setBagList,
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
      handleRemark({
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

export const handleAddBag = ({
  bagList,
  setBagList,
  oldBagList,
  setOldBagList,
  bagNo,
  koli,
  weight,
  remark,
  sm,
  statusBag,
  documentId,
  setState,
  setShow,
}) => {
  if (bagNo === "") {
    alert("Bag Number tidak boleh kosong!");
  } else if (koli === 0) {
    alert("Jumlah koli invalid!");
  } else if (weight === 0) {
    alert("Berat bag invalid!");
  } else {
    setBagList([
      ...bagList,
      {
        bagNumber: bagNo,
        koli: parseInt(koli),
        weight: parseInt(weight),
        remark: remark,
        sm: sm,
        statusBag: statusBag,
        documentId: documentId,
      },
    ]);
    setOldBagList([
      ...oldBagList,
      {
        bagNumber: bagNo,
        koli: parseInt(koli),
        weight: parseInt(weight),
        remark: remark,
        sm: sm,
        statusBag: statusBag,
        documentId: documentId,
      },
    ]);
    setState({
      bagNo: "",
      koli: 0,
      weight: 0,
      remark: "",
      sm: "",
    });
    setShow(false);
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
