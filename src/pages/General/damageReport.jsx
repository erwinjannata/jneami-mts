/* eslint-disable no-unused-vars */
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { useState } from "react";
import firebase from "./../../config/firebase";
import NavMenu from "../../components/partials/navbarMenu";

export default function DamageReport() {
  let db = firebase.database().ref("damageReport");
  const [state, setState] = useState({
    awb: "",
    damage: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setState({ ...state, [e.target.name]: value });
  };

  const handleSubmit = () => {
    // db.push(state)
    //   .then(() => {
    //     alert("OK");
    //   })
    //   .catch((error) => {
    //     console.log(error.message);
    //   });
  };

  return (
    <div className="screen">
      <NavMenu />
      <Container className="mt-4">
        <Row>
          <Col>
            <FloatingLabel
              controlId="floatingAWB"
              label="Nomor AWB"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="awb"
                placeholder="No. AWB"
                value={state.awb}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel
              controlId="floatingDamage"
              label="Jenis Damage"
              className="mb-3"
            >
              <Form.Control
                type="text"
                name="damage"
                placeholder="Jenis Damage"
                value={state.damage}
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <div className="d-grid gap-2">
            <Button
              variant="outline-primary"
              type="submit"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </Row>
      </Container>
    </div>
  );
}
