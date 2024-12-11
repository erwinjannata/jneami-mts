/* eslint-disable no-unused-vars */
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseAuth } from "../../config/authContext";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import firebase from "./../../config/firebase";
import "moment/locale/en-ca";
import "moment/locale/id";
import NavMenu from "../../components/partials/navbarMenu";

export default function FindManifestNumber() {
  const auth = UseAuth();
  let db = firebase.database().ref("manifestTransit/");
  let navigate = useNavigate();

  const d = new Date();
  const [state, setState] = useState({
    number: "",
    loading: false,
    show: false,
    date: moment(d).locale("en-ca").format("L"),
  });

  const [dataList, setDataList] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const handleSubmit = () => {
    setState({ ...state, loading: true });
    db.orderByChild("approvedDate")
      .limitToLast(1000)
      .equalTo(state.date)
      .on("value", (snapshot) => {
        var data = [];

        snapshot.forEach((childSnapshot) => {
          childSnapshot.child("bagList").forEach((items) => {
            let result = items.val().manifestNo.replace(/ /g, "");
            if (result.includes(state.number)) {
              data.push({
                key: childSnapshot.key,
                manifestNo: items.val().manifestNo,
                noSurat: childSnapshot.val().noSurat,
                origin: childSnapshot.val().origin,
                destination: childSnapshot.val().destination,
                status: childSnapshot.val().status,
              });
            }
          });
        });
        setDataList(data);
        setState({ ...state, show: true, loading: false });
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [auth.origin]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Cari No. Manifest</h2>
        <hr />
        <Row className="mt-2">
          <Col>
            <Form>
              <FloatingLabel
                controlId="floatingInputNo"
                label="No Manifest/Bag"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="number"
                  value={state.number}
                  placeholder={state.number}
                  onChange={handleChange}
                />
              </FloatingLabel>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <label htmlFor="date" className="mx-2">
              <strong>{`Tanggal Manifest:`}</strong>
            </label>
            <DatePicker
              title="Manifest Date"
              placeholder="Manifest Date"
              className="form-control form-control-solid"
              selected={state.date}
              onChange={(date) =>
                setState({
                  ...state,
                  date: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={state.loading}
              className="mt-2"
            >
              {state.loading ? "Loading..." : "Cari"}
            </Button>
          </Col>
        </Row>
        <hr />
        {state.show ? (
          <Row>
            <Table responsive hover borderless>
              <thead className="table-dark">
                <tr>
                  <th>No. Manifest</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>No. Surat</th>
                  <th>Status Surat Manifest</th>
                </tr>
              </thead>
              <tbody>
                {dataList.length == 0 ? (
                  <>
                    <tr>
                      <td colSpan={12} align="center">
                        <i>Data tidak ditemukan</i>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {dataList.map((item, key) => (
                      <tr
                        key={key}
                        onClick={() => navigate(`/doc/${item.key}`)}
                      >
                        <td>{item.manifestNo}</td>
                        <td>{item.origin}</td>
                        <td>{item.destination}</td>
                        <td>{item.noSurat}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </Table>
          </Row>
        ) : null}
      </Container>
    </div>
  );
}
