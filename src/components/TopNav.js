import React, { useState, useContext } from 'react'
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavbarBrand, NavbarText, NavLink } from 'reactstrap'
import { Link } from 'react-router-dom'
import { UserContext } from '../user-context'

const TopNav = () => {
  const { isLoggedIn, setIsloggedIn } = useContext(UserContext)

  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  const logoutHandler = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('user_id')
    setIsloggedIn(false)
  }

  return isLoggedIn ?
    <div>
      <Navbar color="faded" light expand="md">
        <NavbarBrand href="/">Mail Processing Parts</NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
            <NavItem>
              <NavLink href="/events">Add Part</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/">Dashboard</NavLink>
            </NavItem>
          </Nav>
          <NavbarText>
            <Link to="/login" onClick={logoutHandler}>Logout</Link>
          </NavbarText>
        </Collapse>
      </Navbar>
    </div>
    : ""
}

export default TopNav