/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { UseAuth } from "../../config/authContext";
import {
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import firebase from "./../../config/firebase";
import NavMenu from "../../components/partials/navbarMenu";
import {
  handleDownloadPDF,
  handleExcel,
} from "../../components/functions/functions";
import { PDFDownloadLink } from "@react-pdf/renderer";

function VendorDoc() {
  const { key } = useParams();
  const auth = UseAuth();
  const dbRef = firebase.database().ref("manifestTransit");
  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  let navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };

  const dataDisplay = [
    [
      { label: "No. Surat", value: data.noSurat },
      { label: "Status", value: data.status },
    ],
    [
      { label: "Origin", value: data.origin },
      { label: "Destination", value: data.destination },
    ],
    [
      { label: "Approved by", value: data.preparedBy },
      {
        label: "Received by",
        value: data.isReceived ? `${data.receivedBy}` : "-",
      },
    ],
    [
      {
        label: "Approved at",
        value: `${moment(data.approvedDate).locale("id").format("LL")} ${
          data.approvedTime
        }`,
      },
      {
        label: "Received at",
        value: data.isReceived
          ? `${moment(data.receivedDate).locale("id").format("LL")} ${
              data.receivedTime
            }`
          : "-",
      },
    ],
  ];

  const vendorInfoCol = [
    {
      id: "floatingNoRef",
      name: "noRef",
      value: data.noRef,
      placeholder: "No. Ref. Vendor",
    },
    {
      id: "floatingNoPolisi",
      name: "noPolisi",
      value: data.noPolisi,
      placeholder: "No. Polisi Kendaraan",
    },
    {
      id: "floatingDriver",
      name: "driver",
      value: data.driver,
      placeholder: "Nama Driver",
    },
  ];

  const suratInfo = [
    {
      label: "Total Koli",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.koli);
      }, 0)} koli`,
    },
    {
      label: "Total Pcs",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.pcs);
      }, 0)} pcs`,
    },
    {
      label: "Total Weight",
      value: `${bagList.reduce((prev, next) => {
        return prev + parseInt(next.kg);
      }, 0)} Kg`,
    },
  ];

  const signatures = [
    {
      label: "Prepared by",
      source: data.checkerSign,
      alts: "Prepared by",
      name: data.preparedBy,
    },
    {
      label: "Driver",
      source: data.vendorSign || "",
      alts: "Driver Sign",
      name: data.driver,
    },
    {
      label: "Received by",
      source: data.receiverSign,
      alts: "Received by",
      name: data.receivedBy,
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    dbRef.child(key).on("value", (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
        setBagList(snapshot.val().bagList);
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
          {dataDisplay.map((display, index) => (
            <div key={index}>
              <Row>
                <Col>
                  <strong>{display[0].label}</strong> <br />
                  {display[0].value}
                </Col>
                <Col>
                  <strong>{display[1].label}</strong> <br />
                  {display[1].value}
                </Col>
              </Row>
              <hr />
            </div>
          ))}
          <Row>
            {vendorInfoCol.map((info, index) => (
              <Col xs={windowSize.width >= 768 ? "" : "0"} key={index}>
                <Form.Floating
                  className={windowSize.width >= 768 ? "" : "mb-2"}
                >
                  <Form.Control
                    id={info.id}
                    type="text"
                    name={info.name}
                    value={info.value || ""}
                    placeholder={info.placeholder}
                    disabled
                  ></Form.Control>
                  <label htmlFor={info.id}>{info.placeholder}</label>
                </Form.Floating>
              </Col>
            ))}
          </Row>
        </div>
        <hr />
        <div
          style={{ maxHeight: "364px", overflowY: "scroll", display: "block" }}
        >
          <Table responsive striped>
            <thead>
              <tr>
                <th>No.</th>
                <th>Manifest No.</th>
                <th>Koli</th>
                <th>Pcs</th>
                <th>Kg</th>
                <th>Status Bag</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {bagList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.manifestNo}</td>
                  <td>{item.koli}</td>
                  <td>{item.pcs}</td>
                  <td>{item.kg}</td>
                  <td>{item.statusBag}</td>
                  <td>{item.remark}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Row className="mt-4">
          {suratInfo.map((info, index) => (
            <Col key={index}>
              <p>
                <strong>{info.label}</strong>
                <br />
                {info.value}
              </p>
            </Col>
          ))}
        </Row>
        <Row>
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
                document={handleDownloadPDF(data, bagList)}
                fileName={`${data.noSurat}.pdf`}
                style={{ color: "black" }}
              >
                {({ loading }) => (loading ? "Loading..." : "PDF File (.pdf)")}
              </PDFDownloadLink>
            </DropdownButton>
          </ButtonGroup>
        </Row>
        <hr />
        <Row>
          {signatures.map((item, index) => (
            <Col className="signatures" key={index}>
              <p>
                <strong>{item.label}</strong>
              </p>
              {item.source == "" ? null : (
                <div>
                  <img
                    className="signature"
                    src={item.source}
                    alt={item.alts}
                  />
                  <p>{item.name}</p>
                </div>
              )}
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default VendorDoc;
