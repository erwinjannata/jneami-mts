/* eslint-disable no-unused-vars */
import { Button, Container, Form, Row } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import { fileChange } from "../../Admin Inbound/Create Doc/partials/functions";
import { fetchCustomerData, readFile } from "./partials/functions";
import { useReactToPrint } from "react-to-print";
import NavMenu from "../../../../components/partials/navbarMenu";
import AWBTable from "./partials/awbTable";
import EMPUReceipt from "../../General/Print Component/empuReceipt";

const EMPUAddData = () => {
  const [file, setFile] = useState();
  const [awbList, setAwbList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

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
        <Button
          variant="success"
          className="mx-2"
          onClick={() => reactToPrintFn()}
          disabled={loading}
        >
          Print
        </Button>
        <hr />
        <AWBTable awbList={awbList} />
        <div className="d-none">
          <div ref={contentRef}>
            <EMPUReceipt data={awbList} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EMPUAddData;
