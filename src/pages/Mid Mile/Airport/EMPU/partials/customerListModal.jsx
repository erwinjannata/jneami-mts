/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button, FloatingLabel, Form, Modal, Table } from "react-bootstrap";
import { handleChange } from "../../../../../components/functions/functions";

const CustomerListModal = ({
  show,
  setShow,
  customerList,
  setShowNewCustomer,
}) => {
  const [state, setState] = useState({
    searched: "",
  });

  return (
    <Modal
      centered
      scrollable
      backdrop="static"
      show={show}
      onHide={() => {
        setState({
          searched: "",
        });
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Daftar Customer EMPU
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FloatingLabel controlId="floatingInput" label="Cari" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Cari nama Customer"
            name="searched"
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
          />
        </FloatingLabel>
        <hr />
        <Table borderless hover>
          <tbody>
            {customerList.map((customer, index) => (
              <tr key={index}>
                <td>{customer.customerName}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default CustomerListModal;
