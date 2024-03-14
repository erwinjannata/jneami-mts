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

export default function Penarikan() {
  const d = new Date();
  const [state, setState] = useState({
    start: moment(d).locale("en-ca").format("L"),
    end: moment(d).locale("en-ca").format("L"),
  });
  let db = firebase.database().ref("manifestTransit");
  const [dataList, setDataList] = useState([]);
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    db.orderByChild("approveDate")
      .startAt(state.start)
      .endAt(state.end)
      .on("value", (snapshot) => {
        let data = [];

        snapshot.forEach((childSnapshot) => {
          data.push({
            key: childSnapshot.key,
            noSurat: childSnapshot.val().noSurat,
            noRef: childSnapshot.val().noRef,
            origin: childSnapshot.val().origin,
            destination: childSnapshot.val().destination,
            approvedDate: childSnapshot.val().approveDate,
            approvedTime: childSnapshot.val().approveTime,
            preparedBy: childSnapshot.val().preparedBy,
            receivedDate: childSnapshot.val().receivedDate,
            receivedTime: childSnapshot.val().receivedTime,
            receivedBy: childSnapshot.val().receivedBy,
            status: childSnapshot.val().status,
            sumPcs: childSnapshot.val().sumPcs,
            sumWeight: childSnapshot.val().sumWeight,
          });
        });
        setDataList(data);
      });
    setShow(true);
  };

  const handleDownload = () => {
    const processedData = dataList.map((row) => ({
      noSurat: row.noSurat,
      noRef: row.noRef,
      origin: row.origin,
      destination: row.destination,
      status: row.status,
      pcs: row.sumPcs,
      kg: row.sumWeight,
      preparedBy: row.preparedBy,
      approvedDate: new Date(row.approvedDate),
      approvedTime: row.approvedTime,
      receivedBy: row.receivedBy,
      receivedDate: row.receivedDate == "" ? "" : new Date(row.receivedDate),
      receivedTime: row.receivedTime,
    }));
    const worksheet = utils.json_to_sheet(processedData.reverse());
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data List");
    utils.sheet_add_aoa(
      worksheet,
      [
        [
          "No. Surat",
          "No. Referensi Vendor",
          "Origin",
          "Destination",
          "Status",
          "Total Pcs",
          "Total Weight",
          "Approved by",
          "Approved Date",
          "Approved Time",
          "Received by",
          "Received Date",
          "Received Time",
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
    <>
      <Menu />
      <Container className="mt-4">
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
            <Table responsive>
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
                        <tr key={key}>
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
    </>
  );
}
