import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../styles/header.css';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Navbar inverse fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <NavLink to='/' activeClassName='active' exact={true}>
              Record Collection
            </NavLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to= "/" exact={true}>
              <NavItem eventKey={1}>
                Collection
              </NavItem>
            </LinkContainer>
            <LinkContainer to= "/example">
              <NavItem eventKey={2}>
                Example 1
              </NavItem>
            </LinkContainer>
            <LinkContainer to= "/example">
              <NavItem eventKey={3}>
                Example 2
              </NavItem>
            </LinkContainer>
          </Nav>
          <Nav pullRight>
            <LinkContainer to= "/example">
              <NavItem eventKey={4}>
                Example 3
              </NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  };
}
