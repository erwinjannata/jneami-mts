/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Button, Form, Modal } from "react-bootstrap";
import { handleChange } from "@/components/functions/functions";
import { useEffect, useState } from "react";
import { handleRemark } from "./functions";

function RemarkModal({ show, setShow, selectedBag, setSelectedBag }) {
  const [state, setState] = useState({
    remark: selectedBag.remark,
  });
  const [loading, setLoading] = useState(false);

  const hideModal = () => {
    setShow(false);
    setSelectedBag({});
  };

  useEffect(() => {
    setState({
      ...state,
      remark: selectedBag.remark,
    });
  }, [selectedBag.remark]);

  return (
    <Modal
      centered
      scrollable
      backdrop="static"
      show={show}
      onHide={() => {
        hideModal();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{selectedBag.manifestNo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              name="remark"
              as="textarea"
              rows={3}
              value={state.remark}
              disabled={loading}
              onChange={() =>
                handleChange({
                  e: event,
                  state: state,
                  stateSetter: setState,
                })
              }
              autoFocus
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={loading}
          onClick={() => {
            handleRemark({
              bag: selectedBag,
              remark: state.remark,
              setLoading: setLoading,
              setShow: setShow,
            });
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RemarkModal;
