/* eslint-disable no-unused-vars */
import * as XLSX from "xlsx";
import firebase from "./../../../../../config/firebase";

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
      console.log(headers);
      rawData = rawData.map((row) => {
        let obj = {};
        headers.forEach((header, i) => {
          obj[header] = row[i];
        });
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

export const fetchTransactionData = ({
  state,
  setLoading,
  setData,
  setShowData,
}) => {
  setLoading(true);
  const dbRef = firebase.database().ref("empu/transactions");

  dbRef
    .orderByChild("dateAdded")
    .limitToLast(state.limit)
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
