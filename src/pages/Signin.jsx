import React from 'react';
import { connect } from 'react-redux';
import { Col, Grid, Row, Button, ControlLabel, Checkbox } from 'react-bootstrap';
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
            <Col lg={2} md={2} sm={2} xs={1} />
            <Col lg={5} md={5} sm={6} xs={10}>
              <form onSubmit={handleSubmit(this.submit)}>
                <Grid fluid>
                  <Row className="margin-bottom">
                    <Col lg={2} md={3} sm={3} xs={12} componentClass={ControlLabel}>Username</Col>
                    <Col lg={10} md={9} sm={9} xs={12}>
                    <Field
                      className="form-control"
                      name="username"
                      component="input"
                      type="text"
                      placeholder="Username"
                    />
                    </Col>
                  </Row>
                  <Row className="margin-bottom">
                    <Col lg={2} md={3} sm={3} xs={12} componentClass={ControlLabel}>Password</Col>
                    <Col lg={10} md={9} sm={9} xs={12}>
                    <Field
                      className="form-control"
                      name="password"
                      component="input"
                      type="password"
                      placeholder="Password"
                    />
                    </Col>
                  </Row>
                  <Row className="margin-bottom">
                    <Col
                      lgOffset={2}
                      mdOffset={3}
                      smOffset={3}
                      lg={10}
                      md={9}
                      sm={9}
                      xs={12}>
                      <Field
                        name="remember"
                        component="input"
                        type="checkbox"
                      />
                      <span> Remember me</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lgOffset={2}
                      mdOffset={3}
                      smOffset={3}
                      lg={10}
                      md={9}
                      sm={9}
                      xs={12}
                    >
                      <Button bsStyle="primary" type="submit" disabled={pristine || submitting}>
                        Sign in
                      </Button>
                      <Button disabled={pristine || submitting} onClick={reset}>
                        Clear fields
                      </Button>
                    </Col>
                  </Row>
                </Grid>
              </form>
              <Col
                lgOffset={2}
                mdOffset={3}
                smOffset={3}
                lg={10}
                md={9}
                sm={9}
                xs={12}
              >
                <p className="text-danger">
                  {this.props.errorMessage}
                </p>
              </Col>
            </Col>
            <Col lg={5} md={5} sm={4} xs={1}/>
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