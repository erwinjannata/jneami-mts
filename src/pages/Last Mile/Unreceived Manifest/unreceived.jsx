/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useState } from "react";
import { handleChange } from "@/components/functions/functions";
import { cabangList } from "@/components/data/branchList";
import firebase from "@/config/firebase";
import BagListTable from "@/components/partials/bagListTable";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function UnreceivedPage() {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
    showTable: false,
    origin: "",
    destination: "",
  });
  const [bags, setBags] = useState([]);

  const branchSelection = [
    {
      label: "Origin",
      ariaLabel: "Origin",
      name: "origin",
      value: state.origin,
    },
    {
      label: "Destination",
      ariaLabel: "Destination",
      name: "destination",
      value: state.destination,
    },
  ];

  const handleFetch = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setBags([]);
      const database = firebase.database().ref();

      database
        .child("eMTS/bags")
        .orderByChild("mtsDate")
        .startAt(state.start)
        .endAt(state.end)
        .on("value", (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().status === "Unreceived") {
              setBags((prev) => [
                ...prev,
                { key: childSnapshot.key, ...childSnapshot.val() },
              ]);
            }
          });
        });
      setLoading(false);
      setState({
        ...state,
        showTable: true,
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="fw-bold">Unreceived</h2>
      <hr />
      <Row className="mb-2">
        {branchSelection.map((selection, index) => (
          <Col key={index} sm className="mb-2">
            <FloatingLabel
              controlId="floatingSelectData"
              label={selection.label}
            >
              <Form.Select
                aria-label={selection.ariaLabel}
                name={selection.name}
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
                value={selection.value}
              >
                <option value="">All Cabang</option>
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
      <Row>
        <Col>
          <label htmlFor="startDate" className="mb-1 me-1">
            <strong>{`Dari :`}</strong>
          </label>
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
        </Col>
        <Col>
          <label htmlFor="endDate" className="mb-1 me-1">
            <strong>{`Hingga :`}</strong>
          </label>
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
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" className="mt-4" onClick={handleFetch}>
            Go
          </Button>
        </Col>
      </Row>
      <hr />
      {loading ? (
        <Spinner animation="grow" size="sm" />
      ) : (
        <Row>
          {state.showTable ? (
            <div>
              <BagListTable bagList={bags} />
              <hr />
              <p>Showing {`${bags.length}`} data</p>
            </div>
          ) : null}
        </Row>
      )}
    </Container>
  );
}

export default UnreceivedPage;
