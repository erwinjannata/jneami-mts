/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useState } from "react";
import { cabangList } from "../../../../components/data/branchList";
import "react-datepicker/dist/react-datepicker.css";
import firebase from "../../../../config/firebase";
import DatePicker from "react-datepicker";
import NavMenu from "../../../../components/partials/navbarMenu";
import PieChart from "../../../../components/partials/pieChart";
import moment from "moment";
import "moment/locale/en-ca";
import "moment/locale/id";
import {
  filterByRoute,
  handleChange,
  handleDownload,
} from "../../../../components/functions/functions";
import DocListTable from "../../../../components/partials/documentListTable";

export default function Penarikan() {
  const [state, setState] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
    query: "approved",
    showChart: false,
    origin: "All Cabang",
    destination: "All Cabang",
  });
  const [documents, setDocuments] = useState([]);
  const [bags, setBags] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const radioList = [
    { label: "Approved", value: "approved" },
    { label: "Departure", value: "departure" },
    { label: "Receiving", value: "received" },
  ];

  const branchSelection = [
    {
      label: "Origin",
      name: "origin",
      value: state.origin,
    },
    {
      label: "Destination",
      name: "destination",
      value: state.destination,
    },
  ];

  const handleSubmit = () => {
    var delta = Math.abs(new Date(state.start) - new Date(state.end)) / 1000;
    var days = Math.floor(delta / 86400);
    if (days <= 7) {
      try {
        setLoading(true);

        const database = firebase.database().ref();

        // Fetch Document Data
        database
          .child("eMTS/documents/")
          .orderByChild(state.query)
          .limitToLast(10000)
          .startAt(state.start)
          .endAt(state.end)
          .on("value", (snapshot) => {
            let documents = [];

            snapshot.forEach((childSnapshot) => {
              documents.push({
                key: childSnapshot.key,
                ...childSnapshot.val(),
              });
            });

            // Filter by Selected Route
            const result = filterByRoute({ data: documents, state: state });

            let bagList = [];
            result.map((document) => {
              database
                .child("eMTS/bags")
                .orderByChild("docId")
                .equalTo(document.key)
                .on("value", (snapshot) => {
                  snapshot.forEach((childSnapshot) => {
                    bagList.push({
                      key: childSnapshot.key,
                      ...childSnapshot.val(),
                    });
                  });
                });
            });
            setBags(bagList);

            // Apply data
            setDocuments(result);
            // Finish Process
            setLoading(false);
          });

        setShow(true);
      } catch (error) {
        console.log(error);
        alert("Error fetching data from database");
        setLoading(false);
      }
    } else {
      alert("Penarikan data dibatasi maksimum 7 hari");
    }
  };

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2 className="fw-bold">Penarikan Data</h2>
        <hr />
        <div className="rounded border p-4">
          <Row>
            <h4>Date : </h4>
            <Col>
              <Form className="mb-2">
                {radioList.map((item, idx) => (
                  <Form.Check
                    key={idx}
                    inline
                    defaultChecked={idx == 0 ? true : false}
                    label={item.label}
                    type="radio"
                    name="query"
                    value={item.value}
                    onChange={() =>
                      handleChange({
                        e: event,
                        state: state,
                        stateSetter: setState,
                      })
                    }
                  />
                ))}
              </Form>
            </Col>
          </Row>

          <Row className="mb-2">
            {branchSelection.map((item, index) => (
              <Col key={index} sm className="mb-2">
                <FloatingLabel
                  controlId="floatingSelectData"
                  label={item.label}
                >
                  <Form.Select
                    aria-label={item.label}
                    name={item.name}
                    onChange={() =>
                      handleChange({
                        e: event,
                        state: state,
                        stateSetter: setState,
                      })
                    }
                    value={item.value}
                  >
                    <option value="All Cabang">All Cabang</option>
                    {cabangList.map((item, id) => (
                      <option key={id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            ))}
          </Row>

          <Row className="mb-4">
            <Col>
              <Row>
                <label htmlFor="startDate" className="mb-1">
                  <strong>{`Dari : `}</strong>
                </label>
              </Row>
              <Row>
                <DatePicker
                  portalId="root-portal"
                  title="Start Date"
                  placeholder="Start Date"
                  className="form-control form-control-solid"
                  selected={state.start}
                  onChange={(date) =>
                    setState({
                      ...state,
                      start: moment(date).format("YYYY-MM-DD 00:00"),
                    })
                  }
                />
              </Row>
            </Col>
            <Col>
              <Row>
                <label htmlFor="endDate" className="mb-1">
                  <strong>{`Hingga :`}</strong>
                </label>
              </Row>
              <Row>
                <DatePicker
                  portalId="root-portal"
                  id="endDate"
                  title="End Date"
                  placeholder="End Date"
                  className="form-control form-control-solid"
                  selected={state.end}
                  onChange={(date) =>
                    setState({
                      ...state,
                      end: moment(date).format("YYYY-MM-DD 23:59"),
                    })
                  }
                />
              </Row>
            </Col>
          </Row>

          <div>
            <Button
              variant="primary"
              disabled={loading}
              className="me-2"
              onClick={() => {
                handleSubmit();
              }}
            >
              <span>{loading ? "Loading..." : "Go"}</span>
            </Button>

            <DropdownButton
              as={ButtonGroup}
              title="Action"
              variant="outline-dark"
              disabled={loading || !documents.length}
            >
              <Dropdown.Item
                eventKey="1"
                onClick={() => {
                  setState({
                    ...state,
                    showChart: !state.showChart,
                  });
                }}
              >
                {state.showChart ? "Hide Chart" : "Show Chart"}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                eventKey="2"
                onClick={() => {
                  handleDownload({
                    bags: bags,
                    documents: documents,
                    startDate: state.start,
                    endDate: state.end,
                  });
                }}
              >
                Download Data
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="3"
                onClick={() => {
                  setDocuments([]);
                  setBags([]);
                  setShow(false);
                  setState({
                    ...state,
                    origin: "All Cabang",
                    destination: "All Cabang",
                    showChart: false,
                  });
                }}
              >
                Clear Data
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
        <hr />
        <div className="rounded border p-4">
          {state.showChart && documents.length ? (
            <>
              <Row>
                <PieChart type="status" data={documents} />
              </Row>
              <hr />
            </>
          ) : null}
          {show ? <DocListTable loading={loading} data={documents} /> : null}
          {documents.length ? (
            <p>{`Showing ${documents.length} data`}</p>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
