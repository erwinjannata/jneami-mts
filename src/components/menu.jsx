/* eslint-disable no-unused-vars */
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "./../images/jne_brand.png";
import "./../index.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UseAuth } from "./../config/authContext";
import { Button, Form } from "react-bootstrap";
import { LuLogOut } from "react-icons/lu";

export default function Menu() {
  let menu = [
    { id: "0", nama: "Dashboard", link: "/", req: 1 },
    { id: "1", nama: "Manifest Transit", link: "/create", req: 1 },
    { id: "2", nama: "Download Data", link: "/get", req: 1 },
    { id: "3", nama: "Damage Report", link: "/damage", req: 4 },
    { id: "4", nama: "New User", link: "/add", req: 5 },
  ];

  const auth = UseAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
      <Container fluid>
        <Navbar.Brand>
          <Link to="/">
            <img
              src={logo}
              alt="JNE"
              className="logo"
              style={{ height: "50px" }}
            ></img>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse className="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            {menu.map((m) => (
              <Nav key={m.id}>
                {auth.level >= m.req ? (
                  <Navbar.Text>
                    <NavLink
                      to={m.link}
                      style={({ isActive }) => ({
                        color: isActive ? "blue" : "black",
                      })}
                    >
                      {m.nama}
                    </NavLink>
                  </Navbar.Text>
                ) : null}
              </Nav>
            ))}
          </Nav>
          <hr />
          <Form className="d-flex">
            <Navbar.Text>{`${auth.name} | JNE ${auth.origin}`}</Navbar.Text>
            <Button variant="outline-danger" onClick={handleLogout}>
              <LuLogOut />
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
