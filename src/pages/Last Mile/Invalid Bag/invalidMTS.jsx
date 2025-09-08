/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import NavMenu from "../../../components/partials/navbarMenu";
import MtsDocTable from "./partials/mtsDocTable";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "./../../../config/firebase";
import { handleChange } from "../../../components/functions/functions";
import { cabangList } from "../../../components/data/branchList";
import { UseAuth } from "../../../config/authContext";

export default function InvalidMTSIndex() {
  const auth = UseAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [state, setState] = useState({
    limit: 25,
    destination: "",
  });

  let database = firebase.database().ref("mts/document");

  useEffect(() => {
    setLoading(true);

    if (state.destination !== "") {
      database = database
        .orderByChild("destination")
        .equalTo(state.destination);
    }

    database.limitToLast(parseInt(state.limit)).on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedData = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
        }));
        setData(formattedData);
      } else {
        setData([]);
      }
      setLoading(false);
    });
  }, [state]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>MTS Invalid Bags</h2>
        <hr />
        <Link to="/mts/insert">
          <Button variant="dark" className="mb-4">
            Proses MTS
          </Button>
        </Link>
        <Row className="mb-4">
          <Col>
            <FloatingLabel controlId="floatingSelectGrid" label="Destination">
              <Form.Select
                aria-label="Destination Label"
                name="destination"
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
                value={state.destination || ""}
                disabled={loading ? true : false}
              >
                <option value="">All</option>
                {cabangList.map((item, id) =>
                  auth.origin == item.name ? null : (
                    <option key={id} value={item.name}>
                      {item.name}
                    </option>
                  )
                )}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <MtsDocTable loading={loading} data={data} />
        <hr />
        <Row>
          <Col xl={2} xs={4}>
            <FloatingLabel controlId="floatingSelectShow" label="Show">
              <Form.Select
                aria-label="Show"
                name="limit"
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
                value={state.limit}
                disabled={loading}
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
