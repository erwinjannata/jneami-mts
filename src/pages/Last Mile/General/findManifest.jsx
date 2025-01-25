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
import { useEffect, useState } from "react";
import { UseAuth } from "../../../config/authContext";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import firebase from "../../../config/firebase";
import "moment/locale/en-ca";
import "moment/locale/id";
import NavMenu from "../../../components/partials/navbarMenu";
import { handleChange } from "../../../components/functions/functions";
import BagListTable from "../../../components/partials/bagListTable";

export default function FindManifestNumber() {
  const auth = UseAuth();
  let db = firebase.database().ref("manifestTransit");

  const d = new Date();
  const [state, setState] = useState({
    number: "",
    loading: false,
    show: false,
    date: moment(d).locale("en-ca").format("L"),
  });

  const [dataList, setDataList] = useState([]);

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
                ...childSnapshot.val(),
                ...items.val(),
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
                  onChange={() =>
                    handleChange({
                      e: event,
                      state: state,
                      stateSetter: setState,
                    })
                  }
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
            <BagListTable bagList={dataList} />
          </Row>
        ) : null}
      </Container>
    </div>
  );
}
