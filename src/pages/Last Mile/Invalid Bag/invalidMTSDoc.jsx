/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import {
  Button,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import NavMenu from "../../../components/partials/navbarMenu";
import { useParams } from "react-router-dom";
import { UseAuth } from "../../../config/authContext";
import { useEffect, useRef, useState } from "react";
import firebase from "./../../../config/firebase";
import MTSDocumentInfo from "./partials/mtsDocInfo";
import moment from "moment";
import MTSBagTable from "./partials/mtsBagTable";

export default function InvalidMTSDoc() {
  const { key } = useParams();
  const auth = UseAuth();
  const database = firebase.database();
  const inputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [document, setDocument] = useState([]);
  const [awbList, setAWBList] = useState([]);

  const [state, setState] = useState({
    searched: "",
  });

  const handleMTI = async (e) => {
    e.preventDefault();
    try {
      const found = awbList.find((awb) => awb.awb === state.searched);

      if (!found) {
        alert("AWB tidak ditemukan");
        return;
      } else if (found.mtiDate !== undefined) {
        alert("AWB sudah melewati proses MTI");
        return;
      }

      await Promise.all([
        database
          .ref("mts/awb")
          .child(found.key)
          .update({
            mtiDate: moment().local("fr-ca").format("L LT"),
          }),
        database
          .ref("mts/document")
          .child(document.key)
          .update({
            mtiUser: auth.name,
            mtiDate:
              document.mtiDate !== undefined
                ? document.mtiDate
                : moment().local("fr-ca").format("L LT"),
          }),
        alert("Proses MTI berhasil"),
        setState({
          ...state,
          searched: "",
        }),
      ]);
    } catch (error) {
      alert("Gagal");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value.toUpperCase(),
    });
  };

  useEffect(() => {
    setLoading(true);
    database
      .ref("mts/document")
      .child(key)
      .on("value", (snapshot) => {
        if (snapshot.exists()) {
          setDocument({
            key: snapshot.key,
            ...snapshot.val(),
          });
          database
            .ref("mts/awb")
            .orderByChild("mts_doc")
            .equalTo(key)
            .on("value", (snapshot) => {
              if (snapshot.exists()) {
                let awb = [];
                snapshot.forEach((childSnapshot) => {
                  awb.push({
                    key: childSnapshot.key,
                    ...childSnapshot.val(),
                  });
                });
                setAWBList(awb);
                setLoading(false);
              }
            });
        } else {
          setDocument([]);
          setLoading(false);
        }
      });
  }, [auth.name]);

  return (
    <div className="screen">
      <NavMenu />
      <Container>
        <h2>
          {loading ? <Spinner animation="grow" size="sm" /> : document.mtsNo}
        </h2>
        <div>
          <hr />
          <MTSDocumentInfo data={document} />
          <div>
            <form onSubmit={handleMTI}>
              <InputGroup className="mb-3">
                <FloatingLabel controlId="floatingInput" label="AWB">
                  <Form.Control
                    type="text"
                    placeholder="AWB"
                    name="searched"
                    value={state.searched}
                    ref={inputRef}
                    onChange={(event) => handleChange(event)}
                  />
                </FloatingLabel>
                <Button variant="outline-dark" onClick={handleMTI}>
                  MTI
                </Button>
              </InputGroup>
            </form>
          </div>
          <hr />
          <MTSBagTable loading={loading} awbList={awbList} />
        </div>
      </Container>
    </div>
  );
}
