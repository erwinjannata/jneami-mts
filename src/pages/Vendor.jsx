/* eslint-disable react-hooks/exhaustive-deps */
import {
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import NavMenu from "../components/menu";
import { useEffect, useState } from "react";
import firebase from "./../config/firebase";
import { UseAuth } from "../config/authContext";
import { useNavigate } from "react-router-dom";

export default function Vendor() {
  const auth = UseAuth();
  const [state, setState] = useState({
    limit: 10,
  });
  const [data, setData] = useState([]);
  let db = firebase.database().ref("manifestTransit/");
  let navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    setState({ ...state, [e.target.name]: value });
  };

  useEffect(() => {
    db.limitToLast(parseInt(state.limit)).on("value", (snapshot) => {
      let list = [];
      snapshot.forEach((childSnapshot) => {
        list.push({
          key: childSnapshot.key,
          noSurat: childSnapshot.val().noSurat,
          origin: childSnapshot.val().origin,
          destination: childSnapshot.val().destination,
          sumPcs: childSnapshot.val().sumPcs,
          sumWeight: childSnapshot.val().sumWeight,
          status: childSnapshot.val().status,
        });
      });
      setData(list.reverse());
    });
  }, [auth.origin, auth.name, auth.level, state.limit]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Daftar Manifest JNE AMI</h2>
        <hr />
        <Table responsive hover>
          <thead>
            <tr>
              <th>No. Surat</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Pcs (Koli)</th>
              <th>Weight</th>
              <th>Status Manifest</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} onClick={() => navigate(`/doc/${item.key}`)}>
                <td>{item.noSurat}</td>
                <td>{item.origin}</td>
                <td>{item.destination}</td>
                <td>{item.sumPcs}</td>
                <td>{item.sumWeight}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <hr />
        <Row>
          <Col xl={1} xs={4}>
            <FloatingLabel controlId="floatingSelectShow" label="Show">
              <Form.Select
                aria-label="Show"
                name="limit"
                onChange={handleChange}
                value={state.limit}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="500">500</option>
              </Form.Select>
            </FloatingLabel>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
