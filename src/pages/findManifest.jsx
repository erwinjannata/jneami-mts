/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { UseAuth } from "../config/authContext";
import Menu from "../components/menu";
import firebase from "./../config/firebase";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
  Table,
} from "react-bootstrap";

export default function FindManifestNumber() {
  const auth = UseAuth();
  let db = firebase
    .database()
    .ref("manifestTransit")
    .orderByChild("bagList/manifestsNo");

  const [state, setState] = useState({
    number: "",
    loading: false,
  });

  const [dataList, setDataList] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const handleSubmit = () => {
    db.limitToLast(4000).on("value", (snapshot) => {
      let data = [];

      snapshot.forEach((childSnapshot) => {
        childSnapshot.val().bagList.forEach((item) => {
          if (item.manifestNo == state.number) {
            data.push({ bags: childSnapshot.val().bagList });
          }
        });
      });
      setDataList(data);
    });
    console.log(dataList);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [auth.origin]);

  return (
    <div className="screen">
      <Menu />
      <Container>
        <h2>Cari No. Manifest</h2>
        <hr />
        <Row className="mt-2">
          <Col>
            <Form>
              <FloatingLabel
                controlId="floatingInputNo"
                label="No. Manifest"
                className="mb-3"
              >
                <Form.Control
                  type="text"
                  name="number"
                  value={state.number}
                  placeholder="Cari no. surat"
                  onChange={handleChange}
                />
              </FloatingLabel>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={state.loading}
            >
              {state.loading ? "Loading..." : "Go"}
            </Button>
          </Col>
        </Row>
        <hr />
        {/* <Row>
          <div className="tableData">
            <Table responsive hover striped>
              <thead>
                <tr>
                  <th>No. Manifest</th>
                  <th>No. Surat</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Status Bag</th>
                </tr>
              </thead>
              <tbody>
                {dataList.length == 0 ? (
                  <>
                    <tr>
                      <td colSpan={12} align="center">
                        <i>Data tidak ditemukan</i>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    {dataList.map((item, key) => (
                      <tr key={key}>
                        <td>{item.noSurat}</td>
                        <td>{item.noSurat}</td>
                        <td>{item.origin}</td>
                        <td>{item.destination}</td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </Table>
          </div>
        </Row> */}
      </Container>
    </div>
  );
}
