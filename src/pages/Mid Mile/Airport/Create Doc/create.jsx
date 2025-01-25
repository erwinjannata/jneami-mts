/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { UseAuth } from "../../../../config/authContext";
import {
  handleApprove,
  handleEmpty,
  handleSubmit,
  proccessApprove,
} from "./partials/functions";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BagInfoForms from "./partials/bagForms";
import BagItemTable from "./partials/bagItemTable";
import SignatureModal from "./../../../../components/partials/signatureModal";
import firebase from "./../../../../config/firebase";
import NavMenu from "../../../../components/partials/navbarMenu";
import BagInfo from "../../../../components/partials/Document Details/bagInfo";

const Create = () => {
  const auth = UseAuth();
  const navigate = useNavigate();
  const dbRef = firebase.database();
  const [docNumber, setDocNumber] = useState("");
  const [storageNumber, setStorageNumber] = useState("");
  const [signatureImage, setSignatureImage] = useState("");
  const [collectionLength, setCollectionLength] = useState(0);
  const [state, setState] = useState({
    manifestNo: "",
    koli: "",
    pcs: "",
    kg: "",
    remark: "",
  });
  const [bagList, setBagList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Get document number
  const getDocNumber = () => {
    dbRef.ref("status").on("value", (snapshot) => {
      let count = parseInt(snapshot.child("midMileCollectionLength").val());
      let year = new Date().getFullYear().toString().substring(2, 4);
      let zerofilled = ("00000" + (count + 1)).slice(-5);
      setDocNumber(`MM/${year}/${zerofilled}`);
      setStorageNumber(`${year}-${zerofilled}`);
      setCollectionLength(count + 1);
    });
  };

  // Handle screen width changes
  const handleResize = () => {
    setWindowSize({
      ...windowSize,
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getDocNumber();

    const items = JSON.parse(localStorage.getItem("airportBagList"));
    if (items) {
      setBagList(items);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [bagList.length, windowSize]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Mid Mile</h2>
        <hr />
        <Row className="mt-4">
          <Col>
            <strong>No. Surat :</strong> {docNumber}
          </Col>
        </Row>
        <hr />
        <BagInfoForms
          state={state}
          setState={setState}
          bagList={bagList}
          setBagList={setBagList}
          handlerSubmit={handleSubmit}
          windowSize={windowSize}
        />
        <hr />
        <BagItemTable
          bagList={bagList}
          setBagList={setBagList}
          loading={loading}
        />
        <hr />
        <BagInfo bagList={bagList} />
        <br />
        <Row>
          <Col>
            {loading ? (
              <Spinner animation="grow" size="sm" />
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={() =>
                    handleApprove({
                      bagList: bagList,
                      userOrigin: auth.origin,
                      docNumber: docNumber,
                      setShow: setShow,
                    })
                  }
                >
                  Approve
                </Button>
                {bagList.length !== 0 ? (
                  <Button
                    variant="outline-danger"
                    className="mx-2"
                    onClick={() => handleEmpty({ setBagList: setBagList })}
                  >
                    <FaRegTrashAlt />
                  </Button>
                ) : null}
              </>
            )}
          </Col>
        </Row>
        <SignatureModal
          show={show}
          onHide={() => setShow(false)}
          onChange={setSignatureImage}
          onSubmit={async () => {
            await proccessApprove({
              signatureImage: signatureImage,
              userInfo: auth.name,
              docNumber: docNumber,
              storageNumber: storageNumber,
              bagList: bagList,
              setLoading: setLoading,
              collectionLength: collectionLength,
            });
            navigate("/mm");
          }}
        />
      </Container>
    </div>
  );
};

export default Create;
