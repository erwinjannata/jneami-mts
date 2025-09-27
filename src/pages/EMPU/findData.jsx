import {
  Button,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useState } from "react";
import firebase from "../../config/firebase";
import { fetchCustomerData } from "./partials/functions";
import NavMenu from "../../components/partials/navbarMenu";
import { handleChange } from "../../components/functions/functions";
import DataTransactionTable from "./partials/dataTable";

const EMPUFindData = () => {
  const [state, setState] = useState({
    awb: "",
    data: "empu/inbound",
  });
  const [awbList, setAwbList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    fetchCustomerData({
      setCustomerList: setCustomerList,
      setLoading: setLoading,
    });
    if (state.awb === "") {
      alert("AWB kosong");
    } else {
      // Initialize Database Reference
      const database = firebase.database().ref();

      setLoading(true);
      database
        .child(state.data)
        .orderByChild("awb")
        .equalTo(state.awb)
        .on("value", (snapshot) => {
          setAwbList([]);
          snapshot.forEach((childSnapshot) => {
            setAwbList((prev) => [
              ...prev,
              {
                key: childSnapshot.key,
                ...childSnapshot.val(),
              },
            ]);
          });
          setLoading(false);
          setShow(true);
        });
    }
  };

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2 className="fw-bold">Find Transaction</h2>
        <hr />
        <div className="rounded border p-4">
          <InputGroup className="mb-3">
            <Form.Floating>
              <Form.Control
                type="text"
                name="awb"
                value={state.awb}
                placeholder="AWB"
                disabled={loading}
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
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
          {show ? (
            <DataTransactionTable
              awbList={awbList}
              loading={loading}
              customerList={customerList}
            />
          ) : null}
        </div>
      </Container>
    </div>
  );
};

export default EMPUFindData;
