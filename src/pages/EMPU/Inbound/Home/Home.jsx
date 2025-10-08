/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import {
  fetchCustomerData,
  fetchInboundData,
} from "@pages/EMPU/partials/functions";
import DataTransactionTable from "@pages/EMPU/partials/dataTable";
import { handleChange } from "@/components/functions/functions";

const EMPUHome = () => {
  const [state, setState] = useState({
    searched: "",
    filter: "",
    limit: 25,
  });
  const [data, setData] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [showData, setShowData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomerData({
      setCustomerList: setCustomerList,
      setLoading: setLoading,
    });
    fetchInboundData({
      state: state,
      setData: setData,
      setShowData: setShowData,
      setLoading: setLoading,
    });
  }, [state]);

  return (
    <Container>
      <h2 className="fw-bold">EMPU</h2>
      <hr />
      <DataTransactionTable
        awbList={data}
        customerList={customerList}
        loading={loading}
      />
      <hr />
      <Row>
        <Col xl={2} xs={4}>
          <FloatingLabel controlId="floatingSelectShow" label="Show">
            <Form.Select
              aria-label="Show"
              name="limit"
              onChange={() =>
                handleChange({
                  e: event,
                  state: state,
                  stateSetter: setState,
                })
              }
              value={state.limit}
              disabled={loading}
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="250">250</option>
            </Form.Select>
          </FloatingLabel>
        </Col>
      </Row>
    </Container>
  );
};

export default EMPUHome;
