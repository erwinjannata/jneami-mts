import {
  Button,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useState } from "react";
import { handleChange } from "../../../../components/functions/functions";
import NavMenu from "../../../../components/partials/navbarMenu";
import DataTransactionTable from "./partials/dataTable";
import firebase from "../../../../config/firebase";

const EMPUFindData = () => {
  const [state, setState] = useState({
    awb: "",
    data: "empu/inbound",
  });
  const [awbList, setAwbList] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (state.awb === "") {
      alert("AWB kosong");
    } else {
      const dbRef = firebase.database().ref(state.data);

      setLoading(true);
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
            });
          }
          setAwbList(data);
          setLoading(false);
          setShow(true);
        });
    }
  };

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Find Transaction</h2>
        <hr />
        <InputGroup className="mb-3">
          <Form.Floating>
            <Form.Control
              type="text"
              name="awb"
              value={state.awb}
              placeholder="AWB"
              disabled={loading}
              onChange={() =>
                handleChange({ e: event, state: state, stateSetter: setState })
              }
            />
            <label>AWB</label>
          </Form.Floating>
          <FloatingLabel controlId="floatingSelectShow" label="Data">
            <Form.Select
              aria-label="Data"
              name="data"
              onChange={() =>
                handleChange({
                  e: event,
                  state: state,
                  stateSetter: setState,
                })
              }
              value={state.data}
              disabled={loading}
            >
              <option value="empu/inbound">Inbound</option>
              <option value="empu/outbound">Outbound</option>
            </Form.Select>
          </FloatingLabel>
        </InputGroup>
        <Button
          variant="outline-primary"
          disabled={loading}
          onClick={() => fetchData()}
        >
          Find
        </Button>
        <hr />
        {show ? <DataTransactionTable awbList={awbList} /> : null}
      </Container>
    </div>
  );
};

export default EMPUFindData;
