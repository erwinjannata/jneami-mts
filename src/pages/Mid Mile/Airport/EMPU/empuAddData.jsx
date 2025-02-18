/* eslint-disable no-unused-vars */
import { Button, Container, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { fileChange } from "../../Admin Inbound/Create Doc/partials/functions";
import {
  fetchCustomerData,
  readFile,
  submitTransactionData,
} from "./partials/functions";
import NavMenu from "../../../../components/partials/navbarMenu";
import AWBTable from "./partials/awbTable";
import EMPUSelectCustomerModal from "./partials/empuSelectCustomerModal";
import { useNavigate } from "react-router-dom";

const EMPUAddData = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [awbList, setAwbList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [currentFocus, setCurrentFocus] = useState();

  useEffect(() => {
    fetchCustomerData({
      setLoading: setLoading,
      setCustomerList: setCustomerList,
    });
  }, []);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>EMPU</h2>
        <hr />
        <Row>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>
              <strong>Excel SMU</strong>
            </Form.Label>
            <Form.Control
              type="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              disabled={loading}
              onChange={(event) => {
                fileChange({ event: event, setFile: setFile });
              }}
            />
          </Form.Group>
        </Row>
        <hr />
        <Button
          variant="primary"
          onClick={() => readFile({ file: file, setAwbList })}
          disabled={loading}
        >
          Upload
        </Button>
        <hr />
        <AWBTable
          awbList={awbList}
          setAwbList={setAwbList}
          setShowSelectModal={setShowSelectModal}
          setCurrentFocus={setCurrentFocus}
        />
        <hr />
        <Button
          variant="outline-primary"
          onClick={() =>
            submitTransactionData({
              awbList: awbList,
              setLoading: setLoading,
              doAfter: navigate,
            })
          }
        >
          Approve
        </Button>
      </Container>
      <EMPUSelectCustomerModal
        index={currentFocus}
        show={showSelectModal}
        setShow={setShowSelectModal}
        customerList={customerList}
        awbList={awbList}
        setAwbList={setAwbList}
      />
    </div>
  );
};

export default EMPUAddData;
