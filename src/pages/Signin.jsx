import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Col, Container, Row, Button, FormLabel,
} from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { signInAction } from '../actions';

class Signin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((state) => ({
      checked: !state.checked,
    }));
  }

  render() {
    const { checked } = this.state;

    const {
      handleSubmit, pristine, reset, submitting, authenticated, errorMessage, ...props
    } = this.props;

    return authenticated ? (<Redirect to="/" />) : (
      <div>
        <Container fluid>
          <Row className="show-grid">
            <Col lg={2} md={2} sm={2} xs={1} />
            <Col lg={5} md={5} sm={6} xs={10}>
              <form onSubmit={handleSubmit((values) => {
                props.signInAction(Object.assign(values, { remember: checked }));
              })}
              >
                <Container fluid>
                  <Row className="margin-bottom pt-4">
                    <Col lg={2} md={3} sm={3} xs={12} as={FormLabel}>Username</Col>
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
                    <Col lg={2} md={3} sm={3} xs={12} as={FormLabel}>Password</Col>
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
                      lg={{ span: 10, offset: 2 }}
                      md={{ span: 9, offset: 3 }}
                      sm={{ span: 9, offset: 3 }}
                      xs={12}
                    >
                      <Field
                        name="remember"
                        component="input"
                        type="checkbox"
                        checked={checked}
                        onClick={this.handleClick}
                        className="mr-1"
                      />
                      <span
                        role="button"
                        tabIndex={0}
                        onKeyUp={(e) => e.key.toLowerCase() === 'enter' && this.handleClick()}
                        onClick={this.handleClick}
                      >
                        Remember me
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={{ span: 10, offset: 2 }}
                      md={{ span: 9, offset: 3 }}
                      sm={{ span: 9, offset: 3 }}
                      xs={12}
                    >
                      <Button className="mr-1" variant="primary" type="submit" disabled={pristine || submitting}>
                        Sign in
                      </Button>
                      <Button disabled={pristine || submitting} onClick={reset}>
                        Clear fields
                      </Button>
                    </Col>
                  </Row>
                </Container>
              </form>
              <Col
                lg={{ span: 10, offset: 2 }}
                md={{ span: 9, offset: 3 }}
                sm={{ span: 9, offset: 3 }}
                xs={12}
              >
                <p className="text-danger">
                  {errorMessage}
                </p>
              </Col>
            </Col>
            <Col lg={5} md={5} sm={4} xs={1} />
          </Row>
        </Container>
      </div>
    );
  }
}

Signin.propTypes = {
  errorMessage: PropTypes.string,
  authenticated: PropTypes.bool,
  signInAction: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
};

Signin.defaultProps = {
  errorMessage: null,
  authenticated: false,
};

const mapStateToProps = (state) => ({
  errorMessage: state.authenticate.error,
  authenticated: state.authenticate.authenticated,
});

const reduxFormSignin = reduxForm({
  form: 'signin',
})(Signin);

export default connect(mapStateToProps, { signInAction })(reduxFormSignin);
