/* eslint-disable no-unused-vars */
import NavMenu from "../../../../components/partials/navbarMenu";
import firebase from "./../../../../config/firebase";
import { Button, Col, Container, Row } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useState } from "react";
import moment from "moment";
import DocumentTable from "../Home/partials/documentTable";

const PenarikanMidMile = () => {
  const [documents, setDocuments] = useState([]);
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
    const dbDocRef = firebase.database().ref("midMile/documents");
    const dbBagRef = firebase.database().ref("midMile/bags");

    dbDocRef
      .orderByChild("submittedDate")
      .startAt(`${state.dateFrom} 00:00`)
      .endAt(`${state.dateThru} 23:59`)
      .on("value", (documentSnapshot) => {
        let documents = [];

        documentSnapshot.forEach((document) => {
          let bags = [];

          dbBagRef
            .orderByChild("documentId")
            .equalTo(document.key)
            .on("value", (bagSnapshot) => {
              bagSnapshot.forEach((bag) => {
                bags.push({
                  key: bag.key,
                  ...bag.val(),
                });
              });
            });

          documents.push({
            key: document.key,
            bagList: bags,
            ...document.val(),
          });
        });

        setDocuments(documents);
      });
  };

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Penarikan Data</h2>
        <hr />
        <Row className="mb-3">
          <Col>
            <label htmlFor="dateFrom" className="mx-2">
              <strong>Date From</strong>
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
              <strong>Date From</strong>
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
        <Button className="me-2" onClick={() => fetchData()}>
          Submit
        </Button>
        {/* {documents.length ? <Button variant="success">Download</Button> : null} */}
        <hr />
        {show ? (
          <DocumentTable documents={documents} loading={loading} />
        ) : null}
      </Container>
    </div>
  );
};

export default PenarikanMidMile;
