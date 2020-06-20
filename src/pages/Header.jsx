import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Navbar, Nav, Container, Image,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { signOutAction } from '../actions';
import logo from '../assets/img/logo-vanlig.png';

const Header = ({ authenticated, username, ...rest }) => (
  <Navbar variant="dark" bg="dark" expand="md" collapseOnSelect className="justify-content-between py-0 my-0">
    <Container fluid="md">
      <Navbar.Brand className="navbar-left" href="/">
        <Image
          className="nav-img mr-2"
          src={logo}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="m-0 p-0">
        <Nav className="mr-auto">
          <LinkContainer to="/" exact>
            <Nav.Item as="li">
              <Nav.Link as="div">
                Collection
              </Nav.Link>
            </Nav.Item>
          </LinkContainer>
          <LinkContainer to="/wishlist">
            <Nav.Item as="li">
              <Nav.Link as="div">
                Wishlist
              </Nav.Link>
            </Nav.Item>
          </LinkContainer>
          <LinkContainer to="/find">
            <Nav.Item as="li">
              <Nav.Link as="div">
                Find users
              </Nav.Link>
            </Nav.Item>
          </LinkContainer>
        </Nav>
        {authenticated ? (
          <Nav className="justify-content-end">
            <LinkContainer to={`/user/${username}`}>
              <Nav.Item as="li">
                <Nav.Link as="div">
                  { username }
                </Nav.Link>
              </Nav.Item>
            </LinkContainer>
            <LinkContainer to="/signout">
              <Nav.Item as="li" onClick={rest.signOutAction}>
                <Nav.Link as="div">
                  Sign out
                </Nav.Link>
              </Nav.Item>
            </LinkContainer>
          </Nav>
        )
          : (
            <Nav className="justify-content-end">
              <LinkContainer to="/register">
                <Nav.Item as="li">
                  <Nav.Link as="div">
                    Register
                  </Nav.Link>
                </Nav.Item>
              </LinkContainer>
              <LinkContainer to="/signin">
                <Nav.Item as="li">
                  <Nav.Link as="div">
                    Sign in
                  </Nav.Link>
                </Nav.Item>
              </LinkContainer>
            </Nav>
          )}
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  username: PropTypes.string.isRequired,
  signOutAction: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.authenticate.authenticated || false,
  username: state.authenticate.user ? state.authenticate.user.username : '',
});

export default withRouter(connect(mapStateToProps, { signOutAction })(Header));
