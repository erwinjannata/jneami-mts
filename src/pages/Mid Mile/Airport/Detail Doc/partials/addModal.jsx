/* eslint-disable react/prop-types */
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import { handleChange } from "../../../../../components/functions/functions";
import firebase from "./../../../../../config/firebase";
import moment from "moment";

const AddBagModal = ({ show, onHide, document, setToast }) => {
  const [state, setState] = useState({});

  const forms = [
    { name: "sm", label: "SM#", type: "text" },
    { name: "bagNo", label: "Bag Number", type: "text" },
    { name: "koli", label: "Koli", type: "number" },
    { name: "weight", label: "Weight", type: "number" },
    { name: "remark", label: "Remark", type: "text" },
  ];

  const handleAddBag = () => {
    if (state.bagNo === "") {
      alert("Bag Number tidak boleh kosong!");
    } else if (state.koli === 0) {
      alert("Jumlah koli invalid!");
    } else if (state.weight === 0) {
      alert("Berat bag invalid!");
    } else {
      // Initialize Database Reference
      const dbBagRef = firebase.database().ref("midMile/bags");
      const dbDocRef = firebase.database().ref("midMile/documents");
      // const dbBagRef = firebase.database().ref("test/midMile/bags");
      // const dbDocRef = firebase.database().ref("test/midMile/documents");

      let docUpdates = {
        latestUpdate: moment().locale("fr-ca").format("L LT"),
        totalKoli: document.totalKoli + parseInt(state.koli),
        totalWeight: document.totalWeight + parseInt(state.weight),
        totalPcs: document.totalPcs + 1,
      };

      if (document.status === "Submitted") {
        docUpdates = {
          ...docUpdates,
          status: "Standby",
        };
      }

      dbBagRef
        .push({
          sm: state.sm.toUpperCase().replace(/ /g, ""),
          bagNumber: state.bagNo.toUpperCase().replace(/ /g, ""),
          koli: parseInt(state.koli),
          weight: parseInt(state.weight),
          remark: state.remark === undefined ? "" : state.remark,
          statusBag: "Standby",
          documentId: document.key,
          receivingDate: moment().locale("fr-ca").format("L LT"),
        })
        .then(() => {
          dbDocRef
            .child(document.key)
            .update(docUpdates)
            .then(() => {
              if (setToast)
                setToast({
                  show: true,
                  header: "Info",
                  message: "Data bag ditambahkan",
                });
              setState({});
              onHide();
            });
        })
        .catch(() => {
          if (setToast)
            setToast({
              show: true,
              header: "Warning",
              message: "Gagal upload data bag",
            });
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
        setState({});
        onHide();
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
        <Button onClick={() => handleAddBag()}>Add Bag</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddBagModal;
