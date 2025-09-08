/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import CustomInput from "../../../../../components/partials/customInput";
import { handleChange } from "../../../../../components/functions/functions";
import firebase from "./../../../../../config/firebase";

const EMPUEditCustomerModal = ({
  show,
  setShow,
  customer,
  loading,
  setLoading,
  setCurrentFocus,
}) => {
  const [state, setState] = useState({
    customerName: "",
    customerType: "",
    customerNumber: "",
  });

  const handleSubmit = () => {
    if (state.customerName !== "") {
      setLoading(true);
      const dbRef = firebase.database().ref("empu/customers");

      dbRef
        .child(customer.key)
        .update({
          customerName: state.customerName,
          customerType: state.customerType,
          customerNumber: state.customerNumber,
        })
        .then(() => {
          alert("Perubahan berhasil");
          setLoading(false);
          setShow(false);
        })
        .catch(() => {
          alert("Gagal");
          setLoading(false);
        });
    } else {
      alert("Nama kosong!");
    }
  };

  useEffect(() => {
    setState({
      customerName: customer.customerName,
      customerType: customer.customerType,
      customerNumber: customer.customerNumber || "",
    });
  }, [customer]);

  return (
    <Modal
      centered
      scrollable
      backdrop="static"
      show={show}
      onHide={() => {
        setState({});
        setCurrentFocus(null);
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Customer EMPU
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CustomInput
          name="customerName"
          label="Nama Customer"
          type="text"
          value={state.customerName || ""}
          onChange={() =>
            handleChange({ e: event, state: state, stateSetter: setState })
          }
          disabled={loading}
        />
        <CustomInput
          name="customerNumber"
          label="No. HP"
          type="text"
          value={state.customerNumber || ""}
          onChange={() =>
            handleChange({ e: event, state: state, stateSetter: setState })
          }
          disabled={loading}
        />
        <FloatingLabel label="Type Customer ">
          <Form.Select
            name="customerType"
            value={state.customerType || ""}
            disabled={loading}
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
          >
            <option value="Agen">Agen</option>
            <option value="Personal">Personal</option>
          </Form.Select>
        </FloatingLabel>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={loading} onClick={() => handleSubmit()}>
          Simpan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EMPUEditCustomerModal;
