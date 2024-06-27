/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  Placeholder,
  Row,
  Table,
} from "react-bootstrap";
import Menu from "../components/menu";
import "./../index.css";
import firebase from "../config/firebase";
import { useEffect, useState } from "react";
import moment from "moment";
import "moment/dist/locale/id";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../config/authContext";
import { FaTruckLoading, FaBoxes } from "react-icons/fa";
import { FaTruckPlane, FaPlaneCircleCheck } from "react-icons/fa6";

export default function Home() {
  const auth = UseAuth();
  let now = new Date();
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
    limit: "50",
    filtered: false,
    currentFilter: "",
    origin: "All Cabang",
    destination: "All Cabang",
    warningItem: 0,
  });
  const [loading, setLoading] = useState(true);

  let cabangList = [
    { id: "0", name: "All Cabang" },
    { id: "1", name: "ALAS" },
    { id: "2", name: "BIMA" },
    { id: "3", name: "BOLO" },
    { id: "4", name: "DOMPU" },
    { id: "5", name: "EMPANG" },
    { id: "6", name: "MANGGELEWA" },
    { id: "7", name: "MATARAM" },
    { id: "8", name: "PADOLO" },
    { id: "9", name: "PLAMPANG" },
    { id: "10", name: "PRAYA" },
    { id: "11", name: "SELONG" },
    { id: "12", name: "SUMBAWA" },
    { id: "13", name: "TALIWANG" },
    { id: "14", name: "TANJUNG" },
    { id: "15", name: "UTAN" },
  ];

  let cardsCategories = [
    {
      id: "0",
      key: "dark",
      bg: "dark",
      textColor: "white",
      title: "Received",
      text: dataList.reduce(
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
    setState({
      ...state,
      [e.target.name]: value,
      filtered: false,
      currentFilter: "",
      origin: "All Cabang",
      destination: "All Cabang",
    });
  };

  const handleCabang = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
      filtered: false,
      currentFilter: "",
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setState({
      ...state,
      origin: "All Cabang",
      destination: "All Cabang",
    });
    const searchResult =
      state.number == ""
        ? dataList
        : dataList.filter((datalist) =>
            datalist.noSurat.toUpperCase().includes(state.number)
          );
    setShowList(searchResult);
  };

  const handleFilter = (status) => {
    if (state.filtered == true && state.currentFilter == status) {
      setShowList(dataList);
      setState({
        ...state,
        filtered: false,
        currentFilter: "",
      });
    } else {
      setState({
        ...state,
        filtered: true,
        currentFilter: status,
      });
      setShowList(
        dataList.filter((datalist) => datalist.status.includes(status))
      );
    }
  };

  useEffect(() => {
    if (auth.origin == "VENDOR") {
      navigate("/vendor");
    }
    let filters =
      state.showed == "all"
        ? db
        : db.orderByChild(`${state.showed}`).equalTo(auth.origin);
    filters.limitToLast(250).on("value", (snapshot) => {
      let data = [];

      snapshot.forEach((childSnapshot) => {
        if (auth.origin == "MATARAM") {
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
            durasi: childSnapshot.val().durasi,
            noPolisi: childSnapshot.val().noPolisi,
            // bagList: childSnapshot.val().bagList,
          });
        } else {
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
              durasi: childSnapshot.val().durasi,
              noPolisi: childSnapshot.val().noPolisi,
              // bagList: childSnapshot.val().bagList,
            });
          }
        }
      });

      var result = data;
      if (state.origin == "All Cabang" && state.destination != "All Cabang") {
        result = data.filter((datalist) => {
          return datalist["destination"] == state.destination;
        });
      } else if (
        state.origin != "All Cabang" &&
        state.destination == "All Cabang"
      ) {
        result = data.filter((datalist) => {
          return datalist["origin"] == state.origin;
        });
      } else if (
        state.origin != "All Cabang" &&
        state.destination != "All Cabang"
      ) {
        result = data.filter((datalist) => {
          return (
            datalist["origin"] == state.origin &&
            datalist["destination"] == state.destination
          );
        });
      }
      let start = result.length - state.limit;
      setDataList(result.slice(start < 0 ? 0 : start, result.length));
      setShowList(result.slice(start < 0 ? 0 : start, result.length));
      setLoading(false);
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
                snapshot.val().isArrived != "" &&
                snapshot.val().isReceived == ""
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
  }, [
    auth.origin,
    auth.name,
    state.number,
    state.limit,
    state.origin,
    state.destination,
    state.showed,
    Notification,
    loading,
  ]);

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
                      {loading ? (
                        <Placeholder as={Card.Text} animation="glow">
                          <Placeholder xs={1} size="lg" />
                        </Placeholder>
                      ) : (
                        <Card.Text className="display-6">
                          {category.text}
                        </Card.Text>
                      )}
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
                <option value="all">All Data</option>
                <option value="origin">Origin {auth.origin}</option>
                <option value="destination">Destination {auth.origin}</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          {state.showed == "all" || state.showed == "destination" ? (
            <Col>
              <FloatingLabel controlId="floatingSelectData" label="Origin">
                <Form.Select
                  aria-label="Origin"
                  name="origin"
                  onChange={handleCabang}
                  value={state.origin}
                >
                  {cabangList.map((item, id) => (
                    <option key={id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </Col>
          ) : null}
          {state.showed == "all" || state.showed == "origin" ? (
            <Col>
              <FloatingLabel controlId="floatingSelectData" label="Destination">
                <Form.Select
                  aria-label="Destination"
                  name="destination"
                  onChange={handleCabang}
                  value={state.destination}
                >
                  {cabangList.map((item, id) => (
                    <option key={id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </Col>
          ) : null}
        </Row>
        <hr />
        <div className="tableData">
          <Table responsive hover>
            <thead>
              <tr>
                <th>No. Surat</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Status</th>
                {/* <th>Koli</th>
                <th>Weight</th> */}
                <th>Waktu Keberangkatan</th>
                <th>Waktu Kedatangan</th>
                <th>Durasi Perjalanan</th>
                <th>No. Polisi</th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={10}>
                    <Placeholder animation="wave">
                      <Placeholder xs={12} bg="secondary" size="lg" />
                    </Placeholder>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody
                style={{
                  maxHeight: "375px",
                }}
              >
                {showList.length == 0 ? (
                  <>
                    <tr>
                      <td
                        colSpan={windowSize.width > "768" ? 10 : 6}
                        align="center"
                      >
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
                          {/* <td>
                            {item.bagList
                              .reduce((prev, next) => {
                                return prev + parseInt(next.koli);
                              }, 0)
                              .toString()}
                          </td> */}
                          {/* <td>
                            {item.bagList.reduce((prev, next) => {
                              return prev + parseInt(next.kg);
                            }, 0) + " kg"}
                          </td> */}
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
                          <td>
                            {item.durasi == undefined ? "-" : item.durasi}
                          </td>
                          <td>{item.noPolisi}</td>
                        </tr>
                      ))
                      .reverse()}
                  </>
                )}
              </tbody>
            )}
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
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
