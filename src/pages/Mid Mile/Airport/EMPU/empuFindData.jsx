import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { useState } from "react";
import { handleChange } from "../../../../components/functions/functions";
import NavMenu from "../../../../components/partials/navbarMenu";
import DataTransactionTable from "./partials/dataTable";
import firebase from "./../../../../config/firebase";

const EMPUFindData = () => {
  const [state, setState] = useState({
    awb: "",
  });
  const [awbList, setAwbList] = useState([]);

  const fetchData = () => {
    const dbRef = firebase.database().ref("empu/transactions");

    dbRef
      .orderByChild("awb")
      .equalTo(state.awb)
      .on("value", (snapshot) => {
        let data = [];
        if (snapshot.exists) {
          snapshot.forEach((childSnapshot) => {
            data.push({
              key: childSnapshot.key,
              ...childSnapshot.val(),
            });
            setAwbList(data);
          });
        }
      });
  };

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Find Transaction</h2>
        <hr />
        <FloatingLabel label="AWB" className="mb-3">
          <Form.Control
            type="text"
            name="awb"
            value={state.awb}
            placeholder="AWB"
            onChange={() =>
              handleChange({ e: event, state: state, stateSetter: setState })
            }
          />
        </FloatingLabel>
        <Button variant="outline-primary" onClick={() => fetchData()}>
          Find
        </Button>
        <hr />
        <DataTransactionTable awbList={awbList} />
      </Container>
    </div>
  );
};

export default EMPUFindData;
