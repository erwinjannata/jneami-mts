/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { PDFDownloadLink } from "@react-pdf/renderer";
import { handleExcel } from "../../../components/functions/functions";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseAuth } from "../../../config/authContext";
import {
  handleApproval,
  handleArrive,
  handleCancel,
  handleCheck,
  handleCheckAll,
  handleReceive,
  handleReceiveChecked,
  handleUnreceive,
  handleUnreceiveChecked,
} from "./partials/functions";
import NavMenu from "../../../components/partials/navbarMenu";
import firebase from "../../../config/firebase";
import SignatureModal from "../../../components/partials/signatureModal";
import BagTableDestination from "./partials/bagTable";
import PrintFn from "../../../components/partials/print";
import RemarkModal from "../../../components/partials/remarkModal";
import DocumentInfo from "../../../components/partials/Document Details/documentInfo";
import VendorInfo from "../../../components/partials/Document Details/vendorInfo";
import BagInfo from "../../../components/partials/Document Details/bagInfo";
import Signatures from "../../../components/partials/Document Details/signatures";

function DestinationDoc() {
  const { key } = useParams();
  const auth = UseAuth();
  const navigate = useNavigate();
  const dbRef = firebase.database().ref("manifestTransit");
  // const dbRef = firebase.database().ref("test/manifestTransit");
  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [checkedIndex, setCheckedIndex] = useState([]);
  const [changedItem, setChangedItem] = useState(0);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [currentFocus, setCurrentFocus] = useState();
  const [img64, setImg64] = useState("");
  const [remark, setRemark] = useState("");
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
    if (auth.name === "" || auth.origin === "") {
      alert(
        "Data user tidak ditemukan, silahkan refresh halaman, atau login ulang"
      );
    } else if (auth.origin !== data.destination) {
      alert("User tidak memiliki akses untuk memproses");
    } else if (changedItem !== bagList.length) {
      alert("Periksa kembali bag yang belum diterima");
    } else {
      setShowSignature(true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    // Fetch Data
    dbRef.child(key).on("value", (snapshot) => {
      if (snapshot.exists()) {
        setData({
          key: snapshot.key,
          ...snapshot.val(),
        });
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
        <BagTableDestination
          data={data}
          bagList={bagList}
          setterBagList={setBagList}
          changedItem={changedItem}
          setterChangedItem={setChangedItem}
          checkedIndex={checkedIndex}
          setterCheckedIndex={setCheckedIndex}
          loading={loading}
          oncheck={handleCheck}
          oncheckAll={handleCheckAll}
          onReceive={handleReceive}
          onUnreceive={handleUnreceive}
          onRemarks={handleRemark}
          onCancel={handleCancel}
        />
        {auth.origin === data.destination && data.status === "Sampai Tujuan" ? (
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
              {auth.origin === data.destination &&
              data.status === "Dalam Perjalanan" ? (
                <Button
                  variant="outline-primary"
                  onClick={() =>
                    handleArrive({
                      dbRef: dbRef,
                      data: data,
                      setterChangedItem: setChangedItem,
                      setterLoading: setLoading,
                    })
                  }
                >
                  Arrived
                </Button>
              ) : null}
              {auth.origin === data.destination &&
              data.status === "Sampai Tujuan" ? (
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
              username: auth.name,
              dbRef: dbRef,
              docNumber: zerofilled,
              data: data,
              bagList: bagList,
              signatureImage: img64,
              setterLoading: setLoading,
              setterChangedItem: setChangedItem,
            })
          }
        />
        <Signatures data={data} />
      </Container>
    </div>
  );
}

export default DestinationDoc;
