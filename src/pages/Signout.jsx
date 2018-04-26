import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink, Redirect } from 'react-router-dom';
import { Navbar, Nav, NavItem, Col, Grid, Row } from 'react-bootstrap';
import { signOutAction } from '../actions';

class Signout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({ redirect: true }), 3000);
  }

  render() {
    const { authenticated } = this.props;
    authenticated && signOutAction();
    return this.state.redirect === true ? (<Redirect to="/" />) : (
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
