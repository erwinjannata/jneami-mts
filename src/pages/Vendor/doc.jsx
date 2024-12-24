/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./../../index.css";
import { useState, useEffect } from "react";
import { UseAuth } from "../../config/authContext";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row,
  Table,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import firebase from "./../../config/firebase";
import NavMenu from "../../components/partials/navbarMenu";
import { handleExcel } from "../../components/functions/functions";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PrintFn from "../../components/partials/print";
import RemarkModal from "../../components/partials/remarkModal";
import DocumentInfo from "../../components/partials/Document Details/documentInfo";
import VendorInfo from "../../components/partials/Document Details/vendorInfo";
import BagInfo from "../../components/partials/Document Details/bagInfo";
import Signatures from "../../components/partials/Document Details/signatures";

function VendorDoc() {
  const { key } = useParams();
  const auth = UseAuth();
  // const dbRef = firebase.database().ref("manifestTransit");
  const dbRef = firebase.database().ref("test/manifestTransit");
  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [remark, setRemark] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentFocus, setCurrentFocus] = useState();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  let navigate = useNavigate();

  const handleSubmitRemark = () => {
    setBagList(
      bagList.map((lists, index) => {
        if (index === currentFocus) {
          if (lists.remark.includes("MERPATI:")) {
            return {
              ...lists,
              remark: `${lists.remark}, ${remark}`,
            };
          } else {
            return {
              ...lists,
              remark:
                lists.remark == ""
                  ? `${lists.remark}MERPATI: ${remark}`
                  : `${lists.remark} | MERPATI: ${remark}`,
            };
          }
        } else {
          return lists;
        }
      })
    );
  };

  const handleApprove = async () => {
    if (auth.origin === "VENDOR") {
      if (confirm("Konfirmasi update data?") === true) {
        setLoading(true);
        await dbRef
          .child(key)
          .update({
            bagList: bagList,
          })
          .then(() => {
            setLoading(false);
            alert("Berhasil update remarks");
            window.scrollTo(0, 0);
          })
          .catch((error) => {
            setLoading(false);
            alert(error.error);
          });
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    dbRef.child(key).on("value", (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
        setBagList(snapshot.val().bagList);
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
        <Row>
          <div>
            <Table responsive striped id="tableData">
              <thead id="stickyHead">
                <tr>
                  <th className="w-auto">No.</th>
                  <th className="w-25">Manifest No.</th>
                  <th className="w-auto">Koli</th>
                  <th className="w-auto">Pcs</th>
                  <th className="w-auto">Kg</th>
                  <th className="w-25">Status Bag</th>
                  <th className="w-50">Remark</th>
                </tr>
              </thead>
              <tbody>
                {bagList.map((item, index) => (
                  <tr key={index} className="position-relative">
                    <td>{index + 1}</td>
                    <td>{item.manifestNo}</td>
                    <td>{item.koli}</td>
                    <td>{item.pcs}</td>
                    <td>{item.kg}</td>
                    <td>{item.statusBag}</td>
                    <td>{item.remark}</td>
                    <td>
                      {data.status === "Dalam Perjalanan" ? (
                        <Button
                          variant="warning"
                          className="m-2"
                          disabled={loading}
                          onClick={() => {
                            setShow(true);
                            setCurrentFocus(index);
                            setRemark("");
                          }}
                        >
                          Remark
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Row>
        <BagInfo bagList={bagList} />
        <Row>
          <Col>
            {data.status === "Dalam Perjalanan" ? (
              <Button
                variant="outline-primary"
                disabled={loading}
                onClick={() => handleApprove()}
              >
                Submit
              </Button>
            ) : null}
            <ButtonGroup>
              <DropdownButton
                as={ButtonGroup}
                title="Download File"
                id="bg-nested-dropdown"
                variant="success"
                className="mx-2"
                disabled={loading}
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
          </Col>
        </Row>
        <hr />
        <Signatures data={data} />
        <RemarkModal
          show={show}
          onHide={() => {
            setShow(false);
            setCurrentFocus();
          }}
          getvalue={setRemark}
          getfocus={setCurrentFocus}
          setvalue={handleSubmitRemark}
        />
      </Container>
    </div>
  );
}

export default VendorDoc;
