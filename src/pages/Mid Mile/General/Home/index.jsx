/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { fetchData, handleFilter, handleFind } from "./partials/functions";
import firebase from "../../../../config/firebase";
import DocumentTable from "./partials/documentTable";
import NavMenu from "../../../../components/partials/navbarMenu";
import MidMileCategoryCards from "./partials/categoryCards";
import { handleChange } from "../../../../components/functions/functions";

const AirportHomePage = () => {
  const dbRef = firebase.database().ref("midMile/documents");
  const [data, setData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [state, setState] = useState({
    limit: 10,
    filtered: false,
    currentFilter: "",
  });
  const [loading, setLoading] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setLoading(true);
    fetchData({
      dbRef: dbRef,
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
        <h2>Mid Mile</h2>
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
    </div>
  );
};

export default AirportHomePage;
