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

export const fetchCustomerData = ({ setLoading, setCustomerList }) => {
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

export const submitInboundData = ({ awbList, setLoading, doAfter }) => {
  if (awbList.length === 0) {
    alert("Tidak ada data AWB");
  } else {
    try {
      setLoading(true);
      const isNotDone = awbList.some((awb) => awb.customer === "");
      const d = new Date();
      const time = moment(d).locale("en-sg").format("LT");
      const date = moment(d).locale("en-ca").format("L");

      if (isNotDone) {
        alert("Data AWB belum lengkap");
      } else {
        const dbRef = firebase.database().ref("empu/inbound");
        awbList.forEach((awb) => {
          dbRef
            .orderByChild("awb")
            .equalTo(awb.awb)
            .get()
            .then((snapshot) => {
              if (!snapshot.exists()) {
                dbRef.push({
                  ...awb,
                  dateAdded: `${date} ${time}`,
                });
              }
            });
        });
        alert(`AWB berhasil di approve`);
        doAfter("/empu");
      }
    } catch (error) {
      alert(error);
    }
  }
};

// Handle processing data into XLSX file
export const handleExcel = ({ dataList }) => {
  const processedData = dataList.map((row) => ({
    awb: row.awb,
    customer: row.customer,
    customerType: row.customerType,
    pcs: row.pcs,
    weight: row.weight,
    amount: row.amount,
    status: row.status,
    dateAdded: new Date(row.dateAdded),
  }));
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
        "Pieces",
        "Weight",
        "Amount",
        "Status",
        "Date Added",
      ],
    ],
    { origin: "A1" }
  );
  XLSX.writeFile(workbook, `empu.xlsx`);
};
