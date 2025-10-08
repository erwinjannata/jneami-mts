/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  FloatingLabel,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useNavigate, useParams } from "react-router-dom";
import { handleChange, handleExcel } from "@/components/functions/functions";
import "moment/dist/locale/id";
import "moment/dist/locale/en-ca";
import "moment/dist/locale/en-sg";
import PrintFn from "@/components/partials/print";
import BagInfo from "@/components/partials/Document Details/bagInfo";
import {
  fetchData,
  handleCheck,
  handleCheckAll,
  handleOverload,
  handleReceiving,
  handleUnreceiving,
} from "./partials/functions";
import TransportModal from "./partials/transportModal";
import { UseAuth } from "@/config/authContext";
import { FaPen } from "react-icons/fa6";
import RemarkModal from "./partials/remarkModal";
import DocumentInfo from "./partials/documentInfo";

export default function Doc() {
  const { key } = useParams();
  const auth = UseAuth();
  const navigate = useNavigate();
  const [state, setState] = useState({
    search: "",
  });
  const [document, setDocument] = useState([]);
  const [bags, setBags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRemark, setShowRemark] = useState(false);
  const [selectedBag, setSelectedBag] = useState({});

  const filteredBags = useMemo(() => {
    if (!state.search.trim()) {
      return bags;
    }

    return bags.filter((bag) =>
      bag.manifestNo.toUpperCase().includes(state.search.toUpperCase())
    );
  }, [state, bags]);

  const openModal = () => {
    const isChecked = filteredBags.some((bag) => bag.isSelected === true);
    const isNoneStandby = filteredBags.every((bag) => bag.status !== "Standby");
    const isAllTransported = filteredBags.every(
      (bag) => bag.status === "Dalam Perjalanan"
    );

    if (!isChecked) {
      alert("Tidak ada bag dipilih");
      return;
    } else if (isAllTransported) {
      alert("Semua bag sudah dalam proses Transport");
      return;
    } else if (document.status === "Received") {
      alert("Semua bag sudah melalui proses proses Receiving");
      return;
    } else if (isNoneStandby) {
      alert("Bag yang dipilih tidak dalam status Stanby di Origin");
      return;
    }

    setShowModal(true);
  };

  const textStyle = ({ status }) => {
    if (status === "Received") {
      return "text-success bg-success";
    } else if (status === "Dalam Perjalanan") {
      return "text-primary bg-primary";
    } else if (status === "Standby") {
      return "text-dark bg-dark";
    } else if (status === "Missing" || status === "Unreceived") {
      return "text-danger bg-danger";
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData({
      key: key,
      setDocument: setDocument,
      setBags: setBags,
      setLoading: setLoading,
      route: navigate,
    });
  }, [key, navigate, auth.name]);

  return (
    <Container>
      <div>
        <DocumentInfo data={document} />
      </div>
      <hr />
      <div className="rounded border p-4">
        <Row>
          <form>
            <FloatingLabel controlId="floatingInputNo" label="Manifest No.">
              <Form.Control
                type="text"
                name="search"
                value={state.search}
                placeholder="Manifest No."
                disabled={loading}
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
              />
            </FloatingLabel>
          </form>
        </Row>
        <hr />
        <Table responsive striped id="tableData">
          <thead id="stickyHead">
            <tr>
              <th>
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={() =>
                    handleCheckAll({ bags: bags, setBags: setBags })
                  }
                  checked={bags.every((bag) => bag.isSelected === true)}
                  disabled={loading}
                />
              </th>
              <th className="w-25">Manifest No.</th>
              <th className="w-auto">Koli</th>
              <th className="w-auto">Pcs</th>
              <th className="w-auto">Kg</th>
              <th className="w-25 text-center">Status Bag</th>
              <th className="w-75">Remark</th>
              <th className="w-auto"></th>
            </tr>
          </thead>
          <tbody>
            {filteredBags.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={() =>
                      handleCheck({
                        index: bags.indexOf(item),
                        setBags: setBags,
                      })
                    }
                    checked={item.isSelected}
                    disabled={loading}
                  />
                </td>
                <td>{item.manifestNo}</td>
                <td>{item.koli == undefined ? "-" : item.koli}</td>
                <td>{item.pcs}</td>
                <td>{item.weight} kg</td>
                <td>
                  <p className="text-center">
                    <span
                      className={`fw-bold flex bg-opacity-10 rounded py-1 px-2 ${textStyle(
                        { status: item.status }
                      )}`}
                    >
                      {item.status}
                    </span>
                  </p>
                </td>
                <td>{item.remark}</td>
                {auth.origin === document.origin ||
                auth.origin === document.destination ? (
                  <td>
                    {item.status.includes("Received") ? null : (
                      <Button
                        variant="outline-secondary"
                        title="Edit Remark"
                        disabled={loading}
                        size="sm"
                        onClick={async () => {
                          await Promise.all([
                            setSelectedBag(item),
                            setShowRemark(true),
                          ]);
                        }}
                      >
                        <FaPen />
                      </Button>
                    )}
                  </td>
                ) : (
                  <td></td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
        <hr />
        <BagInfo bagList={bags} />
        {bags.every(
          (bag) => bag.status === "Received" || bag.status === "Unreceived"
        ) ? null : (
          <>
            {auth.origin === document.origin ||
            auth.origin === document.destination ? (
              <div>
                {auth.origin === document.origin ? (
                  <div>
                    <Button
                      variant="success"
                      className="me-2"
                      title="Proses Transport"
                      onClick={() => openModal()}
                      disabled={loading}
                    >
                      Transport
                    </Button>
                    <Button
                      variant="outline-danger"
                      className="me-2"
                      title="Bag Overload"
                      onClick={() =>
                        handleOverload({
                          bags: bags,
                          document: document,
                          setLoading: setLoading,
                          user: auth.name,
                        })
                      }
                    >
                      Overload
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="primary"
                      className="me-2"
                      title="Receive Bag"
                      onClick={() =>
                        handleReceiving({
                          bags: bags,
                          document: document,
                          setLoading: setLoading,
                          user: auth.name,
                        })
                      }
                      disabled={loading}
                    >
                      Received
                    </Button>
                    <Button
                      variant="outline-secondary"
                      className="me-2"
                      title="Bag Unreceived"
                      onClick={() =>
                        handleUnreceiving({
                          bags: bags,
                          document: document,
                          setLoading: setLoading,
                        })
                      }
                    >
                      Unreceived
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </>
        )}
      </div>
      <hr />
      <Row>
        <Col>
          <ButtonGroup>
            <DropdownButton
              as={ButtonGroup}
              title="Download File"
              id="bg-nested-dropdown"
              variant="outline-dark"
              disabled={loading}
            >
              <Dropdown.Item
                eventKey="1"
                onClick={() => handleExcel(document, bags)}
              >
                Excel File (.xlsx)
              </Dropdown.Item>
              <hr className="mx-4" />
              <PDFDownloadLink
                className="mx-3"
                document={<PrintFn bagList={bags} data={document} />}
                fileName={`${document.noSurat}.pdf`}
                style={{ color: "black" }}
              >
                {({ loading }) => (loading ? "Loading..." : "PDF File (.pdf)")}
              </PDFDownloadLink>
            </DropdownButton>
          </ButtonGroup>
        </Col>
      </Row>
      <TransportModal
        show={showModal}
        setShow={setShowModal}
        bags={bags}
        document={document}
      />
      <RemarkModal
        show={showRemark}
        setShow={setShowRemark}
        selectedBag={selectedBag}
        setSelectedBag={setSelectedBag}
      />
    </Container>
  );
}
