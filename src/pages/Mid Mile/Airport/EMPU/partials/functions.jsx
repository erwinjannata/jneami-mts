/* eslint-disable no-unused-vars */
import * as XLSX from "xlsx";
import firebase from "./../../../../../config/firebase";
import moment from "moment";

export const readFile = ({ file, setAwbList }) => {
  if (file === undefined) {
    alert("File kosong!");
  } else if (
    file.type !==
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    alert("Format File tidak sesuai");
  } else {
    const reader = new FileReader();

    reader.onload = (e) => {
      // Read uploaded file
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Process raw data
      let rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(2);
      // Read only certain Column
      const columnToRead = ["E", "H", "I", "J"];
      rawData = rawData.map((row) =>
        columnToRead.map((column) => row[XLSX.utils.decode_col(column)])
      );
      // Exclude certain row
      const rowToExlclude = [0, 1, 2, 3];
      rawData = rawData.filter((_, index) => !rowToExlclude.includes(index));
      const headers = rawData.shift();
      rawData = rawData.map((row) => {
        let obj = {};
        obj["awb"] = row[0];
        obj["status"] = row[1];
        obj["pcs"] = row[2];
        obj["weight"] = row[3];
        obj["customer"] = "";
        obj["amount"] = 0;
        return obj;
      });
      rawData.pop();
      setAwbList(rawData);
    };
    reader.readAsBinaryString(file);
  }
};

export const fetchCustomerData = ({
  setLoading,
  setCustomerList,
  setShowCustomerList,
}) => {
  setLoading(true);
  const dbRef = firebase.database().ref("empu/customers");

  dbRef.orderByChild("dateAdded").on("value", (snapshot) => {
    let data = [];
    snapshot.forEach((childSnapshot) => {
      data.push({
        key: childSnapshot.key,
        ...childSnapshot.val(),
      });
    });
    setCustomerList(data);
    if (setShowCustomerList !== undefined) {
      setShowCustomerList(data);
    }
    setLoading(false);
  });
};

export const fetchInboundData = ({
  state,
  setLoading,
  setData,
  setShowData,
}) => {
  setLoading(true);

  // Test Env
  // const dbRef = firebase.database().ref("test/empu/inbound");

  // Production Env
  const dbRef = firebase.database().ref("empu/inbound");

  dbRef
    .orderByChild("dateAdded")
    .limitToLast(parseInt(state.limit))
    .on("value", (snapshot) => {
      let data = [];
      snapshot.forEach((childSnapshot) => {
        data.push({
          key: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setData(data);
      setShowData(data);
      setLoading(false);
    });
};

export const submitInboundData = ({ state, setLoading, doAfter }) => {
  if (state.awb === "") {
    alert("AWB kosong");
  } else if (state.pcs === 0) {
    alert("Pcs invalid");
  } else if (state.weight === 0) {
    alert("Berat invalid");
  } else if (state.customerId === "") {
    alert("Customer invalid");
  } else if (state.paymentMethod === "") {
    alert("Metode pembayaran belum dipilih");
  } else {
    setLoading(true);
    const d = new Date();
    const time = moment(d).locale("en-sg").format("LT");
    const date = moment(d).locale("en-ca").format("L");

    // Initialize Database Reference
    // Test Env
    // const dbRef = firebase.database().ref("test/empu/inbound");

    // Production Env
    const dbRef = firebase.database().ref("empu/inbound");

    dbRef
      .orderByChild("awb")
      .equalTo(state.awb)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists()) {
          dbRef
            .push({
              ...state,
              dateAdded: `${date} ${time}`,
              paymentStatus:
                state.paymentMethod === "CREDIT" ? "UNPAID" : "PAID",
              paymentDate:
                state.paymentMethod === "CASH" ? `${date} ${time}` : "",
            })
            .then(() => {
              alert(`AWB berhasil di approve`);
              doAfter("/empu");
            })
            .catch((error) => {
              alert(error);
              setLoading(false);
            });
        } else {
          alert("AWB sudah terdaftar");
          setLoading(false);
        }
      });
  }
};

// Handle processing data into XLSX file
export const handleExcel = ({ dataList, customerList }) => {
  const processedData = dataList.map((row) => {
    let idx = customerList.findIndex(
      (customer) => customer.key === row.customerId
    );

    return {
      awb: row.awb,
      customer: customerList[idx].customerName,
      customerType: row.customerType,
      pcs: row.pcs,
      weight: row.weight,
      reqTS: row.reqTS === true ? "Y" : "N",
      isDG: row.isDG === true ? "Y" : "N",
      isSurcharged: row.isSurcharge === true ? "Y" : "N",
      surchargeDay: row.surchargeDay,
      keterangan: row.keterangan,
      dateAdded: new Date(row.dateAdded),
      amount: row.amount,
      additionalCharge: row.additionalCharge || 0,
      totalAmount: row.totalAmount || row.amount,
      paymentMethod: row.paymentMethod,
      paymentStatus: row.paymentStatus,
      paymentDate:
        row.paymentDate === "" || row.paymentDate === undefined
          ? ""
          : new Date(row.paymentDate),
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(processedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      [
        "AWB",
        "Customer",
        "Customer Type",
        "Koli",
        "Weight",
        "Request TS",
        "Special Handling",
        "Penimbunan",
        "Penimbunan (Hari)",
        "Keterangan",
        "Date Added",
        "Amount",
        "Additional Charge",
        "Total Amount",
        "Payment Method",
        "Payment Status",
        "Payment Date",
      ],
    ],
    { origin: "A1" }
  );
  XLSX.writeFile(workbook, `empu.xlsx`);
};
