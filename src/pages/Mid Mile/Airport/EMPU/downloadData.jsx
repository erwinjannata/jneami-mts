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
import { fetchCustomerData, handleExcel } from "./partials/functions";
import { handleChange } from "../../../../components/functions/functions";
import NavMenu from "../../../../components/partials/navbarMenu";
import DatePicker from "react-datepicker";
import moment from "moment";
import firebase from "../../../../config/firebase";
import DataTransactionTable from "./partials/dataTable";

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
    const dbRef = firebase
      .database()
      .ref(`empu/${state.data}`)
      .orderByChild("dateAdded")
      .startAt(`${state.dateFrom} 00:00`)
      .endAt(`${state.dateThru} 23:59`);

    dbRef.on("value", (snapshot) => {
      let data = [];
      if (state.customer === "") {
        snapshot.forEach((childSnapshot) => {
          data.push({
            key: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
      } else {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().customerId === state.customer) {
            data.push({
              key: childSnapshot.key,
              ...childSnapshot.val(),
            });
          }
        });
      }
      setDataList(data);
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
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Download Data</h2>
        <hr />
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
            onClick={() => handleExcel({ dataList: dataList })}
          >
            Download
          </Button>
        )}
        <hr />
        {show ? <DataTransactionTable awbList={dataList} /> : null}
      </Container>
    </div>
  );
};

export default EMPUDownloadData;
