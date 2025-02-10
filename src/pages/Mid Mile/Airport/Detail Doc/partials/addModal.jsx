/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { handleAddBag } from "./functions";
import { useState } from "react";
import { handleChange } from "../../../../../components/functions/functions";

const AddBagModal = ({
  show,
  setShow,
  bagList,
  setBagList,
  oldBagList,
  setOldBagList,
  documentId,
}) => {
  const [state, setState] = useState({
    bagNo: "",
    koli: 0,
    weight: 0,
    remark: "",
    sm: "",
  });

  const forms = [
    { name: "bagNo", label: "Bag Number", type: "text" },
    { name: "koli", label: "Koli", type: "number" },
    { name: "weight", label: "Weight", type: "number" },
    { name: "remark", label: "Remark", type: "text" },
    { name: "sm", label: "SM#", type: "text" },
  ];

  return (
    <Modal
      centered
      scrollable
      backdrop="static"
      show={show}
      onHide={() => {
        setState({
          bagNo: "",
          koli: 0,
          weight: 0,
          remark: "",
          sm: "",
        });
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Data Bag</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {forms.map((form, index) => (
          <FloatingLabel
            key={index}
            controlId="floatingInput"
            label={form.label}
            className="mb-3"
          >
            <Form.Control
              type={form.type}
              placeholder={form.label}
              name={form.name}
              onChange={() =>
                handleChange({ e: event, state: state, stateSetter: setState })
              }
            />
          </FloatingLabel>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            handleAddBag({
              bagList: bagList,
              setBagList: setBagList,
              oldBagList: oldBagList,
              setOldBagList: setOldBagList,
              bagNo: state.bagNo,
              koli: state.koli,
              weight: state.weight,
              remark: state.remark,
              sm: state.sm,
              documentId: documentId,
              statusBag: "Standby",
              setShow: setShow,
              setState: setState,
            });
          }}
        >
          Add Bag
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBagModal;
