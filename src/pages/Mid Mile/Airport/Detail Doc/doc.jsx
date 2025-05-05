/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  fetchData,
  handleApprove,
  handleRcc,
  handleRmrk,
  handleTransport,
  updateData,
} from "./partials/functions";
import { UseAuth } from "../../../../config/authContext";
import {
  Alert,
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

const MidMileAirportDoc = () => {
  const { key } = useParams();
  const auth = UseAuth();
  const dbRef = firebase.database().ref("midMile");
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [oldBagList, setOldBagList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showAddBag, setShowAddBag] = useState(false);
  const [showSignatureAirport, setShowSignatureAirport] = useState(false);
  const [showSignatureGudang, setShowSignatureGudang] = useState(false);
  const [showSignatureDriver, setShowSignatureDriver] = useState(false);
  const [currentFocus, setCurrentFocus] = useState();
  const [remark, setRemark] = useState("");
  const [zerofilled, setZeroFilled] = useState("");
  const [signatureImage, setSignatureImage] = useState("");
  const [gudangBandaraState, setGudangBandaraState] = useState({
    namaPetugas: "",
    signatureImage: "",
  });
  const [driverState, setDrvierState] = useState({
    namaPetugas: "",
    signatureImage: "",
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

  const handleSubmitRemark = () => {
    setBagList(
      bagList.map((bag, index) => {
        if (index === currentFocus) {
          return { ...bag, remark: remark };
        } else {
          return bag;
        }
      })
    );
  };

  useEffect(() => {
    fetchData({
      dbRef: dbRef,
      key: key,
      setData: setData,
      setBagList: setBagList,
      setOldBagList: setOldBagList,
      setLoading: setLoading,
      setZeroFilled: setZeroFilled,
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
                  onClick={() =>
                    handleRcc({
                      state: state,
                      bagList: bagList,
                      inputRef: inputRef,
                      setState: setState,
                      setBagList: setBagList,
                    })
                  }
                >
                  Received
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    handleRmrk({
                      state: state,
                      bagList: bagList,
                      inputRef: inputRef,
                      setShow: setShow,
                      setRemark: setRemark,
                      setCurrentFocus: setCurrentFocus,
                    })
                  }
                >
                  Remark
                </Button>
              </InputGroup>
              <hr />
            </>
          )}
          <AirPortBagTable
            data={data}
            bagList={bagList}
            setBagList={setBagList}
            oldBagList={oldBagList}
            setOldBagList={setOldBagList}
            loading={loading}
            setShow={setShow}
            setRemark={setRemark}
            setCurrentFocus={setCurrentFocus}
          />
        </div>
        <div className="d-grid gap-2">
          {data.status === "Received" || data.status === "Received*" ? null : (
            <Button
              variant="outline-primary"
              onClick={() => setShowAddBag(true)}
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
                  setShow: setShowSignatureGudang,
                });
              }}
            >
              {data.status === "Submitted" ? "Approve" : "Update"}
            </Button>
            <Button
              variant="outline-success"
              className="me-2"
              onClick={() => {
                const isAllOnTransport = bagList.every(
                  (bag) => bag.statusBag === "Dalam Perjalanan"
                );
                const isAllNotStandby = bagList.every(
                  (bag) => bag.statusBag === "Submitted"
                );

                if (data.status === "Submitted") {
                  alert("Bag belum dikonfirmasi oleh tim Airport");
                } else if (isAllOnTransport) {
                  alert(
                    "Semua bag sedang dalam proses transport menuju Inbound Station"
                  );
                } else if (isAllNotStandby) {
                  alert("Bag belum dikonfirmasi oleh tim Admin Airport");
                } else {
                  setShowSignatureDriver(true);
                }
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
        <EditMasterBagModal
          index={currentFocus}
          bagList={currentFocus !== undefined ? bagList : []}
          setBagList={setBagList}
          show={show}
          setShow={setShow}
        />
        <SignatureModal
          userText="Petugas EMPU"
          show={showSignatureAirport}
          onHide={() => setShowSignatureAirport(false)}
          onChange={setSignatureImage}
          onSubmit={() => {
            updateData({
              user: auth.name,
              documentKey: key,
              data: data,
              bagList: bagList,
              dbRef: dbRef,
              signatureImage: signatureImage,
              setLoading: setLoading,
              stateGudang: gudangBandaraState,
            });
          }}
        />
        <SignatureModalWithName
          userText="Driver"
          show={showSignatureDriver}
          setShow={setShowSignatureDriver}
          state={driverState}
          setState={setDrvierState}
          nextStep={() => {
            handleTransport({
              documentKey: key,
              bagList: bagList,
              setLoading: setLoading,
              driverState: driverState,
            });
          }}
        />
        <SignatureModalWithName
          userText="Petugas Bandara"
          show={showSignatureGudang}
          setShow={setShowSignatureGudang}
          state={gudangBandaraState}
          setState={setGudangBandaraState}
          nextStep={() => setShowSignatureAirport(true)}
        />
        <AddBagModal
          bagList={bagList}
          setBagList={setBagList}
          oldBagList={oldBagList}
          setOldBagList={setOldBagList}
          show={showAddBag}
          setShow={setShowAddBag}
          documentId={key}
        />
      </Container>
    </div>
  );
};

export default MidMileAirportDoc;
