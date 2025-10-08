import { utils, writeFile } from "xlsx";
import moment from "moment";

// Handle Changes in Forms
export const handleChange = ({ e, state, stateSetter }) => {
  const value = e.target.value;
  stateSetter({
    ...state,
    [e.target.name]: value,
  });
};

export const filterByRoute = ({ data, state }) => {
  if (state.origin === "All Cabang" && state.destination !== "All Cabang") {
    return data.filter((item) => item.destination === state.destination);
  } else if (
    state.origin !== "All Cabang" &&
    state.destination === "All Cabang"
  ) {
    return data.filter((item) => item.origin === state.origin);
  } else if (
    state.origin !== "All Cabang" &&
    state.destination !== "All Cabang"
  ) {
    return data.filter(
      (item) =>
        item.origin === state.origin && item.destination === state.destination
    );
  }
  return data;
};

// Handle processing data into XLSX file
export const handleExcel = (documentDetails, bagList) => {
  const processedData = bagList.map((row) => ({
    manifestNo: row.manifestNo,
    koli: parseInt(row.koli),
    pcs: parseInt(row.pcs),
    kg: parseInt(row.weight),
    remark: row.remark,
    status: row.status,
    mtsDate: row.mtsDate,
    receivedDate: row.receivedDate,
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
        "MTS Date",
        "Received Date",
        "No Surat",
        "Status Manifest",
      ],
    ],
    { origin: "A1" }
  );
  writeFile(workbook, `${documentDetails.noSurat}.xlsx`);
};

// Handle Download data
export const handleDownload = ({ documents, bags, startDate, endDate }) => {
  let processedData = [];

  bags.map((bag) => {
    const doc = documents.find((document) => document.key === bag.docId);

    processedData.push({
      manifestNo: bag.manifestNo,
      koli: parseInt(bag.koli),
      pcs: parseInt(bag.pcs),
      weight: parseInt(bag.weight),
      status: bag.status,
      remark: bag.remark,
      noSurat: doc.noSurat,
      origin: doc.origin,
      destination: doc.destination,
      docStatus: doc.status,
      approved: bag.mtsDate,
      approvedUser: doc.approvedUser,
      received: bag.receivedDate,
      receivedUser: doc.receiveUser,
      departure: doc.departure,
      driver: doc.driver,
      noPolisi: doc.noPolisi,
      noRef: doc.noRef,
    });
  });

  generateExcel({
    data: processedData,
    start: startDate,
    end: endDate,
  });
};

export const generateExcel = ({ data, start, end }) => {
  // Generate Excel
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Data List");
  utils.sheet_add_aoa(
    worksheet,
    [
      [
        "No. Manifest",
        "Koli",
        "Pcs",
        "Weight",
        "Status",
        "Remark",
        "No. Surat Manifest",
        "Origin",
        "Destination",
        "Status Surat Manifest",
        "MTS Date",
        "Approve User",
        "Received",
        "Received User",
        "Departure",
        "Driver",
        "No. Polisi Kendaraan",
        "No. Referensi Vendor",
      ],
    ],
    { origin: "A1" }
  );
  writeFile(
    workbook,
    `MTM ${moment(start).locale("id").format("LL")} - ${moment(end)
      .locale("id")
      .format("LL")}.xlsx`
  );
};
