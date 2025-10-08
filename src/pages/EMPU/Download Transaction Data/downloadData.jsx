import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import DatePicker from "react-datepicker";
import moment from "moment";
import firebase from "@/config/firebase";
import { fetchCustomerData, handleExcel } from "@pages/EMPU/partials/functions";
import { handleChange } from "@/components/functions/functions";
import DataTransactionTable from "@pages/EMPU/partials/dataTable";

const EMPUDownloadData = () => {
  const d = new Date();
  const [state, setState] = useState({
    data: "inbound",
    customer: "",
    dateFrom: moment(d).locale("en-ca").format("L"),
    dateThru: moment(d).locale("en-ca").format("L"),
  });
  const [dataList, setDataList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    // Initialize Database Reference
    const database = firebase.database().ref();

    database
      .child(`empu/${state.data}`)
      .orderByChild("dateAdded")
      .startAt(`${state.dateFrom} 00:00`)
      .endAt(`${state.dateThru} 23:59`)
      .on("value", (snapshot) => {
        setDataList([]);
        if (state.customer === "") {
          snapshot.forEach((childSnapshot) => {
            setDataList((prev) => [
              ...prev,
              {
                key: childSnapshot.key,
                ...childSnapshot.val(),
              },
            ]);
          });
        } else {
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().customerId === state.customer) {
              setDataList((prev) => [
                ...prev,
                {
                  key: childSnapshot.key,
                  ...childSnapshot.val(),
                },
              ]);
            }
          });
        }
        setLoading(false);
        setShow(true);
      });
  };

  useEffect(() => {
    fetchCustomerData({
      setCustomerList: setCustomerList,
      setLoading: setLoading,
    });
  }, []);

  return (
    <Container>
      <h2 className="fw-bold">Download Data</h2>
      <hr />
      <div className="rounded border p-4">
        <Row className="mb-3">
          <Col>
            <FloatingLabel label="Data">
              <Form.Select
                name="data"
                value={state.data}
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
              >
                <option value="inbound">Inbound</option>
                <option value="outbound">Outbound</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel label="Customer">
              <Form.Select
                name="customer"
                value={state.customer}
                onChange={() =>
                  handleChange({
                    e: event,
                    state: state,
                    stateSetter: setState,
                  })
                }
              >
                <option value="">All Customer</option>
                {customerList.map((customer, index) => (
                  <option key={index} value={customer.key}>
                    {customer.customerName}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <label className="mx-2">
              <strong>{`Dari :`}</strong>
            </label>
            <DatePicker
              portalId="root-portal"
              title="Start Date"
              placeholder="Start Date"
              className="form-control form-control-solid"
              selected={state.dateFrom}
              onChange={(date) =>
                setState({
                  ...state,
                  dateFrom: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
          <Col>
            <label className="mx-2">
              <strong>{`Hingga :`}</strong>
            </label>
            <DatePicker
              portalId="root-portal"
              title="End Date"
              placeholder="End Date"
              className="form-control form-control-solid"
              selected={state.dateThru}
              onChange={(date) =>
                setState({
                  ...state,
                  dateThru: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
        </Row>
        <Button className="me-2" onClick={() => fetchData()}>
          Submit
        </Button>
        {dataList.length === 0 ? null : (
          <Button
            className="me-2"
            variant="success"
            onClick={() =>
              handleExcel({ dataList: dataList, customerList: customerList })
            }
          >
            Download
          </Button>
        )}
        <hr />
        {show ? (
          <DataTransactionTable
            awbList={dataList}
            loading={loading}
            customerList={customerList}
          />
        ) : null}
      </div>
    </Container>
  );
};

export default EMPUDownloadData;
