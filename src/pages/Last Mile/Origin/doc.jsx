/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  handleApproval,
  handleCancel,
  handleCheck,
  handleCheckAll,
  handleOverload,
  handleReceive,
  handleReceiveChecked,
  handleUnreceive,
  handleUnreceiveChecked,
} from "./partials/functions";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseAuth } from "../../../config/authContext";
import { handleExcel } from "../../../components/functions/functions";
import { PDFDownloadLink } from "@react-pdf/renderer";
import firebase from "../../../config/firebase";
import NavMenu from "../../../components/partials/navbarMenu";
import BagTableOrigin from "./partials/bagTable";
import PrintFn from "../../../components/partials/print";
import RemarkModal from "../../../components/partials/remarkModal";
import SignatureModal from "../../../components/partials/signatureModal";
import Signatures from "../../../components/partials/Document Details/signatures";
import BagInfo from "../../../components/partials/Document Details/bagInfo";
import DocumentInfo from "../../../components/partials/Document Details/documentInfo";
import VendorInfo from "../../../components/partials/Document Details/vendorInfo";

function OriginDoc() {
  const { key } = useParams();
  const auth = UseAuth();
  const navigate = useNavigate();

  // Initialize Database Reference
  const dbRef = firebase.database().ref("manifestTransit");
  // const dbRef = firebase.database().ref("test/manifestTransit");

  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [checkedIndex, setCheckedIndex] = useState([]);
  const [overloadedItem, setOverloadedItem] = useState([]);
  const [selected, setSelected] = useState([]);
  const [changedItem, setChangedItem] = useState(0);
  const [currentFocus, setCurrentFocus] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [remark, setRemark] = useState("");
  const [img64, setImg64] = useState("");
  const [zerofilled, setZeroFilled] = useState("");
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleRemark = (index) => {
    setShow(true), setCurrentFocus(index), setRemark("");
  };

  const handleSubmitRemark = () => {
    setBagList(
      bagList.map((lists, index) => {
        if (index === currentFocus) {
          return { ...lists, remark: remark };
        } else {
          return lists;
        }
      })
    );
  };

  const handleApprove = () => {
    if (auth.name === "") {
      alert("Nama receiver kosong!");
    } else if (auth.origin !== data.origin) {
      alert("User tidak memiliki akses untuk memproses");
    } else if (data.noRef === "") {
      alert("No. Referensi Vendor kosong");
    } else if (changedItem !== bagList.length) {
      alert("Periksa kembali bag yang belum diterima");
    } else if (overloadedItem.length === bagList.length) {
      alert("Semua bag tidak diangkut vendor, konfirmasi ulang data bag");
    } else {
      setShowSignature(true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    dbRef.child(key).on("value", (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
        setBagList(snapshot.val().bagList);
        setZeroFilled(snapshot.val().noSurat.split("/")[3]);
        setLoading(false);
      } else {
        navigate("/");
      }
    });

    setWindowSize({
      ...windowSize,
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setWindowSize({
        ...windowSize,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const unloadCallback = (e) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("beforeunload", unloadCallback);
    };
  }, [auth.name, auth.origin]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <div className="mt-4">
          <DocumentInfo data={data} />
          <VendorInfo
            data={data}
            setterData={setData}
            windowSize={windowSize}
          />
        </div>
        <hr />
        <BagTableOrigin
          data={data}
          bagList={bagList}
          setterBagList={setBagList}
          loading={loading}
          checkedIndex={checkedIndex}
          setterCheckedIndex={setCheckedIndex}
          changedItem={changedItem}
          setterChangedItem={setChangedItem}
          setterOverloadedItem={setOverloadedItem}
          setterSelected={setSelected}
          onReceive={handleReceive}
          onUnreceive={handleUnreceive}
          onRemarks={handleRemark}
          onCancel={handleCancel}
          onOverload={handleOverload}
          oncheck={handleCheck}
          oncheckAll={handleCheckAll}
          selected={selected}
        />
        {auth.origin === data.origin && data.status === "Menunggu Vendor" ? (
          <Row>
            {checkedIndex.length == 0 ? null : (
              <Col>
                <Button
                  className="m-2"
                  variant="primary"
                  onClick={() =>
                    handleReceiveChecked(
                      checkedIndex,
                      setCheckedIndex,
                      bagList,
                      changedItem,
                      setChangedItem
                    )
                  }
                >
                  Received
                </Button>
                <Button
                  className="m-2"
                  variant="secondary"
                  onClick={() =>
                    handleUnreceiveChecked(
                      checkedIndex,
                      setCheckedIndex,
                      bagList,
                      changedItem,
                      setChangedItem
                    )
                  }
                >
                  Unreceived
                </Button>
              </Col>
            )}
          </Row>
        ) : null}
        <BagInfo bagList={bagList} />
        <Row>
          {loading ? (
            <Spinner animation="grow" size="sm" />
          ) : (
            <Col>
              {data.status === "Menunggu Vendor" &&
              auth.origin === data.origin ? (
                <Button variant="primary" onClick={handleApprove}>
                  Approve
                </Button>
              ) : null}
              {changedItem === 0 ? (
                <ButtonGroup>
                  <DropdownButton
                    as={ButtonGroup}
                    title="Download File"
                    id="bg-nested-dropdown"
                    variant="success"
                    className="mx-2"
                  >
                    <Dropdown.Item
                      eventKey="1"
                      onClick={() => handleExcel(data, bagList)}
                    >
                      Excel File (.xlsx)
                    </Dropdown.Item>
                    <hr className="mx-4" />
                    <PDFDownloadLink
                      className="mx-3"
                      document={<PrintFn bagList={bagList} data={data} />}
                      fileName={`${data.noSurat}.pdf`}
                      style={{ color: "black" }}
                    >
                      {({ loading }) =>
                        loading ? "Loading..." : "PDF File (.pdf)"
                      }
                    </PDFDownloadLink>
                  </DropdownButton>
                </ButtonGroup>
              ) : null}
            </Col>
          )}
        </Row>
        <hr />
        <RemarkModal
          show={show}
          onHide={() => {
            setShow(false), setCurrentFocus();
          }}
          getvalue={setRemark}
          getfocus={setCurrentFocus}
          setvalue={handleSubmitRemark}
        />
        <SignatureModal
          show={showSignature}
          onHide={() => setShowSignature(false)}
          onChange={setImg64}
          onSubmit={() =>
            handleApproval({
              key: key,
              data: data,
              bagList: bagList,
              dbRef: dbRef,
              docNumber: zerofilled,
              overloadedItem: overloadedItem,
              signatureImage: img64,
              setterLoading: setLoading,
              setterChangedItem: setChangedItem,
              setterOverloadedItem: setOverloadedItem,
            })
          }
        />
        <Signatures data={data} />
      </Container>
    </div>
  );
}

export default OriginDoc;
