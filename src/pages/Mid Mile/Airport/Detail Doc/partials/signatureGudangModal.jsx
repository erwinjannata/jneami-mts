/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef } from "react";
import { Button, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import ReactSignatureCanvas from "react-signature-canvas";
import { handleChange } from "../../../../../components/functions/functions";

const SignatureGudangModal = ({
  show,
  setShow,
  gudangBandaraState,
  setGudangBandaraState,
  setShowSignatureAirport,
}) => {
  const signatureCanvasRef = useRef(null);

  const handleClear = () => {
    signatureCanvasRef.current.clear();
  };

  const handleSubmit = () => {
    const signatureImage = signatureCanvasRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    setGudangBandaraState({
      ...gudangBandaraState,
      signatureImage: signatureImage,
    });
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
      backdrop="static"
      show={show}
      onHide={() => {
        handleClear();
        setShow(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="contained-modal-title-vcenter">
          Tanda Tangan Petugas Gudang Bandara
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FloatingLabel
          controlId="floatingInput"
          label="Nama petugas gudang"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Nama petugas gudang"
            name="namaPetugas"
            onChange={() => {
              handleChange({
                e: event,
                state: gudangBandaraState,
                stateSetter: setGudangBandaraState,
              });
            }}
          />
        </FloatingLabel>
        <Row className="mx-auto">
          <ReactSignatureCanvas
            ref={signatureCanvasRef}
            penColor="black"
            canvasProps={{
              width: 300,
              height: 200,
              className: "signature-canvas",
            }}
            onEnd={() => handleSubmit()}
          />
        </Row>
        <br />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => handleClear()}>
          Hapus
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleSubmit();
            setShow(false);
            setShowSignatureAirport(true);
          }}
        >
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignatureGudangModal;
