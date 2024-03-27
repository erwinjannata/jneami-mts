/* eslint-disable no-unused-vars */
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
import Menu from "../components/menu";
import "./../index.css";
import firebase from "../config/firebase";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import "moment/dist/locale/id";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../config/authContext";
import { FaTruckLoading, FaBoxes } from "react-icons/fa";
import { FaTruckPlane, FaPlaneCircleCheck } from "react-icons/fa6";

export default function Home() {
  const auth = UseAuth();
  let db = firebase.database().ref("manifestTransit/");
  let navigate = new useNavigate();
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [dataList, setDataList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [state, setState] = useState({
    number: "",
    showed: "all",
    limit: "10",
  });

  let cardsCategories = [
    {
      id: "0",
      key: "dark",
      bg: "dark",
      textColor: "white",
      title: "Received",
      text: dataList.reduce(
        (counter, obj) => (obj.status == "Received" ? (counter += 1) : counter),
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
      text: dataList.reduce(
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
      text: dataList.reduce(
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
      text: dataList.reduce(
        (counter, obj) =>
          obj.status == "Menunggu Vendor" ? (counter += 1) : counter,
        0
      ),
      icon: <FaBoxes size={50} />,
    },
  ];

  const handleChange = (e) => {
    const value = e.target.value;
    setState({ ...state, [e.target.name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchResult =
      state.number == ""
        ? dataList
        : dataList.filter((datalist) =>
            datalist.noSurat.toUpperCase().includes(state.number)
          );
    console.log(searchResult);
    setShowList(searchResult);
  };

  useEffect(() => {
    let filters =
      state.showed == "all"
        ? db
        : db.orderByChild(`${state.showed}`).equalTo(auth.origin);
    filters.limitToLast(parseInt(state.limit)).on("value", (snapshot) => {
      let data = [];

      snapshot.forEach((childSnapshot) => {
        if (
          childSnapshot.val().origin == auth.origin ||
          childSnapshot.val().destination == auth.origin
        ) {
          data.push({
            key: childSnapshot.key,
            noSurat: childSnapshot.val().noSurat,
            origin: childSnapshot.val().origin,
            destination: childSnapshot.val().destination,
            departureDate: childSnapshot.val().departureDate,
            departureTime: childSnapshot.val().departureTime,
            arrivalDate: childSnapshot.val().arrivalDate,
            arrivalTime: childSnapshot.val().arrivalTime,
            status: childSnapshot.val().status,
            sumPcs: childSnapshot.val().sumPcs,
            sumWeight: childSnapshot.val().sumWeight,
          });
        }
      });
      setDataList(data);
      setShowList(data);
    });
    db.on("child_changed", (snapshot) => {
      if (!("Notification" in window)) {
        console.log("Push Notification Not Supported");
      } else {
        Notification.requestPermission().then((permission) => {
          if (permission == "granted") {
            let i = 0;
            const interval = setInterval(() => {
              if (
                auth.origin == snapshot.val().destination &&
                snapshot.val().status == "Dalam Perjalanan"
              ) {
                const notif = new Notification(`Manifest Transit Sub Agen`, {
                  tag: "departureNotification",
                  renotify: true,
                  body: `${
                    snapshot.val().noSurat
                  } dalam perjalanan menuju JNE ${snapshot.val().destination}`,
                });
              } else if (
                auth.origin == snapshot.val().origin &&
                snapshot.val().isArrived == true &&
                snapshot.val().isReceived == false
              ) {
                const notif = new Notification(`Manifest Transit Sub Agen`, {
                  tag: "arrivalNotification",
                  renotify: true,
                  body: `${snapshot.val().noSurat} telah sampai tujuan di JNE ${
                    snapshot.val().destination
                  }`,
                });
              }
              if (i == 1) {
                clearInterval(interval);
              }
              i++;
            }, 200);
          }
        });
      }
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
  }, [auth.origin, auth.name, state.showed, state.limit, Notification]);

  return (
    <div className="screen">
      <Menu />
      <Container>
        <h2>Dashboard</h2>
        <hr />
        <Row className="mt-4">
          {cardsCategories.map((category, idx) => (
            <Col key={idx} xs={windowSize.width >= 768 ? "" : "0"}>
              <Card
                bg={category.bg}
                key={category.key}
                text={category.textColor}
                className="mb-2"
                border={category.bg}
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
        <Row className="mt-2">
          <Col>
            <Form onSubmit={handleSearch}>
              <FloatingLabel
                controlId="floatingInputNo"
                label="Cari no. surat"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="number"
                  value={state.number}
                  placeholder="Cari no. surat"
                  onChange={handleChange}
                />
              </FloatingLabel>
            </Form>
          </Col>
          <Col>
            <FloatingLabel controlId="floatingSelectData" label="Data">
              <Form.Select
                aria-label="Data"
                name="showed"
                onChange={handleChange}
                value={state.showed}
              >
                <option value="all">All</option>
                <option value="origin">Origin {auth.origin}</option>
                <option value="destination">Destination {auth.origin}</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <hr />
        <div
          style={{ maxHeight: "375px", overflowY: "scroll", display: "block" }}
        >
          <Table responsive hover>
            <thead>
              <tr>
                <th>No. Surat</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Waktu Keberangkatan</th>
                <th>Waktu Kedatangan</th>
              </tr>
            </thead>
            <tbody
              style={{
                maxHeight: "375px",
                overflowY: "scroll",
              }}
            >
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
                    .map((item, key) => (
                      <tr
                        key={key}
                        onClick={() => navigate(`doc/${item.key}`)}
                        className="user-select-none"
                      >
                        <td>{item.noSurat}</td>
                        <td>{item.origin}</td>
                        <td>{item.destination}</td>
                        <td>{item.status}</td>
                        <td>
                          {item.departureDate == ""
                            ? "-"
                            : `${moment(item.departureDate)
                                .locale("id")
                                .format("LL")} ${item.departureTime}`}
                        </td>
                        <td>
                          {item.arrivalDate != ""
                            ? `${moment(item.arrivalDate)
                                .locale("id")
                                .format("LL")} ${item.arrivalTime}`
                            : "-"}
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
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="500">500</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
