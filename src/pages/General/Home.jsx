/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./../../index.css";
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../../config/authContext";
import { FaTruckLoading, FaBoxes } from "react-icons/fa";
import { FaTruckPlane, FaPlaneCircleCheck } from "react-icons/fa6";
import { handleCabang } from "../../components/functions/functions";
import { cabangList } from "../../components/data/branchList";
import firebase from "../../config/firebase";
import NavMenu from "../../components/partials/navbarMenu";
import DocListTable from "../../components/partials/documentListTable";
import CategoryCards from "../../components/partials/categoryCards";

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

  useEffect(() => {
    if (auth.origin == "VENDOR") {
      navigate("/vendor");
    }
    let filters =
      state.showed == "all"
        ? db
        : db.orderByChild(`${state.showed}`).equalTo(auth.origin);
    filters.limitToLast(150).on("value", (snapshot) => {
      let data = [];

      snapshot.forEach((childSnapshot) => {
        if (auth.origin == "MATARAM") {
          data.push({
            key: childSnapshot.key,
            ...childSnapshot.val(),
          });
        } else {
          if (
            childSnapshot.val().origin == auth.origin ||
            childSnapshot.val().destination == auth.origin
          ) {
            data.push({
              key: childSnapshot.key,
              ...childSnapshot.val(),
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
      <NavMenu />
      <Container>
        <h2>Dashboard</h2>
        <hr />
        <Row>
          <CategoryCards
            data={showList}
            windowSize={windowSize}
            state={state}
            handler={handleFilter}
          />
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
                  onChange={() => handleCabang(event, state, setState)}
                  value={state.origin}
                >
                  <option value="All Cabang">All Cabang</option>
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
                  onChange={() => handleCabang(event, state, setState)}
                  value={state.destination}
                >
                  <option value="All Cabang">All Cabang</option>
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
        <Row>
          <DocListTable data={showList} windowSize={windowSize} />
        </Row>
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
                <option value="150">150</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
