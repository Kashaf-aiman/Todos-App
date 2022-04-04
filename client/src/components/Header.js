import React from "react";
import { Navbar } from "react-bootstrap";
import LogoutBtn from "./Auth/LogoutBtn";


const Header = ({ logoutHandler }) => (
  <Navbar className="justify-content-between" bg="dark" variant = "dark" id="navbar">
    <img src = "/logo.png" alt="logo" className="todo-logo" />
    <Navbar.Brand id="navbarBrand">Todos App</Navbar.Brand>
    <Navbar.Collapse className="justify-content-end">
      <LogoutBtn logoutHandler={logoutHandler} />
    </Navbar.Collapse>
  </Navbar>
);

export default Header;
