/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { UseAuth } from "../../../../config/authContext";
import NavMenu from "../../../../components/partials/navbarMenu";
import {
  Accordion,
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { handleChange } from "../../../../components/functions/functions";
import { cabangList } from "../../../../components/data/branchList";
import { BiTrash } from "react-icons/bi";
import {
  approveDoc,
  getDocNumber,
  handleAdd,
  handleDownloadTemplate,
  handlePaste,
  handleRemove,
} from "./functions";
import { RiFileExcel2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export default function CreateMTS() {
  const auth = UseAuth();
  const navigate = useNavigate();

  const [bags, setBags] = useState([]);
  const [document, setDocument] = useState({
    noSurat: "",
    origin: auth.origin,
    destination: "",
    approveUser: auth.name,
  });
  const [form, setForm] = useState({
    manifestNo: "",
    koli: 1,
    pcs: 1,
    weight: 1,
    remark: "",
  });

  const [loading, setLoading] = useState(false);

  let formsList = [
    {
      name: "manifestNo",
      label: "Manifest No.",
      type: "text",
      value: form.manifestNo,
    },
    {
      name: "koli",
      label: "Koli",
      type: "number",
      value: form.koli,
    },
    {
      name: "pcs",
      label: "Pcs",
      type: "number",
      value: form.pcs,
    },
    {
      name: "weight",
      label: "Weight",
      type: "number",
      value: form.weight,
    },
    {
      name: "remark",
      label: "Remark",
      type: "text",
      value: form.remark,
    },
  ];

  const startup = async () => {
    await Promise.all([
      getDocNumber({
        document: document,
        setDocument: setDocument,
        setLoading: setLoading,
        auth: auth,
      }),
    ]);
  };

  useEffect(() => {
    startup();
  }, [
    document.noSurat,
    document.origin,
    document.approveUser,
    auth.name,
    auth.origin,
  ]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>
          <strong>Manifest Transit Sub Agen</strong>
        </h2>
        <hr />
        <div className="rounded border p-4">
          <Row className="mb-4">
            <Col>
              <strong>No. Surat: </strong> {document.noSurat}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <FloatingLabel controlId="floatingSelectGrid" label="Destination">
                <Form.Select
                  title="Destination Form"
                  aria-label="Destination Form"
                  name="destination"
                  onChange={() =>
                    handleChange({
                      e: event,
                      state: document,
                      stateSetter: setDocument,
                    })
                  }
                  value={document.destination || ""}
                  disabled={loading}
                >
                  <option value="">-Pilih Destinasi-</option>
                  {cabangList.map((item, id) =>
                    auth.origin == item.name ? null : (
                      <option key={id} value={item.name}>
                        {item.name}
                      </option>
                    )
                  )}
                </Form.Select>
              </FloatingLabel>
            </Col>
          </Row>
        </div>
        <hr />
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <span className="fw-bold">Data Manifest</span>
            </Accordion.Header>
            <Accordion.Body>
              <form
                className="flex gap-2 mb-4"
                onSubmit={() =>
                  handleAdd({
                    e: event,
                    form: form,
                    bags: bags,
                    setBags: setBags,
                    setForm: setForm,
                  })
                }
              >
                <Row>
                  {formsList.map((item, idx) => (
                    <Col sm key={idx}>
                      <Form.Floating className="mb-3" title={`${item.name}`}>
                        <Form.Control
                          id={`${item.name}Input`}
                          type={item.type}
                          name={item.name}
                          value={item.value}
                          placeholder={item.label}
                          title={item.label}
                          onChange={() =>
                            handleChange({
                              e: event,
                              state: form,
                              stateSetter: setForm,
                            })
                          }
                          disabled={loading}
                        />
                        <label htmlFor="floatingInput">{item.label}</label>
                      </Form.Floating>
                    </Col>
                  ))}
                </Row>
                <Row>
                  <Col className="d-grid gap-2">
                    <Button variant="outline-primary" type="submit">
                      Add Bag
                    </Button>
                  </Col>
                </Row>
              </form>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <span className="fw-bold">Paste Data dari Excel</span>
            </Accordion.Header>
            <Accordion.Body>
              <>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Data Excel"
                  className="mb-4"
                >
                  <Form.Control
                    title="Paste Values"
                    as="textarea"
                    placeholder="Paste data dari excel disini..."
                    style={{ height: "100px" }}
                    onPaste={() => handlePaste({ e: event, setBags: setBags })}
                  />
                </FloatingLabel>
              </>
              <Row>
                <Col className="d-grid gap-2">
                  <Button
                    variant="outline-success"
                    onClick={() => handleDownloadTemplate()}
                  >
                    <RiFileExcel2Line /> Template Excel
                  </Button>
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <hr />
        <div
          className="rounded border p-4"
          style={{ display: bags.length ? "block" : "none" }}
        >
          <Table responsive striped id="tableData">
            <thead id="stickyHead">
              <tr>
                <th className="w-25">Manifest No.</th>
                <th className="w-auto">Koli</th>
                <th className="w-auto">Pcs</th>
                <th className="w-auto">Kg</th>
                <th className="w-25">Status Bag</th>
                <th className="w-50">Remark</th>
                <th className="w-auto"></th>
              </tr>
            </thead>
            <tbody>
              {bags.map((item, index) => (
                <tr key={index}>
                  <td>{item.manifestNo}</td>
                  <td>{item.koli == undefined ? "-" : item.koli}</td>
                  <td>{item.pcs}</td>
                  <td>{item.weight} kg</td>
                  <td>{item.status}</td>
                  <td>{item.remark}</td>
                  <td>
                    <Button
                      variant="danger"
                      disabled={loading}
                      title="Hapus"
                      onClick={() =>
                        handleRemove({
                          manifestNo: item.manifestNo,
                          setBags: setBags,
                        })
                      }
                    >
                      <BiTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row className="mt-2">
            <Col>
              <Row>
                <strong>Koli</strong>
                <p>
                  {bags.reduce((prev, next) => {
                    return prev + parseInt(next.koli);
                  }, 0)}
                </p>
              </Row>
            </Col>
            <Col>
              <strong>Pcs</strong>
              <p>
                {bags.reduce((prev, next) => {
                  return prev + parseInt(next.pcs);
                }, 0)}
              </p>
            </Col>
            <Col>
              <strong>Weight</strong>
              <p>
                {bags.reduce((prev, next) => {
                  return prev + parseInt(next.weight);
                }, 0)}{" "}
                kg
              </p>
            </Col>
          </Row>
          <Row>
            <Col className="d-grid gap-2">
              <Button
                variant="dark"
                title="Approve Manifest"
                onClick={() =>
                  approveDoc({
                    document: document,
                    bags: bags,
                    setLoading: setLoading,
                    route: navigate,
                  })
                }
              >
                Approve
              </Button>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
