/* eslint-disable no-unused-vars */
import * as XLSX from "xlsx";

export const readFiles = ({ files, setNumbers }) => {
  const isInvalid = files.every(
    (file) =>
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  if (files === undefined) {
    alert("File kosong!");
  } else if (isInvalid) {
    alert("Format file tidak sesuai, upload file dengan format Excel(XLSX)");
  } else {
    const data = [];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const raw_data = XLSX.utils.sheet_to_json(worksheet);
      const processed_data = [];

      raw_data.forEach((row) => {
        const smu = 
      })
    };
  }
};
