/* eslint-disable no-unused-vars */
import {
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import NavMenu from "../../components/menu";
import moment from "moment";
import { useEffect, useState } from "react";
import { UseAuth } from "../../config/authContext";
import firebase from "./../../config/firebase";
import { FaBoxes, FaTruckLoading } from "react-icons/fa";
import { FaPlaneCircleCheck, FaTruckPlane } from "react-icons/fa6";
import { cabangList } from "../../components/branchList";
import { useNavigate } from "react-router-dom";

function OriginIndex() {
  const auth = UseAuth();
  const navigate = useNavigate();
  const dbRef = firebase.database().ref("manifestTransit");
  const [state, setState] = useState({
    searched: "",
    limit: 50,
    filtered: false,
    currentFilter: "",
    origin: "",
    destination: "",
  });
  const [data, setData] = useState([]);
  const [windowSize, setWindowsSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  let cardsCategories = [
    {
      id: "0",
      key: "dark",
      bg: "dark",
      textColor: "white",
      title: "Received",
      text: data.reduce(
        (counter, obj) =>
          obj.status == "Received" || obj.status == "Received*"
            ? (counter += 1)
            : counter,
        0
      ),
      icon: <FaTruckLoading size={50} />,
    },
    {
      id: "1",
      key: "primary",
      bg: "primary",
      textColor: "white",
      title: "Sampai Tujuan",
      text: data.reduce(
        (counter, obj) =>
          obj.status == "Sampai Tujuan" ? (counter += 1) : counter,
        0
      ),
      icon: <FaPlaneCircleCheck size={50} />,
    },
    {
      id: "2",
      key: "warning",
      bg: "warning",
      textColor: "dark",
      title: "Dalam Perjalanan",
      text: data.reduce(
        (counter, obj) =>
          obj.status == "Dalam Perjalanan" ? (counter += 1) : counter,
        0
      ),
      icon: <FaTruckPlane size={50} />,
    },
    {
      id: "3",
      key: "danger",
      bg: "danger",
      textColor: "white",
      title: "Menunggu Vendor",
      text: data.reduce(
        (counter, obj) =>
          obj.status == "Menunggu Vendor" ? (counter += 1) : counter,
        0
      ),
      icon: <FaBoxes size={50} />,
    },
  ];

  const handleChange = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const navToDetail = (id, origin, destination) => {
    navigate(`doc/${id}`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dbRef.limitToLast(parseInt(state.limit)).on("value", (snapshot) => {
      //   let lists = [];

      snapshot.forEach((item) => {
        setData({
          key: item.key,
          ...item.val(),
        });
      });
    });
  }, [
    auth.name,
    auth.origin,
    auth.level,
    state.limit,
    state.origin,
    state.destination,
    dbRef,
  ]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Manifest Transit JNE AMI</h2>
        <hr />
        <Row>
          {cardsCategories.map((category, idx) => (
            <Col key={idx} xs={windowSize.width >= 768 ? "" : "0"}>
              <Card
                bg={
                  (state.filtered == true) &
                  (state.currentFilter == category.title)
                    ? "white"
                    : category.bg
                }
                key={category.key}
                text={
                  (state.filtered == true) &
                  (state.currentFilter == category.title)
                    ? category.bg
                    : category.textColor
                }
                border={category.bg}
                className="mb-2 user-select-none"
                // onClick={() => handleFilter(category.title)}
              >
                <Card.Body>
                  <Row>
                    <Col xs={3} sm={3} lg={3}>
                      {category.icon}
                    </Col>
                    <Col xs={9} sm={9} lg={9}>
                      <Card.Title className="small">
                        {category.title}
                      </Card.Title>
                      <Card.Text className="display-6">
                        {category.text}
                      </Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Row className="mt-4">
          <Col>
            <FloatingLabel controlId="floatingSelectData" label="Origin">
              <Form.Select
                aria-label="Origin"
                name="origin"
                // onChange={handleCabang}
                value={state.origin}
              >
                <option value="">ALL DATA</option>
                {cabangList.map((item, id) => (
                  <option key={id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingSelectData" label="Destination">
              <Form.Select
                aria-label="Destination"
                name="destination"
                // onChange={handleCabang}
                value={state.destination}
              >
                <option value="">ALL DATA</option>
                {cabangList.map((item, id) => (
                  <option key={id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <hr />
        <Row className="mb-3">
          <Col>
            <Form>
              <FloatingLabel
                controlId="floatingInput"
                label="No. Surat Manifest"
              >
                <Form.Control
                  type="text"
                  name="searched"
                  placeholder="Cari no. surat manifest"
                  value={state.searched}
                  onChange={handleChange}
                />
              </FloatingLabel>
            </Form>
          </Col>
        </Row>
        <div
          style={{ maxHeight: "500px", overflowY: "scroll", display: "block" }}
        >
          <Table responsive hover>
            <thead>
              <tr>
                <th>No. Surat</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Koli</th>
                <th>Weight</th>
                <th>Status Manifest</th>
                <th>Approved Date</th>
                <th>Departure Date</th>
              </tr>
            </thead>
            <tbody>
              {data.length == 0 ? (
                <>
                  <tr>
                    <td colSpan={8} align="center">
                      <i>Data tidak ditemukan</i>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {data
                    .map((item, idx) => (
                      <tr
                        key={idx}
                        onClick={() =>
                          navToDetail(item.key, item.origin, item.destination)
                        }
                      >
                        <td>{item.noSurat}</td>
                        <td>{item.origin}</td>
                        <td>{item.destination}</td>
                        <td>
                          {item.bagList.reduce((prev, next) => {
                            return prev + parseInt(next.koli);
                          }, 0) + " koli"}
                        </td>
                        <td>
                          {item.bagList.reduce((prev, next) => {
                            return prev + parseInt(next.kg);
                          }, 0) + " kg"}
                        </td>
                        <td>{item.status}</td>
                        <td>{`${item.approvedDate} ${item.approvedTime}`}</td>
                        <td>
                          {item.departureDate == ""
                            ? "-"
                            : `${item.departureDate} ${item.departureTime}`}
                        </td>
                      </tr>
                    ))
                    .reverse()}
                </>
              )}
            </tbody>
          </Table>
        </div>
        <hr />
        <Row>
          <Col xl={1} xs={4}>
            <FloatingLabel controlId="floatingSelectShow" label="Show">
              <Form.Select
                aria-label="Show"
                name="limit"
                onChange={handleChange}
                value={state.limit}
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
}

export default OriginIndex;
