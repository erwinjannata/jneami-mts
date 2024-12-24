/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./../../index.css";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useState } from "react";
import { handleChange } from "../../components/functions/functions";
import { cabangList } from "../../components/data/branchList";
import { CircularProgress } from "@mui/material";
import firebase from "./../../config/firebase";
import NavMenu from "../../components/partials/navbarMenu";
import BagListTable from "../../components/partials/bagListTable";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function UnreceivedPage() {
  const d = new Date();
  const dbRef = firebase.database().ref("manifestTransit");

  const [isLoading, setisLoading] = useState(false);
  const [state, setState] = useState({
    start: moment(d).locale("en-ca").format("L"),
    end: moment(d).locale("en-ca").format("L"),
    query: "approvedDate",
    showTable: false,
    origin: "",
    destination: "",
  });
  const [data, setData] = useState([]);
  const [bagList, setBagList] = useState([]);

  const branchSelection = [
    {
      label: "Origin",
      ariaLabel: "Origin",
      name: "origin",
      value: state.origin,
    },
    {
      label: "Destination",
      ariaLabel: "Destination",
      name: "destination",
      value: state.destination,
    },
  ];

  const handleFetch = (e) => {
    e.preventDefault();
    setisLoading(true);
    dbRef
      .limitToLast(500)
      .orderByChild("receivedDate")
      .startAt(state.start)
      .endAt(state.end)
      .on("value", (snapshot) => {
        let data = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            if (childSnapshot.val().status == "Received*") {
              data.push({
                key: childSnapshot.key,
                ...childSnapshot.val(),
              });
            }
          });
          let result = data;
          if (state.origin == "" && state.destination != "") {
            result = data.filter((datalist) => {
              return datalist["destination"] == state.destination;
            });
          } else if (state.origin != "" && state.destination == "") {
            result = data.filter((datalist) => {
              return datalist["origin"] == state.origin;
            });
          } else if (state.origin != "" && state.destination != "") {
            result = data.filter((datalist) => {
              return (
                datalist["origin"] == state.origin &&
                datalist["destination"] == state.destination
              );
            });
          }
          setData(result);

          let processedData = [];
          data.map((row, idx) => {
            for (let i = 0; i < data[idx].bagList.length; i++) {
              if (data[idx].bagList[i].statusBag == "Unreceived") {
                const { bagList, ...rest } = row;
                processedData.push({
                  noManifest: data[idx].bagList[i].manifestNo,
                  koli:
                    data[idx].bagList[i].koli == undefined
                      ? "-"
                      : parseFloat(data[idx].bagList[i].koli),
                  pcs: parseFloat(data[idx].bagList[i].pcs),
                  kg: parseFloat(data[idx].bagList[i].kg),
                  remark: data[idx].bagList[i].remark,
                  statusBag: data[idx].bagList[i].statusBag,
                  ...rest,
                });
              }
            }
          });
          setBagList(processedData);
        } else {
          setData([]);
        }
        setState({
          ...state,
          showTable: true,
        });
        setisLoading(false);
      });
  };

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Unreceived</h2>
        <hr />
        <Row className="my-4">
          {branchSelection.map((selection, index) => (
            <Col key={index}>
              <FloatingLabel
                controlId="floatingSelectData"
                label={selection.label}
              >
                <Form.Select
                  aria-label={selection.ariaLabel}
                  name={selection.name}
                  onChange={() => handleChange(event, state, setState)}
                  value={selection.value}
                >
                  <option value="">All Cabang</option>
                  {cabangList.map((item, id) => (
                    <option key={id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </Col>
          ))}
        </Row>
        <Row>
          <Col>
            <label htmlFor="startDate" className="mx-2">
              <strong>{`Dari :`}</strong>
            </label>
            <DatePicker
              portalId="root-portal"
              title="Start Date"
              placeholder="Start Date"
              className="form-control form-control-solid"
              selected={state.start}
              onChange={(date) =>
                setState({
                  ...state,
                  start: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
          <Col>
            <label htmlFor="endDate" className="mx-2">
              <strong>{`Hingga :`}</strong>
            </label>
            <DatePicker
              portalId="root-portal"
              id="endDate"
              title="End Date"
              placeholder="End Date"
              className="form-control form-control-solid"
              selected={state.end}
              onChange={(date) =>
                setState({
                  ...state,
                  end: moment(date).locale("en-ca").format("L"),
                })
              }
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" className="mt-4" onClick={handleFetch}>
              Go
            </Button>
          </Col>
        </Row>
        <hr />
        {isLoading ? (
          <Spinner animation="grow" size="sm" />
        ) : (
          <Row>
            {state.showTable ? (
              <BagListTable data={data} bagList={bagList} />
            ) : null}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default UnreceivedPage;
