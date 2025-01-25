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

// Handle Download data
export const handleDownload = (dataList, startDate, endDate) => {
  let processedData = [];
  dataList.map((row, idx) => {
    for (let i = 0; i < dataList[idx].bagList.length; i++) {
      processedData.push({
        noManifest: dataList[idx].bagList[i].manifestNo,
        koli:
          dataList[idx].bagList[i].koli == undefined
            ? "-"
            : parseFloat(dataList[idx].bagList[i].koli),
        pcs: parseFloat(dataList[idx].bagList[i].pcs),
        kg: parseFloat(dataList[idx].bagList[i].kg),
        remark: dataList[idx].bagList[i].remark,
        statusBag: dataList[idx].bagList[i].statusBag,
        noSurat: row.noSurat,
        noRef: row.noRef,
        origin: row.origin,
        destination: row.destination,
        status: row.status,
        preparedBy: row.preparedBy,
        approvedDate: new Date(
          new Date(row.approvedDate).setHours(
            row.approvedTime.split(":")[0],
            row.approvedTime.split(":")[1],
            0
          )
        ),
        receivedBy: row.receivedBy,
        receivedDate:
          row.receivedDate == ""
            ? ""
            : new Date(
                new Date(row.receivedDate).setHours(
                  row.receivedTime.split(":")[0],
                  row.receivedTime.split(":")[1],
                  0
                )
              ),
        departureDate:
          row.departureDate == ""
            ? ""
            : new Date(
                new Date(row.departureDate).setHours(
                  row.departureTime.split(":")[0],
                  row.departureTime.split(":")[1],
                  0
                )
              ),
        arrivalDate:
          row.arrivalDate == ""
            ? ""
            : new Date(
                new Date(row.arrivalDate).setHours(
                  row.arrivalTime.split(":")[0],
                  row.arrivalTime.split(":")[1],
                  0
                )
              ),
        durasi: parseFloat(row.durasiJam),
        noPolisi: row.noPolisi,
        driver: row.driver,
        // statusWaktu: row.statusWaktu,
      });
    }
  });
  const worksheet = utils.json_to_sheet(processedData.reverse());
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Data List");
  utils.sheet_add_aoa(
    worksheet,
    [
      [
        "No. Manifest",
        "Koli",
        "Pcs",
        "Kg",
        "Remark",
        "Status Bag",
        "No. Surat Manifest",
        "No. Referensi Vendor",
        "Origin",
        "Destination",
        "Status Manifest",
        "Approved by",
        "Approved Date",
        "Received by",
        "Received Date",
        "Tanggal Keberangkatan",
        "Tanggal Kedatangan",
        "Durasi Perjalanan (Jam)",
        "No. Polisi Kendaraan",
        "Driver",
        // "Status Waktu",
      ],
    ],
    { origin: "A1" }
  );
  writeFile(
    workbook,
    `MTM ${moment(startDate).locale("id").format("LL")} - ${moment(endDate)
      .locale("id")
      .format("LL")}.xlsx`
  );
};
