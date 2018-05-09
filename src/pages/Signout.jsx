import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Grid, Row } from 'react-bootstrap';
import { signOutAction } from '../actions';

const Signout = ({ authenticated }) => {
  if (authenticated) signOutAction();

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
};

Signout.propTypes = {
  authenticated: PropTypes.bool,
};

Signout.defaultProps = {
  authenticated: false,
};

const mapStateToProps = state => ({
  authenticated: state.authenticate.authenticated,
});

export default connect(mapStateToProps, { signOutAction })(Signout);
