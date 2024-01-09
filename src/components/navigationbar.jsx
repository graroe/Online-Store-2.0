import React from "react";
import { ShoppingCart } from "phosphor-react";
import { Storefront } from "phosphor-react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Navigationbar = () => {
  const [showAdminMode, setShowAdminMode] = useState(false);

  useEffect(() => {
    const curUser = JSON.parse(localStorage.getItem('user'));
    if (curUser) {
      console.log(curUser[0]);
      if (curUser[0].Admin === "1") {
        setShowAdminMode(true);
      } else {
        setShowAdminMode(false);
      }
    }
  }, []);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    let path = `/login`;
    navigate(path);
  }

  return (
    <Navbar>
      <Nav.Link href="/shop" className="nav-items">
        <Storefront size={32} />
      </Nav.Link>
      <Nav.Link href="/shop" className="nav-items"> Shop </Nav.Link>
      <Nav.Link href="/account" className="nav-items">Account</Nav.Link>
      <Nav.Link href="/reviews" className="nav-items">Reviews</Nav.Link>

      <Nav.Link href="/services" className="nav-items">Types of Services</Nav.Link>
      <Nav.Link href="/about" className="nav-items"> About Us </Nav.Link>
      <Nav.Link href="/contact" className="nav-items"> Contact Us </Nav.Link>

      <Nav.Link onClick={logout} className="nav-items"> Logout </Nav.Link>

      <div>
        {showAdminMode && (
          <NavDropdown title="Manage Database" className="nav-items">
            <NavDropdown.Item href='/manage/select' >View Records</NavDropdown.Item>
            <NavDropdown.Item href='/manage/insert' >Insert Records</NavDropdown.Item>
            <NavDropdown.Item href='/manage/update' >Update Records</NavDropdown.Item>
            <NavDropdown.Item href='/manage/delete' >Delete Records</NavDropdown.Item>
          </NavDropdown>
        )}
      </div>
      <div id="cart">
        <Nav.Link href="/cart" className="nav-items">
          <div id="cart">
          <ShoppingCart size={32} />
          </div>
        </Nav.Link>
      </div>
    </Navbar>
  );
};
