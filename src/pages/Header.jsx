import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, Col, Grid, Row, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { signOutAction } from '../actions';
import logo from '../assets/img/logo-vanlig.png';

const Header = ({ authenticated, username, ...props }) => (
  <Navbar inverse fluid collapseOnSelect>
    <Grid fluid>
      <Row>
        <Col lg={2} md={2} />
        <Col lg={8} md={8}>
          <Navbar.Header>
            <Link className="navbar-left" to="/">
              <Image
                className="nav-img margin-right"
                src={logo}
              />
            </Link>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/" exact>
                <NavItem eventKey={1}>
                  Collection
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/find">
                <NavItem eventKey={2}>
                  Find users
                </NavItem>
              </LinkContainer>
            </Nav>
            {authenticated ? (
              <Nav pullRight>
                <LinkContainer to={`/user/${username}`}>
                  <NavItem eventKey={4}>
                    { username }
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/signout">
                  <NavItem eventKey={5} onClick={props.signOutAction}>
                    Sign out
                  </NavItem>
                </LinkContainer>
              </Nav>
              )
              :
              (
                <Nav pullRight>
                  <LinkContainer to="/register">
                    <NavItem eventKey={4}>
                    Register
                    </NavItem>
                  </LinkContainer>
                  <LinkContainer to="/signin">
                    <NavItem eventKey={5}>
                    Sign in
                    </NavItem>
                  </LinkContainer>
                </Nav>
              )
            }
          </Navbar.Collapse>
        </Col>
        <Col lg={2} md={2} />
      </Row>
    </Grid>
  </Navbar>
);


Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  signOutAction: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  authenticated: state.authenticate.authenticated || false,
  username: state.authenticate.user ? state.authenticate.user.username : '',
});

export default withRouter(connect(mapStateToProps, { signOutAction })(Header));
