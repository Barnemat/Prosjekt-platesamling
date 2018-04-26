import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { Navbar, Nav, NavItem, Col, Grid, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { signOutAction } from '../actions';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authenticated, username } = this.props;
    return (
      <Navbar inverse fluid collapseOnSelect>
        <Grid fluid>
          <Row>
            <Col lg={2} md={2} />
            <Col lg={8} md={8}>
              <Navbar.Header>
                <Navbar.Brand>
                  <NavLink to="/" exact>
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
                {authenticated ? (
                  <Nav pullRight>
                    <LinkContainer to={"/example"}>
                      <NavItem eventKey={4}>
                        {username} (Example)
                      </NavItem>
                    </LinkContainer>
                    <LinkContainer to="/signout">
                      <NavItem eventKey={5} onClick={this.props.signOutAction}>
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
  }
}

Header.propTypes = {
  authenticated: PropTypes.bool,
  username: PropTypes.string,
  signOutAction: PropTypes.func,
};


const mapStateToProps = (state) => ({
  authenticated: state.authenticate.authenticated || false,
  username: state.authenticate.user ? state.authenticate.user.username : '',
});

export default withRouter(connect(mapStateToProps, {signOutAction})(Header));
