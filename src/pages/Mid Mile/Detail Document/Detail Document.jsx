/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  approveData,
  fetchData,
  handleApprove,
  handleExcelDownload,
  handleReceivingByInbound,
  handleTransport,
  onTransportClick,
} from "./partials/functions";
import NavMenu from "../../../components/partials/navbarMenu";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { UseAuth } from "../../../config/authContext";
import MidMileDocInfo from "./partials/docInfo";
import ReceivingForm from "./partials/receivingForm";
import MidMileBagTable from "./partials/bagTable";
import ToastWarning from "../../../components/partials/toastWarning";
import EditMasterBagModal from "./partials/editModal";
import AddBagModal from "./partials/addBagModal";
import NameFormModal from "./partials/nameFormModal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MidMileDocument from "./partials/midMileDocument";
import { useReactToPrint } from "react-to-print";
import MidMilePrintContent from "./partials/print";
import BagInfo from "./partials/bagInfo";

function DetailDocument() {
  const { key } = useParams();
  const auth = UseAuth();

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [state, setState] = useState({
    search: "",
    showRemarkModal: false,
    showAddBagModal: false,
    showApproveModal: false,
    showDriverModal: false,
    currentFocus: null,
    checker: "",
    driver: "",
  });

  const [document, setDocument] = useState({});
  const [bags, setBags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    header: "",
    message: "",
  });

  useEffect(() => {
    fetchData({
      key: key,
      setBags: setBags,
      setDocument: setDocument,
      setLoading: setLoading,
    });
  }, [auth.name, auth.origin]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2 className="fw-bold">{document.documentNumber}</h2>
        <hr />
        <MidMileDocInfo docData={document} />
        <hr />
        <div className="rounded border p-4">
          {auth.origin === "BANDARA" ? (
            <ReceivingForm
              document={document}
              bags={bags}
              setToast={setToast}
              state={state}
              setState={setState}
            />
          ) : null}
          <MidMileBagTable loading={loading} bagList={bags} />
          <BagInfo bagList={bags} />
          {document.status === "Received" ||
          document.status === "Received*" ? null : (
            <div>
              {auth.origin === "BANDARA" ? (
                <div>
                  <div className="d-grid gap-2">
                    <Button
                      variant="outline-primary"
                      onClick={() =>
                        setState({
                          ...state,
                          showAddBagModal: true,
                        })
                      }
                    >
                      Add Bag
                    </Button>
                  </div>
                  <hr />
                  <Button
                    variant="primary"
                    className="me-2"
                    onClick={() => {
                      handleApprove({
                        user: auth.name,
                        bagList: bags,
                        state: state,
                        setState: setState,
                      });
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline-success"
                    className="me-2"
                    onClick={() => {
                      onTransportClick({
                        document: document,
                        bagList: bags,
                        state: state,
                        setState: setState,
                        setToast: setToast,
                      });
                    }}
                  >
                    Transport
                  </Button>
                </div>
              ) : (
                <div>
                  <hr />
                  <div className="d-grid gap-2">
                    <Button
                      variant="dark"
                      onClick={() => {
                        handleReceivingByInbound({
                          bags: bags,
                          document: document,
                          inboundUser: auth.name,
                          setLoading: setLoading,
                          setToast: setToast,
                        });
                      }}
                    >
                      Receiving
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <DropdownButton
          as={ButtonGroup}
          variant="outline-dark"
          title="Export"
          className="mt-2"
          id="bg-nested-dropdown"
        >
          <Dropdown.Item eventKey="1" onClick={() => reactToPrintFn()}>
            Print Ticket
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="2"
            onClick={() =>
              handleExcelDownload({ bags: bags, document: document })
            }
          >
            Download Excel File
          </Dropdown.Item>
          <Dropdown.Divider />
          <PDFDownloadLink
            className="mx-3"
            document={<MidMileDocument data={document} bagList={bags} />}
            fileName={`${document.documentNumber}.pdf`}
            style={{ color: "black" }}
          >
            {({ loading }) => (loading ? "Loading..." : "Print Document")}
          </PDFDownloadLink>
        </DropdownButton>
      </Container>
      <NameFormModal
        userText="Checker"
        show={state.showApproveModal}
        onHide={() =>
          setState({ ...state, showApproveModal: false, checker: "" })
        }
        state={state}
        setState={setState}
        formFor="checker"
        onSubmit={() => {
          approveData({
            user: auth.name,
            document: document,
            state: state,
            setToast: setToast,
            setLoading: setLoading,
            onHide: () => {
              setState({
                ...state,
                showApproveModal: false,
                checker: "",
              });
            },
          });
        }}
      />
      <NameFormModal
        userText="Driver"
        show={state.showDriverModal}
        onHide={() =>
          setState({ ...state, showDriverModal: false, driver: "" })
        }
        state={state}
        setState={setState}
        formFor="driver"
        onSubmit={() => {
          handleTransport({
            document: document,
            bags: bags,
            state: state,
            setLoading: setLoading,
            setToast: setToast,
          });
        }}
      />
      <AddBagModal
        mainState={state}
        setMainState={setState}
        document={document}
        setToast={setToast}
      />
      <EditMasterBagModal
        mainState={state}
        document={document}
        bag={bags[state.currentFocus]}
        setMainState={setState}
        setToast={setToast}
      />
      <div className="d-none">
        <div ref={contentRef}>
          <MidMilePrintContent data={document} />
        </div>
      </div>
      <ToastWarning toast={toast} setToast={setToast} />
    </div>
  );
}

export default DetailDocument;
