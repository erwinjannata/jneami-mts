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
  setterBagList(
    bagList.map((lists, idx) => {
      if (idx == index) {
        return {
          ...lists,
          statusBag: "Dalam Perjalanan",
        };
      } else {
        return lists;
      }
    })
  );
  setterChangedItem(changedItem + 1);
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
    if (itemList[element].statusBag === "Menunggu Vendor") {
      itemList[element] = {
        ...itemList[element],
        statusBag: "Dalam Perjalanan",
      };
      changed++;
      setterChangedItem(changedItem + changed);
    }
  });
  setterCheckedIndex([]);
};

// Set Status Bag to "Unreceived"
export const handleUnreceive = (
  index,
  data,
  bagList,
  setterBagList,
  changedItem,
  setterChangedItem
) => {
  setterBagList(
    bagList.map((lists, idx) => {
      if (idx == index) {
        return {
          ...lists,
          statusBag: "Missing",
        };
      } else {
        return lists;
      }
    })
  );
  setterChangedItem(changedItem + 1);
};

// Set Status Bag to "Uneceived" to all selected items
export const handleUnreceiveChecked = (
  checkedIndex,
  setterCheckedIndex,
  itemList,
  changedItem,
  setterChangedItem
) => {
  let changed = 0;
  checkedIndex.forEach((element) => {
    if (itemList[element].statusBag === "Menunggu Vendor") {
      itemList[element] = {
        ...itemList[element],
        statusBag: "Missing",
      };
      changed++;
      setterChangedItem(changedItem + changed);
    }
  });
  setterCheckedIndex([]);
};

// Set Status Bag to "Overload"
export const handleOverload = (
  index,
  bagList,
  setterBagList,
  setterOverloadedItem,
  setterSelected,
  changedItem,
  setterChangedItem
) => {
  setterBagList(
    bagList.map((item, idx) => {
      if (idx == index) {
        return {
          ...item,
          statusBag: "Overload",
        };
      } else {
        return item;
      }
    })
  );
  setterOverloadedItem((item) => [...item, bagList[index]]);
  setterSelected((overloaded) => [...overloaded, index]);
  setterChangedItem(changedItem + 1);
};

// Cancel modification to Status Bag
export const handleCancel = (
  index,
  manifestNo,
  bagList,
  setterBagList,
  data,
  changedItem,
  setterChangedItem,
  selected,
  setterOverloadedItem
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
  if (selected.indexOf(index) > -1) {
    selected.splice(selected.indexOf(index), 1);
    setterOverloadedItem((currentItem) =>
      currentItem.filter((item) => {
        return item.manifestNo !== manifestNo;
      })
    );
  }
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

// Handle Approve data to database
export const handleApproval = async ({
  docNumber,
  key,
  dbRef,
  signatureImage,
  data,
  bagList,
  overloadedItem,
  setterOverloadedItem,
  setterChangedItem,
  setterLoading,
}) => {
  if (signatureImage === "") {
    alert("Tanda tangan tidak valid");
  } else {
    if (confirm("Konfirmasi approve?") === true) {
      setterLoading(true);
      const d = new Date();
      const year = d.getFullYear().toString().substring(2, 4);
      const departureDate = moment(d).locale("en-ca").format("L");
      const departureTime = moment(d).locale("en-sg").format("LT");
      const storage = getStorage();
      const metadata = {
        contentType: "image/png",
      };
      const storageRef = ref(
        storage,
        // `test/signatures/${year}-${docNumber}/vendorSign.png`
        `signatures/${year}-${docNumber}/vendorSign.png`
      );

      try {
        await uploadString(
          storageRef,
          signatureImage,
          "data_url",
          metadata
        ).then((snapshot) => {
          getDownloadURL(snapshot.ref).then(async (url) => {
            dbRef
              .child(key)
              .update({
                departureDate: departureDate,
                departureTime: departureTime,
                status: "Dalam Perjalanan",
                noRef: data.noRef,
                noPolisi: data.noPolisi,
                driver: data.driver,
                vendorSign: url,
                bagList: bagList.filter(
                  (bags) => !bags.statusBag.includes("Overload")
                ),
              })
              .then(() => {
                if (overloadedItem.length !== 0) {
                  setterOverloadedItem(
                    overloadedItem.map((item) => {
                      return { ...item, statusBag: "Menunggu Vendor" };
                    })
                  );
                  dbRef.push({
                    noSurat: `${data.noSurat}_${parseInt(data.count) + 1}`,
                    noRef: "",
                    origin: data.origin,
                    destination: data.destination,
                    bagList: overloadedItem,
                    approvedDate: departureDate,
                    approvedTime: departureTime,
                    preparedBy: data.preparedBy,
                    receivedDate: "",
                    receivedTime: "",
                    receivedBy: "",
                    checkerSign: data.checkerSign,
                    receiverSign: "",
                    vendorSign: "",
                    isArrived: false,
                    isReceived: false,
                    status: "Menunggu Vendor",
                    arrivalDate: "",
                    arrivalTime: "",
                    departureDate: "",
                    departureTime: "",
                    count: parseInt(data.count) + 1,
                  });
                }
                setterLoading(false);
                alert("Approved");
                setterChangedItem(0);
              })
              .catch((error) => {
                console.log(error);
                alert("Program mengalami kendala, silahkan hubungi tim IT");
              });
          });
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
};
