/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { UseAuth } from "../../../../config/authContext";
import { useEffect, useRef, useState } from "react";
import { fetchData } from "../../Airport/Detail Doc/partials/functions";
import NavMenu from "../../../../components/partials/navbarMenu";
import firebase from "./../../../../config/firebase";
import LoadingAnimation from "../../../../components/partials/loading";
import MidMileDocInfo from "../../Airport/Detail Doc/partials/docInfo";
import InboundBagTable from "./partials/bagTable";
import BagInfo from "../../Airport/Detail Doc/partials/bagInfo";
import MidMileDocSignatures from "../../Airport/Detail Doc/partials/signatures";
import { handleApprove } from "./partials/functions";
import { useReactToPrint } from "react-to-print";
import MidMilePrintContent from "../../General/Print Component/print";
import SignatureModal from "../../../../components/partials/signatureModal";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MidMileDocument from "../../General/Print Component/midMileDocument";

const MidMileInboundDoc = () => {
  const { key } = useParams();
  const auth = UseAuth();
  const navigate = useNavigate();

  // Initialize Database Reference
  // const dbRef = firebase.database().ref("midMile");
  const dbRef = firebase.database().ref("test/midMile");

  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureImage, setSignatureImage] = useState("");

  useEffect(() => {
    fetchData({
      key: key,
      dbRef: dbRef,
      setData: setData,
      setBagList: setBagList,
      setLoading: setLoading,
    });
  }, [auth.origin]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>{loading ? <LoadingAnimation /> : data.documentNumber}</h2>
        <hr />
        <div className="mt-4">
          <MidMileDocInfo docData={data} loading={loading} />
          <hr />
          <InboundBagTable bagList={bagList} loading={loading} />
        </div>
        <hr />
        <BagInfo bagList={bagList} />
        <hr />
        <Row>
          <Col>
            {data.status === "Dalam Perjalanan" ? (
              <Button
                variant="primary"
                className="me-2"
                onClick={() => setShowSignatureModal(true)}
              >
                Approve
              </Button>
            ) : null}
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
          </Col>
        </Row>
        <MidMileDocSignatures data={data} />
        <div className="d-none">
          <div ref={contentRef}>
            <MidMilePrintContent data={data} />
          </div>
        </div>
        <SignatureModal
          show={showSignatureModal}
          userText="Inbound Station"
          onHide={() => setShowSignatureModal(false)}
          onChange={setSignatureImage}
          onSubmit={async () => {
            await handleApprove({
              docKey: key,
              bagList: bagList,
              setLoading: setLoading,
              inboundUser: auth.name,
              signatureImage: signatureImage,
            });
            navigate("/mm");
          }}
        />
      </Container>
    </div>
  );
};

export default MidMileInboundDoc;
