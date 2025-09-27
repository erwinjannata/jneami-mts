/* eslint-disable react/prop-types */
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { useState } from "react";
import firebase from "../../../../config/firebase";
import moment from "moment";
import { handleChange } from "../../../../components/functions/functions";

const AddBagModal = ({ mainState, setMainState, document, setToast }) => {
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
      const database = firebase.database().ref("test");

      database
        .child(`midMile/bags`)
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
          database
            .child(`midMile/documents/${document.key}`)
            .update({
              latestUpdate: moment().locale("fr-ca").format("L LT"),
              totalKoli: document.totalKoli + parseInt(state.koli),
              totalWeight: document.totalWeight + parseInt(state.weight),
              totalPcs: document.totalPcs + 1,
              status:
                document.status === "Submitted" ? "Standby" : document.status,
            })
            .then(() => {
              if (setToast) setState({});
              setToast({
                show: true,
                header: "Info",
                message: "Data bag ditambahkan",
              });
              setMainState({
                ...state,
                showAddBagModal: false,
              });
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
      show={mainState.showAddBagModal}
      onHide={() => {
        setState({});
        setMainState({
          ...state,
          showAddBagModal: false,
        });
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
