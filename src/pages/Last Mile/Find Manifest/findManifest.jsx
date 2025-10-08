import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "moment/locale/en-ca";
import "moment/locale/id";
import { handleChange } from "@/components/functions/functions";
import BagListTable from "@/components/partials/bagListTable";
import firebase from "@/config/firebase";

export default function FindManifestNumber() {
  const [state, setState] = useState({
    search: "",
    show: false,
  });

  const [bags, setBags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const database = firebase.database().ref();

    setLoading(true);
    database
      .child("eMTS/bags/")
      .orderByChild("manifestNo")
      .equalTo(state.search.replace(/\s/g, "").toUpperCase())
      .on("value", (snapshot) => {
        setBags([]);
        snapshot.forEach((childSnapshot) => {
          setBags((prev) => [
            ...prev,
            {
              key: childSnapshot.key,
              ...childSnapshot.val(),
            },
          ]);
        });
      });
    setLoading(false);
    setState({ ...state, show: true });
  };

  return (
    <Container>
      <h2 className="fw-bold">Cari No. Manifest</h2>
      <hr />
      <Row className="mt-2">
        <Col>
          <FloatingLabel controlId="floatingInputNo" label="No Manifest/Bag">
            <Form.Control
              type="text"
              name="search"
              value={state.search}
              placeholder={state.search}
              disabled={loading}
              onChange={() =>
                handleChange({
                  e: event,
                  state: state,
                  stateSetter: setState,
                })
              }
            />
          </FloatingLabel>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-2"
          >
            {loading ? "Loading..." : "Cari"}
          </Button>
        </Col>
      </Row>
      <hr />
      {state.show ? (
        <Row>
          <BagListTable bagList={bags} />
        </Row>
      ) : null}
    </Container>
  );
}
