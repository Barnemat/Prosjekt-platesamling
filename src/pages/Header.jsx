import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, NavItem, Col, Grid, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = () => (
  <Navbar inverse fluid collapseOnSelect>
    <Grid fluid>
      <Row>
        <Col lg={2} md={2} />
        <Col lg={9} md={9}>
          <Navbar.Header>
            <Navbar.Brand>
              <NavLink to="/" activeClassName="active" exact>
                Record Collection
              </NavLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/" exact>
                <NavItem eventKey={1}>
                  Collection
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/example">
                <NavItem eventKey={2}>
                  Example 1
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/example">
                <NavItem eventKey={3}>
                  Example 2
                </NavItem>
              </LinkContainer>
            </Nav>
            <Nav pullRight>
              <LinkContainer to="/example">
                <NavItem eventKey={4}>
                  Example 3
                </NavItem>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Col>
        <Col lg={1} md={1} />
      </Row>
    </Grid>
  </Navbar>
);

export default Header;
