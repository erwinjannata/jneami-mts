/* eslint-disable react/prop-types */
import { useRef } from "react";
import { Button, FloatingLabel, Form, Modal, Row } from "react-bootstrap";
import ReactSignatureCanvas from "react-signature-canvas";
import { handleChange } from "../../../../../components/functions/functions";

const SignatureModalWithName = ({
  userText,
  show,
  setShow,
  state,
  setState,
  nextStep,
}) => {
  const signatureCanvasRef = useRef(null);

  const handleClear = () => {
    signatureCanvasRef.current.clear();
  };

  const handleSubmit = () => {
    const signatureImage = signatureCanvasRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    setState({
      ...state,
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
          {`Tanda Tangan ${userText}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FloatingLabel controlId="floatingInput" label="Nama" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Nama"
            name="namaPetugas"
            onChange={() => {
              handleChange({
                e: event,
                state: state,
                stateSetter: setState,
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
            nextStep();
          }}
        >
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SignatureModalWithName;
