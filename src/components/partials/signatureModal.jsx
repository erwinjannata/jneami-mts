/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";

export default function SignatureModal(props) {
  const SignatureCanvasRef = useRef(null);

  // Handler untuk Signature Canvas
  const clearSignature = () => {
    SignatureCanvasRef.current.clear();
    props.onChange("");
  };

  const saveSignature = () => {
    const signatureImage = SignatureCanvasRef.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    props.onChange(signatureImage);
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
      backdrop="static"
      show={props.show}
      onHide={props.onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title className="contained-modal-title-vcenter">
          Tanda Tangan
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SignatureCanvas
            ref={SignatureCanvasRef}
            penColor="black"
            canvasProps={{
              width: 300,
              height: 200,
              className: "signature-canvas",
            }}
            onEnd={saveSignature}
          />
          <br />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={clearSignature}>
          Hapus
        </Button>
        <Button
          onClick={() => {
            props.onSubmit(), props.onHide();
          }}
        >
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
