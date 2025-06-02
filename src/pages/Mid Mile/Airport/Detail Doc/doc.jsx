/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  fetchData,
  handleAction,
  handleApprove,
  handleEdit,
  handleTransport,
  onTransportClick,
  updateData,
} from "./partials/functions";
import { UseAuth } from "../../../../config/authContext";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
  FloatingLabel,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import firebase from "../../../../config/firebase";
import NavMenu from "../../../../components/partials/navbarMenu";
import MidMileDocInfo from "./partials/docInfo";
import AirPortBagTable from "./partials/bagTable";
import SignatureModal from "../../../../components/partials/signatureModal";
import BagInfo from "./partials/bagInfo";
import MidMileDocSignatures from "./partials/signatures";
import { useReactToPrint } from "react-to-print";
import MidMilePrintContent from "../../General/Print Component/print";
import AddBagModal from "./partials/addModal";
import SignatureModalWithName from "./partials/signatureGudangModal";
import EditMasterBagModal from "./partials/editModal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MidMileDocument from "../../General/Print Component/midMileDocument";
import ToastWarning from "../../../../components/partials/toastWarning";
import { FaCheck, FaPen } from "react-icons/fa";

const MidMileAirportDoc = () => {
  const { key } = useParams();
  const auth = UseAuth();

  // Initialize Database Reference
  const dbRef = firebase.database().ref("midMile");
  // const dbRef = firebase.database().ref("test/midMile");

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState({
    addBag: false,
    editBag: false,
    checkerSignature: false,
    empuSignature: false,
    driverSignature: false,
  });
  const [currentFocus, setCurrentFocus] = useState();
  const [signatureImage, setSignatureImage] = useState("");
  const [gudangBandaraState, setGudangBandaraState] = useState({
    namaPetugas: "",
    signatureImage: "",
  });
  const [driverState, setDriverState] = useState({
    namaPetugas: "",
    signatureImage: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
  });
  const inputRef = useRef(null);

  const [state, setState] = useState({
    searched: "",
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value.toUpperCase().replace(/ /g, ""),
    });
  };

  useEffect(() => {
    fetchData({
      dbRef: dbRef,
      key: key,
      setData: setData,
      setLoading: setLoading,
      setBagList: setBagList,
    });
  }, [auth.origin]);
  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>
          {loading ? (
            <Spinner animation="grow" size="sm" />
          ) : (
            data.documentNumber
          )}
        </h2>
        <hr />
        <div className="mt-4">
          <MidMileDocInfo docData={data} loading={loading} />
          <hr />
          {data.status === "Received" || data.status === "Received*" ? null : (
            <>
              <InputGroup className="mb-3">
                <FloatingLabel controlId="floatingInput" label="Bag No.">
                  <Form.Control
                    type="text"
                    placeholder="Bag No."
                    name="searched"
                    value={state.searched}
                    ref={inputRef}
                    onChange={(event) => handleChange(event)}
                  />
                </FloatingLabel>
                <Button
                  variant="primary"
                  className="w-"
                  onClick={() =>
                    handleAction({
                      state: state,
                      setState: setState,
                      bagList: bagList,
                      document: data,
                      setToast: setToast,
                      statusBag: "Standby",
                    })
                  }
                >
                  <FaCheck />
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    handleEdit({
                      state: state,
                      setState: setState,
                      bagList: bagList,
                      show: show,
                      setShow: setShow,
                      setCurrentFocus: setCurrentFocus,
                    })
                  }
                >
                  <FaPen />
                </Button>
              </InputGroup>
              <hr />
            </>
          )}
          <AirPortBagTable bagList={bagList} loading={loading} />
        </div>
        <div className="d-grid gap-2">
          {data.status === "Received" || data.status === "Received*" ? null : (
            <Button
              variant="outline-primary"
              onClick={() =>
                setShow({
                  ...show,
                  addBag: true,
                })
              }
            >
              Add Bag
            </Button>
          )}
        </div>
        <BagInfo bagList={bagList} />
        <hr />
        {data.status === "Received" || data.status === "Received*" ? null : (
          <>
            <Button
              variant="primary"
              className="me-2"
              onClick={() => {
                handleApprove({
                  user: auth.name,
                  bagList: bagList,
                  show: show,
                  setShow: setShow,
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
                  document: data,
                  bagList: bagList,
                  show: show,
                  setShow: setShow,
                  setToast: setToast,
                });
              }}
            >
              Transport
            </Button>
          </>
        )}
        <DropdownButton
          as={ButtonGroup}
          variant="outline-dark"
          title="Export"
          id="bg-nested-dropdown"
        >
          <Dropdown.Item eventKey="1" onClick={() => reactToPrintFn()}>
            Print Ticket
          </Dropdown.Item>
          <Dropdown.Divider />
          <PDFDownloadLink
            className="mx-3"
            document={<MidMileDocument data={data} bagList={bagList} />}
            fileName={`${data.documentNumber}.pdf`}
            style={{ color: "black" }}
          >
            {({ loading }) => (loading ? "Loading..." : "Print Document")}
          </PDFDownloadLink>
        </DropdownButton>
        <MidMileDocSignatures data={data} />
        <div className="d-none">
          <div ref={contentRef}>
            <MidMilePrintContent data={data} />
          </div>
        </div>
        <SignatureModalWithName
          userText="Checker Bandara"
          show={show.checkerSignature}
          onHide={() => setShow({ ...show, checkerSignature: false })}
          state={gudangBandaraState}
          setState={setGudangBandaraState}
          nextStep={() =>
            setShow({ ...show, checkerSignature: false, empuSignature: true })
          }
        />
        <SignatureModal
          userText="Petugas EMPU"
          show={show.empuSignature}
          onHide={() => setShow({ ...show, empuSignature: false })}
          onChange={setSignatureImage}
          onSubmit={() => {
            updateData({
              user: auth.name,
              documentKey: key,
              data: data,
              signatureImage: signatureImage,
              stateGudang: gudangBandaraState,
              setLoading: setLoading,
              setToast: setToast,
              onHide: () => setShow({ ...show, empuSignature: false }),
            });
          }}
        />
        <SignatureModalWithName
          userText="Driver"
          show={show.driverSignature}
          onHide={() => setShow({ ...show, driverSignature: false })}
          state={driverState}
          setState={setDriverState}
          nextStep={() => {
            handleTransport({
              documentKey: key,
              bagList: bagList,
              setLoading: setLoading,
              driverState: driverState,
              setToast: setToast,
            });
          }}
        />
        <AddBagModal
          show={show.addBag}
          onHide={() => setShow({ ...show, addBag: false })}
          document={data}
          setToast={setToast}
        />
        <EditMasterBagModal
          bag={bagList[currentFocus]}
          show={show.editBag}
          onHide={() => setShow({ ...show, editBag: false })}
          document={data}
          setToast={setToast}
          search={state}
          setSearch={setState}
        />
        <ToastWarning toast={toast} setToast={setToast} />
      </Container>
    </div>
  );
};

export default MidMileAirportDoc;
