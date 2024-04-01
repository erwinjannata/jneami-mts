/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Menu from "../components/menu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "moment/locale/en-ca";
import "moment/locale/id";
import firebase from "./../config/firebase";
import { useState } from "react";
import { utils, writeFile } from "xlsx";
import { MdFileDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Penarikan() {
  const d = new Date();
  let navigate = useNavigate();
  const [state, setState] = useState({
    start: moment(d).locale("en-ca").format("L"),
    end: moment(d).locale("en-ca").format("L"),
  });
  let db = firebase.database().ref("manifestTransit");
  const [dataList, setDataList] = useState([]);
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    db.orderByChild("approvedDate")
      .startAt(state.start)
      .endAt(state.end)
      .on("value", (snapshot) => {
        let data = [];

        snapshot.forEach((childSnapshot) => {
          data.push({
            key: childSnapshot.key,
            noSurat: childSnapshot.val().noSurat,
            noRef: childSnapshot.val().noRef,
            noPolisi: childSnapshot.val().noPolisi,
            origin: childSnapshot.val().origin,
            destination: childSnapshot.val().destination,
            preparedBy: childSnapshot.val().preparedBy,
            approvedDate: childSnapshot.val().approvedDate,
            approvedTime: childSnapshot.val().approvedTime,
            receivedDate: childSnapshot.val().receivedDate,
            receivedTime: childSnapshot.val().receivedTime,
            arrivalDate: childSnapshot.val().arrivalDate,
            arrivalTime: childSnapshot.val().arrivalTime,
            durasi: childSnapshot.val().durasi,
            departureDate: childSnapshot.val().departureDate,
            departureTime: childSnapshot.val().departureTime,
            receivedBy: childSnapshot.val().receivedBy,
            status: childSnapshot.val().status,
            sumPcs: childSnapshot.val().sumPcs,
            sumWeight: childSnapshot.val().sumWeight,
            driver: childSnapshot.val().driver,
            bagList: childSnapshot.val().bagList,
          });
        });
        setDataList(data);
      });
    setShow(true);
  };

  const handleDownload = () => {
    let processedData = [];
    dataList.map((row, idx) => {
      for (let i = 0; i < dataList[idx].bagList.length; i++) {
        processedData.push({
          noManifest: dataList[idx].bagList[i].manifestNo,
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
          approvedDate: new Date(row.approvedDate),
          approvedTime: row.approvedTime,
          receivedBy: row.receivedBy,
          receivedDate:
            row.receivedDate == "" ? "" : new Date(row.receivedDate),
          receivedTime: row.receivedTime,
          departureDate:
            row.departureDate == "" ? "" : new Date(row.departureDate),
          departureTime: row.departureTime,
          arrivalDate: row.arrivalDate == "" ? "" : new Date(row.arrivalDate),
          arrivalTime: row.arrivalTime,
          durasi: row.durasi,
          noPolisi: row.noPolisi,
          driver: row.driver,
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
          "Approved Time",
          "Received by",
          "Received Date",
          "Received Time",
          "Tanggal Keberangkatan",
          "Waktu Keberangkatan",
          "Tanggal Kedatangan",
          "Waktu Kedatangan",
          "Durasi Perjalanan",
          "No. Polisi Kendaraan",
          "Driver",
        ],
      ],
      { origin: "A1" }
    );
    writeFile(
      workbook,
      `MTM ${moment(state.start).locale("id").format("LL")} - ${moment(
        state.end
      )
        .locale("id")
        .format("LL")}.xlsx`
    );
  };

  return (
    <div className="screen">
      <Menu />
      <Container>
        <h2>Penarikan Data</h2>
        <hr />
        <Row>
          <Col>
            <label htmlFor="startDate" className="mx-2">
              <strong>{`Dari :`}</strong>
            </label>
            <DatePicker
              title="Start Date"
              placeholder="Start Date"
              className="form-control form-control-solid"
              selected={state.start}
              onChange={(date) =>
                setState({
                  ...state,
                  start: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
          <Col>
            <label htmlFor="endDate" className="mx-2">
              <strong>{`Hingga :`}</strong>
            </label>
            <DatePicker
              id="endDate"
              title="End Date"
              placeholder="End Date"
              className="form-control form-control-solid"
              selected={state.end}
              onChange={(date) =>
                setState({
                  ...state,
                  end: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Button variant="primary" className="mx-2" onClick={handleSubmit}>
              Go
            </Button>
            {dataList.length == 0 ? null : (
              <>
                <Button
                  variant="success"
                  className="mx-2"
                  onClick={handleDownload}
                >
                  <MdFileDownload /> Download
                </Button>
                <Button
                  variant="outline-secondary"
                  className="mx-2"
                  onClick={() => {
                    setDataList([]), setShow(false);
                  }}
                >
                  Clear
                </Button>
              </>
            )}
          </Col>
        </Row>
        <hr />
        {show ? (
          <div
            style={{
              maxHeight: "500px",
              display: "block",
              overflowY: "scroll",
            }}
          >
            <Table responsive hover>
              <thead>
                <tr>
                  <th>No. Surat</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Approved at</th>
                  <th>Received at</th>
                </tr>
              </thead>
              <tbody>
                {dataList.length == 0 ? (
                  <>
                    <tr>
                      <td colSpan={6} align="center">
                        <i>Data tidak ditemukan</i>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {dataList
                      .map((item, key) => (
                        <tr
                          key={key}
                          onClick={() => navigate(`/doc/${item.key}`)}
                        >
                          <td>{item.noSurat}</td>
                          <td>{item.origin}</td>
                          <td>{item.destination}</td>
                          <td>{item.status}</td>
                          <td>{`${item.approvedDate} ${item.approvedTime}`}</td>
                          <td>
                            {item.receivedDate == ""
                              ? "-"
                              : `${item.receivedDate} ${item.receivedTime}`}
                          </td>
                        </tr>
                      ))
                      .reverse()}
                  </>
                )}
              </tbody>
            </Table>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
