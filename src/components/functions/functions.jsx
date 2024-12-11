import { utils, writeFile } from "xlsx";
import Print from "./../partials/printedDoc";
import moment from "moment";

// Handle Changes in Forms
export const handleChange = (e, state, stateSetter) => {
  const value = e.target.value;
  stateSetter({
    ...state,
    [e.target.name]: value,
  });
};

// Handle changes in Branch Options
export const handleCabang = (e, state, stateSetter) => {
  const value = e.target.value;
  stateSetter({
    ...state,
    [e.target.name]: value,
    filtered: false,
    currentFilter: "",
  });
};

// Handle processing data into XLSX file
export const handleExcel = (documentDetails, bagList) => {
  const processedData = bagList.map((row) => ({
    manifestNo: row.manifestNo,
    koli: row.koli,
    pcs: row.pcs,
    kg: row.kg,
    remark: row.remark,
    status: row.statusBag,
    noSurat: documentDetails.noSurat,
    statusBag: documentDetails.status,
  }));
  const worksheet = utils.json_to_sheet(processedData);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");
  utils.sheet_add_aoa(
    worksheet,
    [
      [
        "Manifest Number",
        "Koli",
        "Pcs",
        "Kg / Weight",
        "Remark",
        "Status Bag",
        "No Surat",
        "Status Manifest",
      ],
    ],
    { origin: "A1" }
  );
  writeFile(workbook, `${documentDetails.noSurat}.xlsx`);
};

export const handleDownloadPDF = (documentDetails, bagList) => {
  return (
    <Print
      data={bagList}
      noSurat={document.noSurat}
      noRef={documentDetails.noRef}
      date1={`${moment(documentDetails.approvedDate)
        .locale("id")
        .format("LL")} ${documentDetails.approvedTime}`}
      date2={
        documentDetails.receivedDate == ""
          ? "-"
          : `${moment(documentDetails.receivedDate)
              .locale("id")
              .format("LL")} ${documentDetails.receivedTime}`
      }
      origin={documentDetails.origin}
      destination={documentDetails.destination}
      checkerSign={documentDetails.checkerSign}
      vendorSign={documentDetails.vendorSign}
      receiverSign={documentDetails.receiverSign}
      checkerName={documentDetails.preparedBy}
      receiverName={documentDetails.receivedBy}
      driverName={documentDetails.driver}
      status={documentDetails.status}
      noPolisi={documentDetails.noPolisi}
    />
  );
};
