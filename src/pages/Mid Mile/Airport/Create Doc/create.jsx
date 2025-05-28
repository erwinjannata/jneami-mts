/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { UseAuth } from "../../../../config/authContext";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  approveDoc,
  fileChange,
  getDocNumber,
  readFile,
} from "./partials/functions";
import NavMenu from "../../../../components/partials/navbarMenu";
import BagTable from "./partials/bagTable";
import DocInfo from "./partials/docInfo";

const MidMileCreateDoc = () => {
  const auth = UseAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [docNumber, setDocNumber] = useState("");
  const [storageNumber, setStorageNumber] = useState("");
  const [collectionLength, setCollectionLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bagList, setBagList] = useState([]);

  useEffect(() => {
    getDocNumber({
      setDocNumber: setDocNumber,
      setStorageNumber: setStorageNumber,
      setCollectionLength: setCollectionLength,
    });
  }, []);

  const handleApprove = async () => {
    if (docNumber === "") {
      alert(
        "Nomor dokumen tidak valid, silahkan refresh halaman atau login kembali"
      );
    } else if (auth.origin === "") {
      alert(
        "User origin tidak valid, silahkan refresh halaman atau login kembali"
      );
    } else if (bagList.length === 0) {
      alert("Tidak ada data bag");
    } else {
      approveDoc({
        userInfo: auth.name,
        docNumber: docNumber,
        storageNumber: storageNumber,
        bagList: bagList,
        setLoading: setLoading,
        collectionLength: collectionLength,
      });
    }
  };

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Create Mid Mile Document</h2>
        <hr />
        <div className="mt-4">
          <Row className="mt-4">
            <Col>
              <strong>No. Surat :</strong> {docNumber}
            </Col>
          </Row>
          <br />
          <Row>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                <strong>Excel SMU</strong>
              </Form.Label>
              <Form.Control
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(event) =>
                  fileChange({ event: event, setFile: setFile })
                }
              />
            </Form.Group>
          </Row>
          <Button
            variant="success"
            onClick={() => readFile({ file: file, setBagList: setBagList })}
          >
            Submit
          </Button>
          <hr />
          <BagTable
            bagList={bagList}
            setBagList={setBagList}
            loading={loading}
          />
          <hr />
          <DocInfo bagList={bagList} />
          <hr />
          <Button variant="outline-primary" onClick={() => handleApprove()}>
            Approve
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default MidMileCreateDoc;
