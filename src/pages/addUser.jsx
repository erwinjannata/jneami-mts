/* eslint-disable no-unused-vars */
import { Button, Container, FloatingLabel, Form } from "react-bootstrap";
import Menu from "../components/menu";
import { useEffect, useState } from "react";
import firebase from "./../config/firebase";
import { UseAuth } from "../config/authContext";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const auth = UseAuth();
  let navigate = useNavigate();
  const [creds, setCreds] = useState({
    email: "",
    password: "",
    name: "",
    origin: "MATARAM",
    level: 1,
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setCreds({
      ...creds,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e, name, email, password, origin, level) => {
    if (name != "") {
      e.preventDefault();
      let db = firebase.database();
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (data) => {
          await db
            .ref(`users/${data.user.uid}`)
            .set({
              name: name,
              origin: origin,
              permissionLevel: level,
            })
            .then(() => {
              alert("Registered");
            });
          setCreds({
            ...creds,
            name: "",
            email: "",
            password: "",
            origin: "MATARAM",
            level: 1,
          });
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
          alert(error.message);
        });
    } else {
      alert("Nama tidak boleh kosong");
    }
  };

  let listCabang = [
    { id: "0", name: "ALAS" },
    { id: "1", name: "BIMA" },
    { id: "2", name: "BOLO" },
    { id: "3", name: "DOMPU" },
    { id: "4", name: "EMPANG" },
    { id: "5", name: "JEREWEH" },
    { id: "6", name: "GERUNG" },
    { id: "7", name: "SELONG" },
    { id: "8", name: "MANGGELEWA" },
    { id: "9", name: "MATARAM" },
    { id: "10", name: "PADOLO" },
    { id: "11", name: "PLAMPANG" },
    { id: "12", name: "PRAYA" },
    { id: "13", name: "SUMBAWA" },
    { id: "14", name: "TALIWANG" },
    { id: "15", name: "TANJUNG" },
    { id: "16", name: "UTAN" },
  ];

  useEffect(() => {
    if (auth.level < 5) {
      navigate("/");
    }
  }, [auth.level, navigate]);

  return (
    <div className="screen">
      <Menu />
      <Container>
        <h2>Add User</h2>
        <hr />
        <Form>
          <FloatingLabel controlId="floatingName" label="Nama" className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={creds.name}
              onChange={handleChange}
              required
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingEmail"
            label="Email"
            className="mb-3"
          >
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={creds.email}
              onChange={handleChange}
              required
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingPassword"
            label="Password"
            className="mb-3"
          >
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              autoComplete="off"
              value={creds.password}
              onChange={handleChange}
              required
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingCabang"
            label="Cabang / Agen"
            className="mb-3"
          >
            <Form.Select
              aria-label="Cabang / Agen"
              onChange={handleChange}
              name="origin"
              value={creds.origin}
            >
              {listCabang.map((item, id) => (
                <option key={id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingLevel"
            label="Permission Level"
            className="mb-3"
          >
            <Form.Select
              aria-label="Permission Level"
              onChange={handleChange}
              name="level"
              value={creds.level}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Form.Select>
          </FloatingLabel>
        </Form>
        <Button
          variant="primary"
          onClick={(e) =>
            handleSubmit(
              e,
              creds.name,
              creds.email,
              creds.password,
              creds.origin,
              creds.level
            )
          }
        >
          Add User
        </Button>
      </Container>
    </div>
  );
}
