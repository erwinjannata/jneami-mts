/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row,
  Table,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { UseAuth } from "../../../config/authContext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useNavigate, useParams } from "react-router-dom";
import { handleExcel } from "../../../components/functions/functions";
import firebase from "../../../config/firebase";
import "moment/dist/locale/id";
import "moment/dist/locale/en-ca";
import "moment/dist/locale/en-sg";
import NavMenu from "../../../components/partials/navbarMenu";
import PrintFn from "../../../components/partials/print";
import DocumentInfo from "../../../components/partials/Document Details/documentInfo";
import VendorInfo from "../../../components/partials/Document Details/vendorInfo";
import BagInfo from "../../../components/partials/Document Details/bagInfo";
import Signatures from "../../../components/partials/Document Details/signatures";

export default function Doc() {
  const { key } = useParams();
  const auth = UseAuth();
  const navigate = useNavigate();
  const db = firebase.database().ref(`manifestTransit`);
  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    db.child(key).on("value", (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
        setBagList(snapshot.val().bagList);
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/");
      }
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
                <th className="w-75">Remark</th>
              </tr>
            </thead>
            <tbody>
              {bagList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.manifestNo}</td>
                  <td>{item.koli == undefined ? "-" : item.koli}</td>
                  <td>{item.pcs}</td>
                  <td>{item.kg}</td>
                  <td>{item.statusBag}</td>
                  <td>{item.remark}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <BagInfo bagList={bagList} />
        <Row>
          <Col>
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
          </Col>
        </Row>
        <hr />
        <Signatures data={data} />
      </Container>
    </div>
  );
}
