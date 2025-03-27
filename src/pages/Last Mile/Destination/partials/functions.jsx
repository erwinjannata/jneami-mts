import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import moment from "moment";

// Set Status Bag to "Received"
export const handleReceive = (
  index,
  data,
  bagList,
  setterBagList,
  changedItem,
  setterChangedItem
) => {
  if (data.status === "Menunggu Vendor") {
    alert("Bag belum diterima oleh vendor");
  } else {
    setterBagList(
      bagList.map((lists, idx) => {
        if (idx == index) {
          return {
            ...lists,
            statusBag: "Received",
          };
        } else {
          return lists;
        }
      })
    );
    setterChangedItem(changedItem + 1);
  }
};

// Set Status Bag to "Uneceived"
export const handleUnreceive = (
  index,
  data,
  bagList,
  setterBagList,
  changedItem,
  setterChangedItem
) => {
  if (data.status === "Menunggu Vendor") {
    alert("Bag belum diterima oleh vendor");
  } else {
    setterBagList(
      bagList.map((lists, idx) => {
        if (idx == index) {
          return {
            ...lists,
            statusBag: "Unreceived",
          };
        } else {
          return lists;
        }
      })
    );
    setterChangedItem(changedItem + 1);
  }
};

// Set Status Bag to "Received" to all selected items
export const handleReceiveChecked = (
  checkedIndex,
  setterCheckedIndex,
  itemList,
  changedItem,
  setterChangedItem
) => {
  let changed = 0;
  checkedIndex.forEach((element) => {
    if (
      itemList[element].statusBag !== "Missing" &&
      itemList[element].statusBag !== "Unreceived" &&
      itemList[element].statusBag !== "Received"
    ) {
      itemList[element] = {
        ...itemList[element],
        statusBag: "Received",
      };
      changed++;
      setterChangedItem(changedItem + changed);
    }
  });
  setterCheckedIndex([]);
};

// Set Status Bag to "Unreceived" to all selected items
export const handleUnreceiveChecked = (
  checkedIndex,
  setterCheckedIndex,
  itemList,
  changedItem,
  setterChangedItem
) => {
  let changed = 0;
  checkedIndex.forEach((element) => {
    if (
      itemList[element].statusBag === "Missing" ||
      itemList[element].statusBag === "Dalam Perjalanan"
    ) {
      itemList[element] = {
        ...itemList[element],
        statusBag: "Unreceived",
      };
      changed++;
      setterChangedItem(changedItem + changed);
    }
  });
  setterCheckedIndex([]);
};

// Cancel modification to Status Bag
export const handleCancel = (
  index,
  bagList,
  setterBagList,
  data,
  changedItem,
  setterChangedItem
) => {
  setterBagList(
    bagList.map((lists, idx) => {
      if (idx == index) {
        return {
          ...lists,
          statusBag: `${data.bagList[index].statusBag}`,
        };
      } else {
        return lists;
      }
    })
  );
  setterChangedItem(changedItem - 1);
};

// Handle changes in checkboxes
export const handleCheck = (event, item, checkedIndex, setterCheckedIndex) => {
  if (event.target.checked) {
    setterCheckedIndex([...checkedIndex, item]);
  } else {
    setterCheckedIndex((prev) =>
      prev.filter((currentItem) => currentItem != item)
    );
  }
};

// Handle changes in all checkboxes
export const handleCheckAll = (event, setterCheckedIndex, bagList) => {
  if (event.target.checked) {
    let id = [];
    bagList.forEach((item, index) => {
      id.push(index);
    });
    setterCheckedIndex(id);
  } else {
    setterCheckedIndex([]);
  }
};

// Handle Arrive data to database
export const handleArrive = async ({
  dbRef,
  data,
  setterLoading,
  setterChangedItem,
}) => {
  if (data.status === "Dalam Perjalanan") {
    if (confirm("Konfirmasi kedatangan armada") == true) {
      setterLoading(true);
      const d = new Date();
      const date = moment(d).locale("en-ca").format("L");
      const time = moment(d).locale("en-sg").format("LT");

      let berangkat = `${moment(data.departureDate).locale("id").format("L")} ${
        data.departureTime
      }:00`;
      let tiba = `${moment(date).locale("id").format("L")} ${time}:00`;
      let dura = moment(tiba, "DD/MM/YYYY HH:mm:ss").diff(
        moment(berangkat, "DD/MM/YYYY HH:mm:ss")
      );
      let durasi = moment.duration(dura);
      let finalDurasi = [
        Math.floor(durasi.asHours()) <= 0
          ? ""
          : `${Math.floor(durasi.asHours())} jam`,
        Math.floor(durasi.minutes() <= 0) ? "" : `${durasi.minutes()} menit`,
      ].join(Math.floor(durasi.asHours()) <= 0 ? "" : " ");

      await dbRef
        .child(data.key)
        .update({
          status: "Sampai Tujuan",
          isArrived: true,
          arrivalDate: date,
          arrivalTime: time,
          durasi: finalDurasi,
        })
        .then(() => {
          setterLoading(false);
          alert("Bag diterima, silahkan konfirmasi kelengkapan bag");
          setterChangedItem(0);
        })
        .catch(() => {
          alert("Program mengalami kendala, silahkan hubungi tim IT");
        });
    }
  } else {
    alert("Bag belum berangkat dari Origin");
  }
};

// Approve document
export const handleApproval = async ({
  dbRef,
  username,
  docNumber,
  signatureImage,
  data,
  bagList,
  setterLoading,
  setterChangedItem,
}) => {
  if (signatureImage === "") {
    alert("Tanda tangan receiver invalid");
  } else {
    if (confirm("Konfirmasi approve?") == true) {
      try {
        setterLoading(true);
        const d = new Date();
        const year = d.getFullYear().toString().substring(2, 4);
        const date = moment(d).locale("en-ca").format("L");
        const time = moment(d).locale("en-sg").format("LT");
        let checkUnreceive = bagList.some(
          (item) => "Unreceived" === item.statusBag
        );
        const storage = getStorage();
        const metaData = {
          contentType: "image/png",
        };
        const storageRef = ref(
          storage,
          // `test/signatures/${year}-${docNumber}/receiverSign.png`
          `signatures/${year}-${docNumber}/receiverSign.png`
        );
        await uploadString(
          storageRef,
          signatureImage,
          "data_url",
          metaData
        ).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            dbRef
              .child(data.key)
              .update({
                status: checkUnreceive ? "Received*" : "Received",
                isReceived: true,
                receivedBy: username,
                receivedDate: date,
                receivedTime: time,
                receiverSign: url,
                bagList: bagList.filter(
                  (bag) => !bag.statusBag.includes("Overload")
                ),
              })
              .then(() => {
                setterLoading(false);
                setterChangedItem(0);
                alert("Received");
              })
              .catch(() => {
                setterLoading(false);
                alert("Program mengalami kendala, silahkan hubungi tim IT");
              });
          });
        });
      } catch (error) {
        setterLoading(false);
        alert("Program mengalami kendala, silahkan hubungi tim IT");
      }
    }
  }
};
