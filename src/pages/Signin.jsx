import React from 'react';
import { connect } from 'react-redux';
import { Col, Grid, Row, Button } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { signInAction } from '../actions';

class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:8080/api/users',
    };

    this.submit = values => {
      this.props.signInAction(values);
    };
  }

  render() {
    const { handleSubmit, pristine, reset, submitting, authenticated } = this.props;

    return authenticated ? (<Redirect to="/" />) : (
      <div>
        <Grid fluid>
          <Row className="show-grid">
            <Col lg={2} md={2} />
            <Col lg={8} md={8} sm={12} xs={12}>
              <form onSubmit={handleSubmit(this.submit)}>
                <Field
                  name="username"
                  component="input"
                  type="text"
                  placeholder="Username"
                />
                <Field
                  name="password" 
                  component="input"
                  type="password" 
                  placeholder="Password" 
                />
                <Button bsStyle="primary" type="submit" disabled={pristine || submitting}>
                  Sign in
                </Button>
                <Button disabled={pristine || submitting} onClick={reset}>
                  Clear fields
                </Button>
              </form>
              {this.props.errorMessage}
            </Col>
            <Col lg={2} md={2} />
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  errorMessage: state.authenticate.error,
  authenticated: state.authenticate.authenticated,
});

const reduxFormSignin = reduxForm({
  form: 'signin'
})(Signin);

export default connect(mapStateToProps, {signInAction})(reduxFormSignin);