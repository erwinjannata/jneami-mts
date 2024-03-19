/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
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

export default function Home() {
  let db = firebase.database().ref("manifestTransit/");
  let navigate = new useNavigate();
  const [dataList, setDataList] = useState([]);
  const [showList, setShowList] = useState([]);
  const [state, setState] = useState({
    number: "",
    showed: "origin",
    limit: "10",
  });
  const auth = UseAuth();

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
    db.orderByChild(`${state.showed}/`)
      .equalTo(auth.origin)
      .limitToLast(parseInt(state.limit))
      .on("value", (snapshot) => {
        let data = [];

        snapshot.forEach((childSnapshot) => {
          data.push({
            key: childSnapshot.key,
            noSurat: childSnapshot.val().noSurat,
            origin: childSnapshot.val().origin,
            destination: childSnapshot.val().destination,
            approvedDate: childSnapshot.val().approvedDate,
            approvedTime: childSnapshot.val().approvedTime,
            receivedDate: childSnapshot.val().receivedDate,
            receivedTime: childSnapshot.val().receivedTime,
            status: childSnapshot.val().status,
            sumPcs: childSnapshot.val().sumPcs,
            sumWeight: childSnapshot.val().sumWeight,
          });
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
                  tag: "notification",
                  renotify: true,
                  body: `${
                    snapshot.val().noSurat
                  } dalam perjalanan menuju JNE ${snapshot.val().destination}`,
                });
              } else if (
                auth.origin == snapshot.val().origin &&
                snapshot.val().status == "Sampai Tujuan"
              ) {
                const notif = new Notification(`Manifest Transit Sub Agen`, {
                  tag: "notification",
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
  }, [auth.origin, auth.name, state.showed, state.limit, Notification]);

  return (
    <>
      <Menu />
      <Container>
        <Row className="mt-4">
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
                <th>Approved at</th>
                <th>Received at</th>
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
                          {`${moment(item.approvedDate)
                            .locale("id")
                            .format("LL")} ${item.approvedTime}`}
                        </td>
                        <td>
                          {item.receivedDate != ""
                            ? `${moment(item.receivedDate)
                                .locale("id")
                                .format("LL")} ${item.receivedTime}`
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
    </>
  );
}
