import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, Link } from 'react-router-dom';
import { Navbar, Nav, NavItem, Col, Grid, Row } from 'react-bootstrap';
import { signOutAction } from '../actions';

class Signout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authenticated } = this.props;
    authenticated && signOutAction();

    return (
      <div>
        <Grid fluid>
          <Row className="show-grid">
            <Col lg={2} md={2} />
            <Col lg={8} md={8} sm={12} xs={12}>
              <div className="text-center lead">
                {authenticated ? 
                  'You are signing out...'
                  :
                  'You successfully signed out.'
                }
              </div>
              <div className="text-center">
                Return to the {<Link to="/">front page.</Link>}
              </div>
            </Col>
            <Col lg={2} md={2} />
          </Row>
        </Grid>
      </div>
    );
  }
}

Signout.propTypes = {
  authenticated: PropTypes.bool,
};


const mapStateToProps = (state) => ({
  authenticated: state.authenticate.authenticated || false,
});

export default connect(mapStateToProps, {signOutAction})(Signout);
