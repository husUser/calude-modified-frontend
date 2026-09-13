import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router-dom";
import classes from "./Header1.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

function DashboardHeader() {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const auth = useAuthUser();
  const role = auth?.userRole;

  const logOut = () => {
    signOut();
    navigate("/login");
  };

  // 0 user (default)
  // 1 lab technician  (operator)
  // 2  TA
  // 3  admin
  // 4  super-admin
  // 5   professor

  const navLinks = {
    0: [
      { to: "/dashboard", label: "Home" },
      { to: "/myBookings", label: "My Booking" },
      { to: "/information", label: "Information" },
    ],
    1: [
      { to: "/dashboard", label: "Home" },
      { to: "/blockBooking", label: "Block Booking" },
      { to: "/EquipStatusUpdate", label: "Alter Equipment Status" },
      { to: "/operatorList", label: "Operator Dashboard" },
      { to: "/addEquipments", label: "Add Equipment" },
      { to: "/myBookings", label: "My Booking" },
      { to: "/information", label: "Information" },
    ],
    2: [
      { to: "/dashboard", label: "Home" },
      { to: "/operatorList", label: "Operator Dashboard" },
      { to: "/information", label: "Information" },
    ],
    3: [
      { to: "/dashboard", label: "Home" },
      { to: "/addEquipments", label: "Add Equipment" },
      { to: "/addProfessors", label: "Add Professor" },
      { to: "/ListOfAllUsers", label: "All Users" },
      { to: "/userRoleUpdate", label: "Privilege" },
      { to: "/deleteOldData", label: "Clean Old Data" },
      { to: "/blockBooking", label: "Block Booking" },
      { to: "/EquipStatusUpdate", label: "Alter Equipment Status" },
      { to: "/notification", label: "Notification" },
      { to: "/information", label: "Information" },
    ],
    4: [
      { to: "/dashboard", label: "Home" },
      { to: "/addEquipments", label: "Add Equipment" },
      { to: "/addProfessors", label: "Add Professor" },
      { to: "/ListOfAllUsers", label: "All Users" },
      { to: "/userRoleUpdate", label: "Privilege" },
      { to: "/deleteOldData", label: "Clean Old Data" },
      { to: "/blockBooking", label: "Block Booking" },
      { to: "/EquipStatusUpdate", label: "Alter Equipment Status" },
      { to: "/notification", label: "Notification" },
      { to: "/information", label: "Information" },
    ],
    5: [
      { to: "/ProfessorDashboard", label: "Professor Dashboard" },
      { to: "/information", label: "Information" },
    ],
  };

  const commonLinks = [
    { to: "https://ch.iitr.ac.in/", label: "Department Site", external: true },
    { to: "/ack", label: "Acknowledgement" },
    { to: "/about", label: "About" },
  ];

  return (
    <Navbar
      expand="lg"
      className={`shadow-sm ${classes.navbar}`}
      variant="dark"
      sticky="top"
      collapseOnSelect
    >
      <Container fluid>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/dashboard" className={classes.brand}>
          Booking Portal
        </Navbar.Brand>

        {/* ✅ Fixed Navbar Toggler */}
        <Navbar.Toggle
          aria-controls="main-navbar-nav"
          className={classes.navbarToggler}
        >
          <span className="navbar-toggler-icon" />
        </Navbar.Toggle>

        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {navLinks[role]?.map((link, index) =>
              link.external ? (
                <Nav.Link
                  key={index}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.link}
                >
                  {link.label}
                </Nav.Link>
              ) : (
                <Nav.Link
                  key={index}
                  as={Link}
                  to={link.to}
                  className={classes.link}
                >
                  {link.label}
                </Nav.Link>
              ),
            )}
            {commonLinks.map((link, index) =>
              link.external ? (
                <Nav.Link
                  key={`common-${index}`}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.link}
                >
                  {link.label}
                </Nav.Link>
              ) : (
                <Nav.Link
                  key={`common-${index}`}
                  as={Link}
                  to={link.to}
                  className={classes.link}
                >
                  {link.label}
                </Nav.Link>
              ),
            )}
          </Nav>

          {role !== undefined && (
            <div className="d-flex align-items-center gap-3">
              <span className={classes.welcomeText}>
                Welcome, <strong>{auth?.userName}</strong>
              </span>
              <Button variant="danger" size="sm" onClick={logOut}>
                Log Out
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DashboardHeader;
