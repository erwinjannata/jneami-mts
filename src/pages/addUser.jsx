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
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setCreds({
      ...creds,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e, name, email, password, origin) => {
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
              permissionLevel: 1,
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
    { id: "0", name: "MATARAM" },
    { id: "1", name: "LOMBOK BARAT" },
    { id: "2", name: "LOMBOK TIMUR" },
    { id: "3", name: "PRAYA" },
    { id: "4", name: "TANJUNG" },
    { id: "5", name: "BIMA" },
    { id: "6", name: "DOMPU" },
    { id: "7", name: "MANGGELEWA" },
    { id: "8", name: "SUMBAWA" },
    { id: "9", name: "UTAN" },
    { id: "10", name: "ALAS" },
    { id: "11", name: "TALIWANG" },
  ];

  useEffect(() => {
    if (auth.level < 5) {
      navigate("/");
    }
  }, [auth.level, navigate]);

  return (
    <>
      <Menu />
      <Container className="mt-4">
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
        </Form>
        <Button
          variant="primary"
          onClick={(e) =>
            handleSubmit(
              e,
              creds.name,
              creds.email,
              creds.password,
              creds.origin
            )
          }
        >
          Add User
        </Button>
      </Container>
    </>
  );
}
