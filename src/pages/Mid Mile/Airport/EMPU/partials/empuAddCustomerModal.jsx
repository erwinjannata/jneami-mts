/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { handleChange } from "../../../../../components/functions/functions";
import firebase from "./../../../../../config/firebase";
import moment from "moment";

const EMPUAddCustomerModal = ({ show, setShow }) => {
  const [state, setState] = useState({
    name: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const d = new Date();
    const time = moment(d).locale("en-sg").format("LT");
    const date = moment(d).locale("en-ca").format("L");
    const dbRef = firebase.database().ref("empu/customers");

    if ((state.name === "") | (state.type === "")) {
      alert("Data tidak lengkap!");
      setLoading(false);
    } else {
      dbRef
        .push({
          customerName: state.name,
          customerType: state.type,
          dateAdded: `${date} ${time}`,
        })
        .then(() => {
          alert("Data customer disimpan");
          setLoading(false);
          setState({
            name: "",
            type: "",
          });
          setShow(false);
        })
        .catch((error) => {
          alert(error.message);
          setLoading(false);
        });
    }
  };

  return (
    <Modal
      centered
      scrollable
      backdrop="static"
      show={show}
      onHide={() => {
        setState({
          name: "",
          type: "",
        });
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Customer EMPU
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FloatingLabel
          controlId="floatingInput"
          label="Nama Customer"
          className="mb-3"
        >
          <Form.Control
            name="name"
            placeholder="Nama Customer"
            type="text"
            disabled={loading}
            value={state.name}
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="floatingSelect"
          label="Type Customer"
          className="mb-3"
        >
          <Form.Select
            name="type"
            disabled={loading}
            value={state.type}
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
          >
            <option value="">- Pilih Tipe Customer -</option>
            <option value="Agen">Agen</option>
            <option value="Personal">Personal</option>
          </Form.Select>
        </FloatingLabel>
        <hr />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EMPUAddCustomerModal;
