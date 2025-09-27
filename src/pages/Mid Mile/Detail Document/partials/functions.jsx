/* eslint-disable no-unused-vars */
import moment from "moment";
import firebase from "./../../../../config/firebase";

export const fetchData = async ({ key, setLoading, setDocument, setBags }) => {
  try {
    setLoading(true);

    const database = firebase.database().ref();

    await Promise.all([
      database.child(`midMile/documents/${key}`).on("value", (snapshot) => {
        if (snapshot.exists()) {
          setDocument({
            key: snapshot.key,
            ...snapshot.val(),
          });
        }
      }),
      database
        .child("midMile/bags")
        .orderByChild("documentId")
        .equalTo(key)
        .on("value", (snapshot) => {
          setBags([]);
          snapshot.forEach((childSnapshot) => {
            setBags((prev) => [
              ...prev,
              {
                key: childSnapshot.key,
                ...childSnapshot.val(),
              },
            ]);
          });
        }),
    ]);

    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
    alert(`Error: ${error}`);
  }
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
    return;
  } else {
    const found = bagList.find((bag) => bag.bagNumber === state.searched);
    if (found) {
      // Initialize Database Reference
      const database = firebase.database().ref("test");

      // Update bag status to "Standby"
      if (found.statusBag === "Submitted") {
        await database
          .child(`midMile/bags/${found.key}`)
          .update({
            statusBag: statusBag,
            receivingDate: moment().format("YYYY-MM-DD h:mm A"),
          })
          .then(() => {
            database
              .child(`midMile/documents/${found.documentId}`)
              .update({
                latestUpdate: moment().format("YYYY-MM-DD h:mm A"),
                status:
                  document.status === "Submitted" && statusBag !== "Missing"
                    ? "Standby"
                    : document.status,
              })
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
export const handleEdit = async ({ state, bagList, setState }) => {
  if (state.searched === "") {
    alert("No. Bag kosong!");
    return;
  } else {
    const found = bagList.find((bag) => bag.bagNumber === state.searched);
    if (found) {
      const index = bagList.findIndex((bag) => bag.key === found.key);
      await setState({
        ...state,
        showRemarkModal: true,
        currentFocus: index,
      });
    } else {
      alert("Bag tidak ditemukan!");
      return;
    }
  }
};

// Handle Approve button click
export const handleApprove = ({ user, bagList, state, setState }) => {
  const isAllStandby = bagList.every((bag) => bag.statusBag === "Submitted");
  if (isAllStandby) {
    alert("Bag belum dikonfirmasi oleh tim Admin Airport");
    return;
  } else if (user === "") {
    alert("User tidak terbaca, silahkan refresh halaman atau login ulang");
    return;
  } else {
    setState({
      ...state,
      showApproveModal: true,
    });
  }
};

// Update data in database
export const approveData = async ({
  user,
  document,
  state,
  setLoading,
  setToast,
  onHide,
}) => {
  if (state.checker === "") {
    alert("Nama petugas gudang kosong!");
    return;
  } else {
    // Initiate Firebase Storage
    const database = firebase.database().ref("test");

    try {
      setLoading(true);

      // Setup updates
      let updates = {
        latestUpdate: moment().format("YYYY-MM-DD h:mm A"),
        airportUser: user,
        gudangUser: state.checker,
      };

      if (document.approvedDate === undefined) {
        updates = {
          ...updates,
          approvedDate: moment().format("YYYY-MM-DD h:mm A"),
        };
      }

      await database
        .child(`midMile/documents/${document.key}`)
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
    } catch (error) {
      setLoading(false);
      alert("Gagal update data");
    }
  }
};

// Update data in database = Start "Dalam Perjalanan" state
export const handleTransport = async ({
  document,
  bags,
  state,
  setLoading,
  setToast,
}) => {
  if (state.driver === "") {
    alert("Nama driver kosong");
    return;
  } else {
    // Initialize Database Reference
    const database = firebase.database().ref("test");

    try {
      setLoading(true);

      await database
        .child(`midMile/documents/${document.key}`)
        .update({
          status: "Dalam Perjalanan",
          transportedDate: moment().format("YYYY-MM-DD h:mm A"),
          latestUpdate: moment().format("YYYY-MM-DD h:mm A"),
          driverName: state.driver,
        })
        .then(async () => {
          await bags.forEach((bag) => {
            const { key, ...rest } = bag;
            if (bag.statusBag === "Standby") {
              database.child(`midMile/bags/${bag.key}`).update({
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
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
};

export const onTransportClick = ({
  document,
  bagList,
  state,
  setState,
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
    setState({
      ...state,
      showDriverModal: true,
    });
  }
};

export const handleReceivingByInbound = async ({
  document,
  bags,
  setLoading,
  inboundUser,
  setToast,
}) => {
  if (confirm("Konfirmasi approve?") === true) {
    // Filter Bag List from already Received Bags
    const unreceivedBags = bags.filter((bag) => "Received" !== bag.statusBag);

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
      // Initialize Database Reference
      const database = firebase.database().ref("test");

      await database
        .child(`midMile/documents/${document.key}`)
        .update({
          receivedDate: moment().format("YYYY-MM-DD h:mm A"),
          latestUpdate: moment().format("YYYY-MM-DD h:mm A"),
          inboundUser: inboundUser,
          status: finalStatus !== "" ? finalStatus : document.status,
        })
        .then(async () => {
          // Update Bag Details
          await bags.forEach((bag) => {
            if (bag.statusBag === "Dalam Perjalanan") {
              database.child(`midMile/bags/${bag.key}`).update({
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
    } catch (error) {
      setLoading(false);
      console.log(error);
      alert("Gagal approve");
    }
  }
};
