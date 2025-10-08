import firebase from "@/config/firebase";
import { Button, Col, Container, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import MidMileBagTable from "@/pages/Mid Mile/Detail Document/partials/bagTable";

const PenarikanMidMile = () => {
  const [documents, setDocuments] = useState([]);
  const [bags, setBags] = useState([]);
  const [smu, setSMU] = useState([]);
  const [state, setState] = useState({
    dateFrom: moment().locale("en-ca").format("L"),
    dateThru: moment().locale("en-ca").format("L"),
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    // Display Table Data
    setShow(true);

    // Initialize Database Reference
    const database = firebase.database().ref();

    database
      .child("midMile/bags")
      .orderByChild("receivingDate")
      .startAt(`${state.dateFrom} 00:00`)
      .endAt(`${state.dateThru} 23:59`)
      .on("value", (bagSnapshot) => {
        let bags = [];

        bagSnapshot.forEach((bag) => {
          bags.push({
            ...bag.val(),
          });
        });

        // Get the document key and render it to Collection
        const documentKeys = [...new Set(bags.map((bag) => bag.documentId))];
        documentKeys.forEach((document) => {
          let documents = [];
          database
            .child(`midMile/documents/${document}`)
            .on("value", (documentSnapshot) => {
              documents.push({
                ...documentSnapshot.val(),
                key: documentSnapshot.key,
              });
              setDocuments(documents);
            });
        });

        const smus = [...new Set(bags.map((bag) => bag.sm))];

        setSMU(smus);
        setBags(bags);
      });
  };

  // Handle processing data into XLSX file
  const handleExcel = () => {
    setLoading(true);
    const processedData = bags.map((row) => {
      let idx = documents.findIndex(
        (document) => document.key === row.documentId
      );

      return {
        bagNo: row.bagNumber,
        smu: row.sm,
        koli: row.koli,
        weight: row.weight,
        status: row.statusBag,
        remark: row.remark,
        receivingDate: row.receivingDate,
        documentNumber: documents[idx].documentNumber,
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Bag No.",
          "SMU",
          "Koli",
          "Weight",
          "Status",
          "Remark",
          "Receiving Date",
          "Document No.",
        ],
      ],
      { origin: "A1" }
    );
    XLSX.writeFile(workbook, `midmile.xlsx`);
    setLoading(false);
  };

  return (
    <Container>
      <h2>Penarikan Data</h2>
      <hr />
      <div className="rounded border p-4">
        <Row className="mb-3">
          <Col>
            <label htmlFor="dateFrom" className="mx-2">
              <strong>Date From: </strong>
            </label>
            <DatePicker
              id="dateFrom"
              portalId="root-portal"
              title="End Date"
              placeholder="End Date"
              className="form-control form-control-solid"
              selected={state.dateFrom}
              onChange={(date) =>
                setState({
                  ...state,
                  dateFrom: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
          <Col>
            <label htmlFor="dateThru" className="mx-2">
              <strong>Date Thru: </strong>
            </label>
            <DatePicker
              id="dateThru"
              portalId="root-portal"
              title="End Date"
              placeholder="End Date"
              className="form-control form-control-solid"
              selected={state.dateThru}
              onChange={(date) =>
                setState({
                  ...state,
                  dateThru: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
        </Row>
        <Button className="me-2" onClick={() => fetchData()} disabled={loading}>
          Submit
        </Button>
        {documents.length ? (
          <Button
            variant="success"
            onClick={() => handleExcel()}
            disabled={loading}
          >
            Download
          </Button>
        ) : null}
        <hr />
        {show ? (
          <>
            <MidMileBagTable bagList={bags} loading={loading} />
            <hr />
            <Row>
              <Col xs={4} md={4}>
                <p>
                  <strong>Bag: </strong>
                  <br />
                  {bags.length} Bag
                </p>
              </Col>
              <Col xs={4} md={4}>
                <p>
                  <strong>SMU: </strong>
                  <br />
                  {smu.length} SMU
                </p>
              </Col>
              <Col xs={4} md={4}>
                <p>
                  <strong>Weight: </strong>
                  <br />
                  {`${bags.reduce((prev, next) => {
                    return prev + parseInt(next.weight);
                  }, 0)} kg`}
                </p>
              </Col>
            </Row>
          </>
        ) : null}
      </div>
    </Container>
  );
};

export default PenarikanMidMile;
