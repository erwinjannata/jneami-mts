/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import firebase from "./../../config/firebase";
import NavMenu from "../../components/partials/navbarMenu";
import { handleChange } from "../../components/functions/functions";
import { months } from "../../components/data/months";
import CreditTable from "./partials/creditTable";

const EMPUConfirm = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [state, setState] = useState({
    bulan: currentMonth < 10 ? `0${currentMonth}` : currentMonth,
    tahun: currentYear,
    show: false,
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);

  const handleSubmit = () => {
    setLoading(true);

    // Initialize Database Reference
    const database = firebase.database().ref();

    database
      .child("empu/inbound")
      .orderByChild("dateAdded")
      .startAt(`${state.tahun}-${state.bulan}-01 00:00`)
      .endAt(`${state.tahun}-${state.bulan}-31 23:59`)
      .on("value", (snapshot) => {
        setData([]);
        snapshot.forEach((childSnapshot) => {
          if (
            childSnapshot.val().paymentMethod === "CREDIT" &&
            childSnapshot.val().paymentStatus === "UNPAID"
          ) {
            setData((prev) => [
              ...prev,
              {
                key: childSnapshot.key,
                ...childSnapshot.val(),
              },
            ]);
          }
        });
        setLoading(false);
        setState({ ...state, show: true });
      });
  };

  useEffect(() => {
    // Initialize Database Reference
    const database = firebase.database().ref();

    database.child("empu/customers").on("value", (snapshot) => {
      setCustomerList([]);
      snapshot.forEach((childSnapshot) => {
        setCustomerList((prev) => [
          ...prev,
          {
            key: childSnapshot.key,
            ...childSnapshot.val(),
          },
        ]);
      });
    });
  }, []);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2 className="fw-bold">Konfirmasi Pembayaran Credit</h2>
        <hr />
        <Row>
          <Col sm>
            <FloatingLabel label="Bulan">
              <Form.Select
                name="bulan"
                value={state.bulan}
                className="mb-2"
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
              >
                {months.map((month, index) => (
                  <option key={index} value={month.number}>
                    {month.name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col sm>
            <FloatingLabel label="Tahun">
              <Form.Select
                name="tahun"
                value={state.tahun}
                className="mb-2"
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
              >
                {Array.from({ length: 5 }, (_, i) => currentYear + i).map(
                  (year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  )
                )}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Button variant="primary" onClick={() => handleSubmit()}>
          Submit
        </Button>
        <hr />
        {state.show ? (
          <CreditTable
            awbList={data}
            loading={loading}
            customerList={customerList}
          />
        ) : null}
      </Container>
    </div>
  );
};

export default EMPUConfirm;
