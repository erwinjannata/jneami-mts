/* eslint-disable react/prop-types */
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { handleChange } from "../../../../components/functions/functions";
import { useEffect, useState } from "react";
import firebase from "../../../../config/firebase";
import moment from "moment";

const EditMasterBagModal = ({
  mainState,
  bag,
  document,
  setToast,
  setMainState,
}) => {
  const [state, setState] = useState({});

  const forms = [
    {
      label: "SM#",
      name: "sm",
      type: "text",
      as: "input",
      rows: 1,
      value: state?.sm || "",
    },
    {
      label: "Master Bag No.",
      name: "bagNumber",
      type: "text",
      as: "input",
      rows: 1,
      value: state?.bagNumber || "",
    },
    {
      label: "Koli",
      name: "koli",
      type: "number",
      as: "input",
      rows: 1,
      value: state?.koli || "",
    },
    {
      label: "Weight",
      name: "weight",
      type: "number",
      as: "input",
      rows: 1,
      value: state?.weight || "",
    },
    {
      label: "Remark",
      name: "remark",
      type: "text",
      as: "textarea",
      rows: 5,
      value: state?.remark || "",
    },
  ];

  const handleEdit = () => {
    // Initialize Database Reference
    const database = firebase.database().ref();

    database
      .child(`midMile/bags/${bag.key}`)
      .update({
        bagNumber: state.bagNumber,
        sm: state.sm,
        koli: state.koli,
        weight: state.weight,
        remark: state.remark,
      })
      .then(() => {
        database
          .child(`midMile/documents/${bag.documentId}`)
          .update({
            latestUpdate: moment().locale("fr-ca").format("L LT"),
            totalKoli: document.totalKoli - (bag.koli - state.koli),
            totalWeight: document.totalWeight - (bag.weight - state.weight),
          })
          .then(() => {
            setMainState({
              currentFocus: null,
              showRemarkModal: false,
              search: "",
            });

            if (setToast)
              setToast({
                show: true,
                header: "Info",
                message: "Data bag berhasil diperbarui",
              });
          });
      })
      .catch(() => {
        if (setToast)
          setToast({
            show: true,
            header: "Warning",
            message: "Data bag gagal diperbarui",
          });
      });
  };

  useEffect(() => {
    setState({ ...bag });
  }, [bag]);

  return (
    <Modal
      centered
      scrollable
      backdrop="static"
      show={mainState.showRemarkModal}
      onHide={() => {
        setMainState({
          ...mainState,
          currentFocus: null,
          showRemarkModal: false,
        });
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Edit</Modal.Title>
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
