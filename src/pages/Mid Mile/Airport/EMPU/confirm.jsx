/* eslint-disable no-unused-vars */
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { months } from "../../../../components/data/months";
import { useEffect, useState } from "react";
import { handleChange } from "../../../../components/functions/functions";
import NavMenu from "../../../../components/partials/navbarMenu";
import firebase from "./../../../../config/firebase";
import CreditTable from "./partials/creditTable";

const EMPUConfirm = () => {
  const [state, setState] = useState({
    periode: "",
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);

    // Initialize Database Reference
    const dbRef = firebase.database().ref("empu/inbound");

    await dbRef
      .orderByChild("dateAdded")
      .startAt(`2025-${state.periode}-01 00:00`)
      .endAt(`2025-${state.periode}-31 23:59`)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          let data = [];
          snapshot.forEach((childSnapshot) => {
            if (
              childSnapshot.val().paymentMethod === "CREDIT" &&
              childSnapshot.val().paymentStatus === "UNPAID"
            ) {
              data.push({
                key: childSnapshot.key,
                ...childSnapshot.val(),
              });
            }
          });
          setData(data);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    // Initialize Database Reference
    const dbRefCustomers = firebase.database().ref("empu/customers");

    dbRefCustomers
      .orderByChild("customerType")
      .equalTo("Agen")
      .on("value", (snapshot) => {
        let data = [];
        snapshot.forEach((childSnapshot) => {
          data.push({
            key: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setCustomerList(data);
      });
  }, []);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Konfirmasi Pembayaran Credit</h2>
        <hr />
        <FloatingLabel label="Periode">
          <Form.Select
            name="periode"
            className="mb-2"
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
          >
            <option>- Bulan -</option>
            {months.map((month, index) => (
              <option key={index} value={month.number}>
                {month.name}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>
        <Button
          variant="primary"
          className="mt-2 me-2"
          onClick={() => handleSubmit()}
        >
          Submit
        </Button>
        <hr />
        <CreditTable
          awbList={data}
          loading={loading}
          customerList={customerList}
        />
      </Container>
    </div>
  );
};

export default EMPUConfirm;
