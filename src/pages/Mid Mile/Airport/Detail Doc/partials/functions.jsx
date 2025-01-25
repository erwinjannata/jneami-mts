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
export const handleReceived = ({
  index,
  bagList,
  setBagList,
  changedItem,
  setChangedItem,
}) => {
  setBagList(
    bagList.map((lists, idx) => {
      if (idx === index && lists.statusBag === "Submitted") {
        setChangedItem(changedItem + 1);
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
export const handleMissing = ({
  index,
  bagList,
  setBagList,
  changedItem,
  setChangedItem,
}) => {
  setBagList(
    bagList.map((lists, idx) => {
      if (idx === index) {
        setChangedItem(changedItem + 1);
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
export const handleCancel = ({
  index,
  bagList,
  setBagList,
  oldBagList,
  changedItem,
  setChangedItem,
}) => {
  setBagList(
    bagList.map((lists, idx) => {
      if (idx === index) {
        setChangedItem(changedItem - 1);
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
  setChangedItem,
}) => {
  if (signatureImage === "") {
    alert("Tanda tangan invalid");
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
      const storageRef = ref(
        storage,
        `midMile/signatures/${year}-${documentNumber}/adminAirport.png`
      );

      // Set Document Status
      let finalStatus = "";
      if (data.status === "Submitted") {
        finalStatus = "Standby";
      } else if (data.status === "Dalam Perjalanan") {
        finalStatus = "Dalam Perjalanan";
      } else if (data.status === "Ongoing") {
        finalStatus = "Standby";
      } else if (data.status === "Standby") {
        finalStatus = "Standby";
      }

      try {
        setLoading(true);
        await uploadString(
          storageRef,
          signatureImage,
          "data_url",
          metadata
        ).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            // Setup updates
            let updates = {};
            if (data.approvedDate === undefined) {
              updates = {
                status: finalStatus,
                approvedDate: `${date} ${time}`,
                latestUpdateDate: `${date} ${time}`,
                airportUser: user,
                airportSign: url,
              };
            } else {
              updates = {
                status: finalStatus,
                latestUpdateDate: `${date} ${time}`,
                airportUser: user,
                airportSign: url,
              };
            }

            await dbDocRef
              .child(documentKey)
              .update(updates)
              .then(async () => {
                await bagList.forEach((bag) => {
                  const { key, ...rest } = bag;
                  dbBagRef.child(bag.key).update({
                    ...rest,
                  });
                });
                setChangedItem(0);
              });
          });
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  }
};

// Update data in database = Start "Dalam Perjalanan" state
export const handleTransport = async ({
  documentKey,
  documentNumber,
  bagList,
  signatureImage,
  setLoading,
  setChangedItem,
}) => {
  if (signatureImage === "") {
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
          signatureImage,
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
                setChangedItem(0);
              });
          });
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  }
};

export const handleRcc = ({
  state,
  bagList,
  changedItem,
  setBagList,
  setChangedItem,
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
        changedItem: changedItem,
        setBagList: setBagList,
        setChangedItem: setChangedItem,
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
