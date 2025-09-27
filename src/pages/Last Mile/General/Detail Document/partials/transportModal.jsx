/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { handleChange } from "../../../../../components/functions/functions";
import { handleTransport } from "./functions";

function TransportModal({ show, setShow, bags, document }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    noRef: "",
    driver: "",
    noPolisi: "",
  });

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      scrollable
      backdrop="static"
      show={show}
      onHide={() => setShow(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title className="contained-modal-title-vcenter">
          Detail Driver
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Col>
          <Form.Floating className="mb-3" title="Nama Driver">
            <Form.Control
              id="driverInput"
              type="text"
              name="driver"
              value={form.driver}
              placeholder="Nama Driver"
              title="Nama Driver"
              autoFocus
              onChange={() =>
                handleChange({
                  e: event,
                  state: form,
                  stateSetter: setForm,
                })
              }
              disabled={loading}
            />
            <label htmlFor="floatingInput">Nama Driver</label>
          </Form.Floating>
        </Col>
        <Col>
          <Form.Floating className="mb-3" title="No. Polisi Kendaraan">
            <Form.Control
              id="noPolisiInput"
              type="text"
              name="noPolisi"
              value={form.noPolisi}
              placeholder="No. Polisi Kendaraan"
              title="No. Polisi Kendaraan"
              onChange={() =>
                handleChange({
                  e: event,
                  state: form,
                  stateSetter: setForm,
                })
              }
              disabled={loading}
            />
            <label htmlFor="floatingInput">No. Polisi Kendaraan</label>
          </Form.Floating>
        </Col>
        <Col>
          <Form.Floating className="mb-3" title="No. Referensi Vendor">
            <Form.Control
              id="noRefInput"
              type="text"
              name="noRef"
              value={form.noRef}
              placeholder="No. Referensi Vendor"
              title="No. Referensi Vendor"
              onChange={() =>
                handleChange({
                  e: event,
                  state: form,
                  stateSetter: setForm,
                })
              }
              disabled={loading}
            />
            <label htmlFor="floatingInput">No. Referensi Vendor</label>
          </Form.Floating>
        </Col>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="dark"
          onClick={() =>
            handleTransport({
              bags: bags,
              setLoading: setLoading,
              detailDriver: form,
              document: document,
              setShow: setShow,
              setForm: setForm,
            })
          }
        >
          Approve
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TransportModal;
