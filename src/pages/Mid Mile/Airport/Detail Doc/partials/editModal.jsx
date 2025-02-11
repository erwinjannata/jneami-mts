/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { handleChange } from "../../../../../components/functions/functions";

const EditMasterBagModal = ({ show, setShow, index, bagList, setBagList }) => {
  const [state, setState] = useState({
    remark: "",
    sm: "",
  });

  const forms = [
    {
      label: "SM#",
      name: "sm",
      type: "text",
      as: "input",
      rows: 1,
      value: state.sm,
    },
    {
      label: "Remark",
      name: "remark",
      type: "text",
      as: "textarea",
      rows: 5,
      value: state.remark,
    },
  ];

  const handleEdit = () => {
    setBagList(
      bagList.map((bag, idx) => {
        if (idx === index) {
          return {
            ...bag,
            remark: state.remark,
            sm: state.sm,
          };
        } else {
          return bag;
        }
      })
    );
    setShow(false);
  };

  useEffect(() => {
    setState({
      ...state,
      remark: bagList.length > 0 ? bagList[index].remark : "",
      sm: bagList.length > 0 ? bagList[index].sm : "",
    });
  }, [bagList]);

  return (
    <Modal
      centered
      scrollable
      backdrop="static"
      show={show}
      onHide={() => {
        setState({
          remark: "",
          sm: "",
        });
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {bagList.length > 0 ? bagList[index].bagNumber : ""}
        </Modal.Title>
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
              as={form.as}
              rows={form.rows}
              type={form.type}
              placeholder={form.label}
              name={form.name}
              style={form.name === "remark" ? { height: "100px" } : {}}
              value={form.value}
              onChange={() =>
                handleChange({ e: event, state: state, stateSetter: setState })
              }
            />
          </FloatingLabel>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => handleEdit()}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditMasterBagModal;
