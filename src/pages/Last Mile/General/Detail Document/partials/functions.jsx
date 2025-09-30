import moment from "moment";
import firebase from "../../../../../config/firebase";

export const fetchData = ({ key, setLoading, setDocument, setBags, route }) => {
  const database = firebase.database().ref();

  try {
    setLoading(true);
    database.child(`eMTS/documents/${key}`).on("value", (snapshot) => {
      if (snapshot.exists()) {
        setDocument({
          key: snapshot.key,
          ...snapshot.val(),
        });
        database
          .child("eMTS/bags")
          .orderByChild("docId")
          .equalTo(key)
          .on("value", (snapshot) => {
            let bags = [];
            snapshot.forEach((childSnapshot) => {
              bags.push({
                key: childSnapshot.key,
                isSelected: false,
                ...childSnapshot.val(),
              });
              setBags(bags);
            });
          });
      } else {
        route("/");
      }
    });
  } catch (error) {
    route("/");
  } finally {
    setLoading(false);
  }
};

export const handleCheck = ({ index, setBags }) => {
  setBags((prev) =>
    prev.map((bag, i) =>
      i === index ? { ...bag, isSelected: !bag.isSelected } : bag
    )
  );
};

export const handleCheckAll = ({ bags, setBags }) => {
  const isAll = bags.every((bag) => bag.isSelected);

  setBags((prev) => prev.map((bag) => ({ ...bag, isSelected: !isAll })));
};

