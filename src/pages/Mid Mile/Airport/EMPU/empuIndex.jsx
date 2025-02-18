/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import NavMenu from "../../../../components/partials/navbarMenu";
import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { fetchCustomerData, fetchTransactionData } from "./partials/functions";
import DataTransactionTable from "./partials/dataTable";
import { handleChange } from "../../../../components/functions/functions";

const EMPUIndex = () => {
  const [state, setState] = useState({
    searched: "",
    filter: "",
    limit: 50,
  });
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactionData({
      state: state,
      setData: setData,
      setShowData: setShowData,
      setLoading: setLoading,
    });
  }, [state]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>EMPU</h2>
        <hr />
        <DataTransactionTable awbList={data} />
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
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EMPUIndex;
