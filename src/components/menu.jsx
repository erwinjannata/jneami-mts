/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "./../images/jne_brand.png";
import logoWhite from "./../images/jne_brand_white.png";
import "./../index.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { UseAuth } from "./../config/authContext";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { MdHomeFilled } from "react-icons/md";
import { HiDocumentPlus } from "react-icons/hi2";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { CgDanger } from "react-icons/cg";
import { RiUserAddFill } from "react-icons/ri";
import { LuLogOut } from "react-icons/lu";
import { MenuItem, Sidebar, Menu } from "react-pro-sidebar";
import { useEffect, useState } from "react";

export default function NavMenu() {
  let menu = [
    {
      id: "0",
      nama: "Dashboard",
      link: "/",
      req: 1,
      icon: <MdHomeFilled size={20} />,
    },
    {
      id: "1",
      nama: "Manifest Transit",
      link: "/create",
      req: 1,
      icon: <HiDocumentPlus size={20} />,
    },
    {
      id: "2",
      nama: "Damage Report",
      link: "/damage/new",
      req: 5,
      icon: <CgDanger size={20} />,
    },
    {
      id: "3",
      nama: "Penarikan Data",
      link: "/get",
      req: 2,
      icon: <HiDocumentArrowDown size={20} />,
    },
    {
      id: "4",
      nama: "New User",
      link: "/add",
      req: 5,
      icon: <RiUserAddFill size={20} />,
    },
  ];

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const auth = UseAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [broken, setBroken] = useState(
    window.matchMedia("(max-width: 800px)").matches
  );

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        ...windowSize,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowSize.height, windowSize.width]);

  return (
    <>
      {windowSize.width > "1024" ? (
        <div
          style={{
            display: "flex",
            height: "100%",
            minHeight: windowSize.height,
            position: "sticky",
            top: 0,
          }}
        >
          <Sidebar
            collapsed={collapsed}
            transitionDuration={500}
            width="250px"
            customBreakPoint="1024px"
            onBreakPoint={setBroken}
            backgroundColor="#212529"
          >
            <Menu
              menuItemStyles={{
                button: ({ level }) => {
                  if (level === 0) {
                    return {
                      "&:hover": {
                        backgroundColor: "#31363F !important",
                        color: "white !important",
                        fontWeight: "bold !important",
                      },
                    };
                  }
                },
              }}
            >
              <Link to="/">
                <img
                  src={logoWhite}
                  alt="JNE"
                  className="logo my-2"
                  style={{
                    height: "50px",
                    display: "flex",
                    margin: "0 auto",
                  }}
                ></img>
              </Link>
              <hr className="mx-3" style={{ color: "#e9f5f9" }} />
              {menu.map((m) =>
                auth.level >= m.req ? (
                  <MenuItem
                    key={m.id}
                    component={<Link to={m.link} />}
                    icon={m.icon}
                    style={{ color: "#e9f5f9" }}
                  >
                    {m.nama}
                  </MenuItem>
                ) : null
              )}
              <hr className="mx-3" style={{ color: "#e9f5f9" }} />
              <MenuItem disabled>{`${auth.name} | ${auth.origin}`}</MenuItem>
              <Button
                variant="outline-danger"
                title="Log Out"
                onClick={handleLogout}
                className="mx-3"
              >
                <LuLogOut /> Logout
              </Button>
            </Menu>
          </Sidebar>
        </div>
      ) : (
        <Navbar key="xl" expand="xl" className="bg-body-tertiary" sticky="top">
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
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-xl" />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-xl"
              aria-labelledby="offcanvasNavbarLabel-expand-xl"
              placement="start"
              bg="dark"
              data-bs-theme="dark"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-xl`}>
                  <img
                    src={logoWhite}
                    alt="JNE"
                    className="logo"
                    style={{ height: "50px" }}
                  ></img>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="me-auto my-2 my-lg-0">
                  {menu.map((m) => (
                    <Nav key={m.id}>
                      {auth.level >= m.req ? (
                        <Navbar.Text>
                          <NavLink
                            to={m.link}
                            style={({ isActive }) => ({
                              color: isActive ? "lightblue" : "white",
                            })}
                          >
                            {m.nama}
                          </NavLink>
                        </Navbar.Text>
                      ) : null}
                    </Nav>
                  ))}
                </Nav>
                <Nav>
                  <hr />
                  <Form className="d-flex">
                    <Navbar.Text>{`${auth.name} | JNE ${auth.origin}`}</Navbar.Text>
                    <Button
                      variant="outline-danger"
                      title="Log Out"
                      onClick={handleLogout}
                    >
                      <LuLogOut />
                    </Button>
                  </Form>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      )}
    </>
  );
}
