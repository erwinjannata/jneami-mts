/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { fetchData, handleFilter, handleFind } from "./partials/functions";
import DocumentTable from "./partials/documentTable";
import NavMenu from "../../../../components/partials/navbarMenu";
import MidMileCategoryCards from "./partials/categoryCards";
import { handleChange } from "../../../../components/functions/functions";
import { useLocation } from "react-router-dom";
import ToastWarning from "../../../../components/partials/toastWarning";

const AirportHomePage = () => {
  const location = useLocation();
  const { showToast, header, message } = location.state || {};

  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [state, setState] = useState({
    limit: 50,
    filtered: false,
    currentFilter: "",
  });
  const [loading, setLoading] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [toast, setToast] = useState({
    show: showToast || false,
    header: header,
    message: message,
  });

  useEffect(() => {
    setLoading(true);
    fetchData({
      limit: state.limit,
      setData: setData,
      setLoading: setLoading,
      setShowData: setShowData,
    });

    const handleResize = () => {
      setWindowSize({
        ...windowSize,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [state.limit]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2 className="fw-bold">Mid Mile</h2>
        <hr />
        <MidMileCategoryCards
          data={data}
          state={state}
          loading={loading}
          windowSize={windowSize}
          handler={handleFilter}
          setState={setState}
          setShowData={setShowData}
        />
        <hr />
        <FloatingLabel
          controlId="floatingInput"
          label="Document Number"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Document Number"
            onChange={() =>
              handleFind({
                e: event,
                documentList: data,
                setShowData: setShowData,
              })
            }
          />
        </FloatingLabel>
        <hr />
        <DocumentTable documents={showData} />
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
      <ToastWarning toast={toast} setToast={setToast} />
    </div>
  );
};

export default AirportHomePage;
