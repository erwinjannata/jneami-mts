import { useState } from "react";
import NavMenu from "../../../components/partials/navbarMenu";
import {
  Button,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import { handleChange } from "../../../components/functions/functions";
import moment from "moment";
import NotFound from "../../../components/partials/notFound";
import LoadingAnimation from "../../../components/partials/loading";
import firebase from "@/config/firebase";
import { useNavigate } from "react-router-dom";

function FindInvalidMTS() {
  const database = firebase.database().ref();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [awbList, setAWBList] = useState([]);

  const [state, setState] = useState({
    searched: "",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!state.searched) {
      alert("AWB Kosong");
      return;
    }

    setLoading(true);

    database
      .child("mts/awb")
      .orderByChild("awb")
      .equalTo(state.searched.toUpperCase())
      .on("value", (snapshot) => {
        let awb = [];
        snapshot.forEach((childSnapshot) => {
          awb.push({
            key: childSnapshot.key,
            ...childSnapshot.val(),
          });
        });
        setAWBList(awb);
      });
    setLoading(false);
  };

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>Cari</h2>
        <div>
          <hr />
          <div>
            <form onSubmit={handleSearch}>
              <InputGroup className="mb-3">
                <FloatingLabel controlId="floatingInput" label="AWB">
                  <Form.Control
                    type="text"
                    placeholder="AWB"
                    name="searched"
                    value={state.searched}
                    onChange={() =>
                      handleChange({
                        e: event,
                        state: state,
                        stateSetter: setState,
                      })
                    }
                  />
                </FloatingLabel>
                <Button variant="outline-dark" onClick={handleSearch}>
                  Cari
                </Button>
              </InputGroup>
            </form>
            <hr />
            <div>
              {loading ? (
                <LoadingAnimation />
              ) : (
                <div>
                  {awbList.length == 0 ? (
                    <NotFound />
                  ) : (
                    <div>
                      <Table responsive hover id="tableData">
                        <thead id="stickyHead">
                          <tr>
                            <th className="w-25">AWB</th>
                            <th className="w-25">Quantity</th>
                            <th className="w-50">MTS Date</th>
                            <th className="w-50">MTI Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {awbList.map((item, id) => {
                            return (
                              <tr
                                key={id}
                                onClick={() =>
                                  navigate(`/mts/d/${item.mts_doc}`)
                                }
                              >
                                <td>{item.awb}</td>
                                <td>{item.quantity}</td>
                                <td>
                                  {moment(Date.parse(item.mtsDate))
                                    .locale("en-sg")
                                    .format("LLL")}
                                </td>
                                <td>
                                  {item.mtiDate
                                    ? `${moment(Date.parse(item.mtiDate))
                                        .locale("en-sg")
                                        .format("LLL")}`
                                    : "-"}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default FindInvalidMTS;
