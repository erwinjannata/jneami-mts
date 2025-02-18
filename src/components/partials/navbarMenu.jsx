/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import "./../../index.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "./../../images/jne_brand.png";
import logoWhite from "./../../images/jne_brand_white.png";
import { Link, useNavigate } from "react-router-dom";
import { UseAuth } from "../../config/authContext";
import { Button, NavDropdown, Offcanvas } from "react-bootstrap";
import { LuLogOut } from "react-icons/lu";
import { MenuItem, Sidebar, Menu, SubMenu } from "react-pro-sidebar";
import { useEffect, useState } from "react";
import { navbarMenus } from "../data/navMenu";

export default function NavMenu() {
  const auth = UseAuth();
  const navigate = useNavigate();
  const [currentOpen, setCurrentOpen] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [broken, setBroken] = useState(
    window.matchMedia("(max-width: 800px)").matches
  );

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  const homelink = () => {
    if (auth.origin === "VENDOR") {
      return "/v";
    } else if (auth.origin === "BANDARA") {
      return "/mm";
    } else {
      return "/";
    }
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
          className="user-select-none"
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
            breakPoint="md"
            onBreakPoint={setBroken}
            backgroundColor="#212529"
          >
            <Menu>
              <Link to={homelink()}>
                <img
                  src={logoWhite}
                  alt="JNE"
                  className="logo my-2"
                  style={{
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto",
                  }}
                ></img>
              </Link>
              <hr className="mx-3" style={{ color: "#e9f5f9" }} />
              <div>
                {navbarMenus.map((submenu, subMenuIndex) =>
                  auth.level >= submenu.req &&
                  submenu.allowedOrigin.includes(auth.origin) ? (
                    <SubMenu
                      key={subMenuIndex}
                      id="navSubmenu"
                      label={submenu.label}
                      icon={submenu.icon}
                      open={currentOpen === subMenuIndex ? true : false}
                      onOpenChange={() => {
                        currentOpen === subMenuIndex
                          ? setCurrentOpen(null)
                          : setCurrentOpen(subMenuIndex);
                      }}
                    >
                      {submenu.items.map((menuItem, menuItemIndex) =>
                        auth.level >= menuItem.req ? (
                          <MenuItem
                            key={menuItemIndex}
                            component={<Link to={menuItem.link} />}
                            icon={menuItem.icon}
                            id="navItems"
                          >
                            {menuItem.label}
                          </MenuItem>
                        ) : null
                      )}
                    </SubMenu>
                  ) : null
                )}
              </div>
              <hr className="mx-3" style={{ color: "#e9f5f9" }} />
              <MenuItem disabled>{`${auth.name}`}</MenuItem>
              <MenuItem disabled>{`${auth.origin}`}</MenuItem>
              <Button
                variant="outline-danger"
                title="Log Out"
                onClick={handleLogout}
                className="mx-3"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
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
              <Link to={auth.origin == "VENDOR" ? "/vendor" : "/"}>
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
                  {navbarMenus.map((menuItem, menuIndex) => (
                    <Nav key={menuIndex}>
                      {auth.level >= menuItem.req &&
                      menuItem.allowedOrigin.includes(auth.origin) ? (
                        <NavDropdown title={menuItem.label} id="navSubMenu">
                          {menuItem.items.map((subMenuItem, subMenuIndex) => {
                            return auth.level >= subMenuItem.req ? (
                              <NavDropdown.Item
                                as={Link}
                                key={subMenuIndex}
                                to={subMenuItem.link}
                                id="navItems"
                                style={{ backgroundColor: "#212529" }}
                              >
                                {subMenuItem.label}
                              </NavDropdown.Item>
                            ) : null;
                          })}
                        </NavDropdown>
                      ) : null}
                    </Nav>
                  ))}
                </Nav>
                <Nav>
                  <hr />
                  <Navbar.Text>{auth.name}</Navbar.Text>
                  <Navbar.Text>{auth.origin}</Navbar.Text>
                  <Button
                    variant="outline-danger"
                    title="Log Out"
                    onClick={handleLogout}
                  >
                    <LuLogOut /> {` Logout`}
                  </Button>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      )}
    </>
  );
}