export const handleRemark = async ({ bag, setLoading, remark, setShow }) => {
  try {
    const database = firebase.database().ref();

    setLoading(true);

    database
      .child(`eMTS/bags/${bag.key}`)
      .update({
        remark: remark,
      })
      .then(() => {
        setLoading(false);
        setShow(false);
      });
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
};

export const handleTransport = async ({
  document,
  bags,
  detailDriver,
  setLoading,
  setShow,
  setForm,
}) => {
  try {
    setLoading(true);
    const database = firebase.database().ref();

    // Update bags details
    await Promise.all(
      bags.map((bag) => {
        if (bag.isSelected && bag.status === "Standby") {
          database.child(`eMTS/bags/${bag.key}`).update({
            status: "Dalam Perjalanan",
          });
        }
        return Promise.resolve();
      })
    );

    // Update document details
    await database.child(`eMTS/documents/${document.key}`).update({
      departure: moment().format("YYYY-MM-DD HH:mm"),
      driver: detailDriver.driver,
      noPolisi: detailDriver.noPolisi,
      noRef: detailDriver.noRef,
      status: "Dalam Perjalanan",
    });

    setForm({
      driver: "",
      noRef: "",
      noPolisi: "",
    });
    setShow(false);
    setLoading(false);
    alert("Update berhasil, kiriman dalam proses Transport menuju Destinasi");
  } catch (error) {
    console.log(error);
    setLoading(false);
    alert("Error updating bags");
  }
};

export const handleOverload = async ({ document, bags, setLoading, user }) => {
  const isAllSelected = bags.every((bag) => bag.isSelected);
  const isAllTransported = bags.every(
    (bag) => bag.status === "Dalam Perjalanan"
  );
  const selectedBag = bags.filter((bag) => bag.isSelected);
  const isSelectedNotStandby = selectedBag.every(
    (bag) => bag.status !== "Standby"
  );

  if (isAllSelected) {
    alert("Tidak bisa mengupdate semua bag dengan status Overload");
    return;
  } else if (isAllTransported) {
    alert("Semua bag sudah dalam proses Transport, tidak bisa mengupdate bag");
    return;
  } else if (document.status === "Received") {
    alert("Semua bag sudah melalui proses proses Receiving");
    return;
  } else if (isSelectedNotStandby) {
    alert("Bag yang dipilih tidak dalam status Standby di Origin");
    return;
  }

  try {
    const notOverloadedBags = bags.filter((bag) => !bag.isSelected);
    const overloadedBags = bags.filter(
      (bag) => bag.isSelected && bag.status === "Standby"
    );

    const number = document.noSurat.split("_");

    const database = firebase.database().ref();
    const keyReference = database.child("eMTS").push().key;

    setLoading(true);

    // Create New Document for Overloaded Bags
    await database.child(`eMTS/documents/${keyReference}`).set({
      noSurat: `${number[0]}_${document.count + 1}`,
      origin: document.origin,
      destination: document.destination,
      status: "Standby",
      approved: moment().format("YYYY-MM-DD HH:mm"),
      approveUser: user,
      totalPcs: overloadedBags.reduce((prev, next) => {
        return prev + parseInt(next.pcs);
      }, 0),
      totalWeight: overloadedBags.reduce((prev, next) => {
        return prev + parseInt(next.weight);
      }, 0),
      count: document.count + 1,
    });

    await Promise.all(
      // Update status and docId for Overloaded Bags
      bags.map((bag) => {
        if (bag.isSelected && bag.status === "Standby") {
          database.child(`eMTS/bags/${bag.key}`).update({
            docId: keyReference,
            status: "Standby",
          });
        }
        return Promise.resolve();
      })
    );

    // Update previous documents TotalKoli and TotalPcs
    await database.child(`eMTS/documents/${document.key}`).update({
      totalPcs: notOverloadedBags.reduce((prev, next) => {
        return prev + parseInt(next.pcs);
      }, 0),
      totalWeight: notOverloadedBags.reduce((prev, next) => {
        return prev + parseInt(next.weight);
      }, 0),
      count: document.count + 1,
    });

    setLoading(false);
    alert(
      "Dokumen berhasil diupdate, No. Manifest overload sudah dipindahkan ke Surat Manifest baru"
    );
  } catch (error) {
    console.log(error);
    setLoading(false);
    alert("Error updating bags");
  }
};

export const handleReceiving = async ({ document, bags, user, setLoading }) => {
  try {
    const isNoneSelected = bags.every((bag) => !bag.isSelected);

    if (isNoneSelected) {
      alert("Tidak ada bag dipilih");
      return;
    } else if (document.status === "Received") {
      alert("Semua bag sudah di Receiving");
      return;
    } else if (document.status === "Standby") {
      alert("Dokument belum melalui proses Transport, tidak bisa di Receiving");
      return;
    }

    setLoading(true);
    const database = firebase.database().ref();

    await Promise.all(
      // Update bag details
      bags.map((bag) => {
        if (bag.isSelected && bag.status === "Dalam Perjalanan") {
          return database.child(`eMTS/bags/${bag.key}`).update({
            status: "Received",
            receivedDate: moment().format("YYYY-MM-DD HH:mm"),
          });
        }
        return Promise.resolve();
      })
    );

    const updatedBags = bags.map((bag) => ({
      ...bag,
      status:
        bag.isSelected && bag.status === "Dalam Perjalanan"
          ? "Received"
          : bag.status,
    }));

    const allReceived = updatedBags.every((bag) => bag.status === "Received");
    const hasTransporting = updatedBags.some(
      (bag) => bag.status === "Dalam Perjalanan"
    );

    let documentStatus;
    if (hasTransporting) {
      documentStatus = "Dalam Perjalanan";
    } else if (allReceived) {
      documentStatus = "Received";
    } else {
      documentStatus = "Received*";
    }

    // Update document details
    await database.child(`eMTS/documents/${document.key}`).update({
      received:
        document.received === undefined
          ? moment().format("YYYY-MM-DD HH:mm")
          : document.received,
      receiveUser: user,
      status: documentStatus,
    });

    setLoading(false);
    alert("Bags Received");
  } catch (error) {
    console.log(error);
    setLoading(false);
    alert("Error updating bags");
  }
};

export const handleUnreceiving = async ({ document, bags, setLoading }) => {
  try {
    const isNoneChecked = bags.every((bag) => !bag.isSelected);

    if (isNoneChecked) {
      alert("Tidak ada bag dipilih");
      return;
    } else if (document.status === "Standby") {
      alert("Dokumen belum melalui proses Transport, tidak bisa di Receiving");
      return;
    }

    setLoading(true);
    const database = firebase.database().ref();

    await Promise.all(
      // Update bag status
      bags.map((bag) => {
        if (bag.isSelected && bag.status === "Dalam Perjalanan") {
          database.child(`eMTS/bags/${bag.key}`).update({
            status: "Unreceived",
            remark: bag.remark,
          });
        }
        return Promise.resolve();
      })
    );

    const updatedBags = bags.map((bag) => ({
      ...bag,
      status:
        bag.isSelected && bag.status === "Dalam Perjalanan"
          ? "Unreceived"
          : bag.status,
    }));

    const allUnreceived = updatedBags.every(
      (bag) => bag.status === "Unreceived"
    );
    const hasTransporting = updatedBags.some(
      (bag) => bag.status === "Dalam Perjalanan"
    );

    let documentStatus;
    if (hasTransporting) {
      documentStatus = "Dalam Perjalanan";
    } else if (allUnreceived) {
      documentStatus = "Unreceived";
    } else {
      documentStatus = "Received*";
    }

    // Update document detail
    await database.child(`eMTS/documents/${document.key}`).update({
      status: documentStatus,
    });

    setLoading(false);
    alert("Bags Unreceived");
  } catch (error) {
    console.log(error);
    setLoading(false);
    alert("Error updating bags");
  }
};
