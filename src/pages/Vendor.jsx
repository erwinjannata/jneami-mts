/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import NavMenu from "../components/menu";
import { useEffect, useState } from "react";
import firebase from "./../config/firebase";
import { UseAuth } from "../config/authContext";
import { useNavigate } from "react-router-dom";
import { FaPlaneCircleCheck, FaTruckPlane } from "react-icons/fa6";
import { FaBoxes, FaTruckLoading } from "react-icons/fa";

export default function Vendor() {
  const auth = UseAuth();
  const [state, setState] = useState({
    searched: "",
    limit: 50,
  });
  const [data, setData] = useState([]);
  const [showList, setShowList] = useState([]);
  let db = firebase.database().ref("manifestTransit/");
  let navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({
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
    let value = e.target.value;
    setState({ ...state, [e.target.name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchResult =
      state.searched == ""
        ? data
        : data.filter((datalist) =>
            datalist.noSurat.toUpperCase().includes(state.searched)
          );
    setShowList(searchResult);
  };

  const handleFilter = (status) => {
    if (state.filtered == true && state.currentFilter == status) {
      setShowList(data);
      setState({ ...state, filtered: false, currentFilter: "" });
    } else {
      setShowList(data.filter((datalist) => datalist.status.includes(status)));
      setState({ ...state, filtered: true, currentFilter: status });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    db.limitToLast(parseInt(state.limit)).on("value", (snapshot) => {
      let list = [];
      snapshot.forEach((childSnapshot) => {
        list.push({
          key: childSnapshot.key,
          noSurat: childSnapshot.val().noSurat,
          origin: childSnapshot.val().origin,
          destination: childSnapshot.val().destination,
          status: childSnapshot.val().status,
          bagList: childSnapshot.val().bagList,
        });
      });
      setData(list);
      setShowList(list);
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
  }, [auth.origin, auth.name, auth.level, state.limit]);

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
                onClick={() => handleFilter(category.title)}
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
        <hr />
        <Row className="mb-3">
          <Col>
            <Form onSubmit={handleSearch}>
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
              </tr>
            </thead>
            <tbody>
              {showList.length == 0 ? (
                <>
                  <tr>
                    <td colSpan={6} align="center">
                      <i>Data tidak ditemukan</i>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  {showList
                    .map((item, idx) => (
                      <tr
                        key={idx}
                        onClick={() => navigate(`/doc/${item.key}`)}
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
