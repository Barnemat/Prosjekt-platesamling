import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PasswordValidator from 'password-validator';
import {
  Button,
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import DefaultFormGroup from '../components/Collection/FormComponents/DefaultFormGroup';
import { setLoadingCursor } from '../util';
import WildCardError from '../components/CommonComponents/WildCardError';
import { signInAction } from '../actions';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.passwordValidator = new PasswordValidator()
      .is().min(8)
      .is()
      .max(50)
      .has()
      .uppercase()
      .has()
      .lowercase()
      .has()
      .digits()
      .has()
      .not()
      .spaces();

    this.notValidText = `
      Your password must contain at least 8 characters,
      one number and a combination of lower- and uppercase letters.`;

    this.state = {
      url: 'http://localhost:8080/api/user',
      username: '',
      email: '',
      password: '',
      retype: '',
      userUnique: true,
      emailUnique: true,
      emailValid: null,
      passwordValid: null,
      passwordsEqual: null,
      showPasswordNotValid: false,
      showPasswordsNotEqual: false,
      showEmailNotValid: false,
      registered: false,
      wildCardError: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getPasswordValid = this.getPasswordValid.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.getDisable = this.getDisable.bind(this);
    this.getEmailValid = this.getEmailValid.bind(this);
  }

  getDisable() {
    const {
      username,
      email,
      password,
      retype,
      emailValid,
      passwordValid,
      passwordsEqual,
    } = this.state;

    return (
      username.length === 0
      || email.length === 0
      || password.length === 0
      || retype.length === 0
      || passwordValid === 'error'
      || passwordsEqual === 'error'
      || emailValid === 'error');
  }

  getPasswordValid(password) {
    const { ...state } = this.state;

    const validation = this.passwordValidator.validate(password || state.password) ? 'success' : 'error';
    return validation;
  }

  getEmailValid(email = '') {
    const { ...state } = this.state;
    const currentEmail = email || state.email;

    if (currentEmail.length === 0) return null;
    return currentEmail.includes('@', 1) && currentEmail.includes('.', 2) ? 'success' : 'error';
  }

  handleFocus(e) {
    e.preventDefault();
    const { name } = e.target;
    const {
      password, retype, passwordValid, emailValid,
    } = this.state;
    let showEmailNotValid = false;
    let showPasswordNotValid = false;
    let showPasswordsNotEqual = false;

    if (name !== 'email' && emailValid === 'error') {
      showEmailNotValid = true;
    }

    if (name !== 'password' && passwordValid === 'error') {
      showPasswordNotValid = true;
    }

    if (name !== 'retype' && password.length > 0 && retype.length > 0) {
      if (password !== retype) {
        showPasswordsNotEqual = true;
      }
    }

    this.setState({ showEmailNotValid, showPasswordNotValid, showPasswordsNotEqual });
  }

  handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    const { email, password } = this.state;
    let { passwordValid, emailValid, passwordsEqual } = this.state;

    if (name === 'password') {
      passwordValid = this.getPasswordValid(value);
    } else if (name === 'email' && email.length > 0) {
      emailValid = this.getEmailValid(value);
    } else if (name === 'retype') {
      passwordsEqual = password === value ? 'success' : 'error';
    }

    this.setState({
      [name]: value,
      passwordValid,
      emailValid,
      passwordsEqual,
      userUnique: true,
      emailUnique: true,
      showPasswordNotValid: false,
      showPasswordsNotEqual: false,
      showEmailNotValid: false,
      wildCardError: false,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const {
      username, email, password, url,
    } = this.state;

    const { ...props } = this.props;

    if (!this.getDisable()) {
      setLoadingCursor(true);
      axios.get(`${url}?username=${username}`)
        .then((res) => {
          if (res.data.unique) {
            axios.get(`${url}?email=${email}`)
              .then((innerRes) => {
                if (innerRes.data.unique) {
                  axios.post(url, { username, email, password })
                    .then(() => {
                      props.signInAction({ username, password, remember: false });
                      this.setState({ registered: true });
                    })
                    .catch(() => {
                      this.setState({ wildCardError: true });
                    });
                } else {
                  this.setState({ emailUnique: false });
                }
              })
              .catch(() => {
                this.setState({ wildCardError: true });
              });
          } else {
            this.setState({ userUnique: false });
          }
        })
        .catch(() => {
          this.setState({ wildCardError: true });
        })
        .then(() => {
          setLoadingCursor(false);
        });
    }
  }

  handleReset() {
    this.setState({
      username: '',
      email: '',
      password: '',
      retype: '',
      userUnique: true,
      emailUnique: true,
      emailValid: null,
      passwordValid: null,
      passwordsEqual: null,
      showPasswordNotValid: false,
      showPasswordsNotEqual: false,
      showEmailNotValid: false,
      wildCardError: false,
    });
  }

  render() {
    const {
      username,
      email,
      password,
      retype,
      userUnique,
      emailUnique,
      emailValid,
      passwordValid,
      showPasswordNotValid,
      showPasswordsNotEqual,
      showEmailNotValid,
      passwordsEqual,
      registered,
      wildCardError,
    } = this.state;

    const { authenticated } = this.props;

    return authenticated || registered ? (<Redirect to="/" />) : (
      <div>
        <Container fluid>
          <Row className="show-grid">
            <Col lg={2} md={2} />
            <Col lg={8} md={8} sm={12} xs={12}>
              <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                {wildCardError
                  && <WildCardError />}
                <DefaultFormGroup
                  id="formControlsUsername"
                  name="username"
                  value={username}
                  type="text"
                  label="Username"
                  placeholder="Username..."
                  validationState={userUnique ? null : 'error'}
                  feedback
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                />
                {!userUnique
                  && (
                  <div className="text-danger">
                    The username already is taken.
                  </div>
                  )}
                <DefaultFormGroup
                  id="formControlsEmail"
                  name="email"
                  value={email}
                  type="email"
                  label="Email"
                  placeholder="Email..."
                  validationState={emailValid}
                  feedback
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                />
                {showEmailNotValid
                  && (
                  <div className="text-danger">
                    The email does not contain an &apos;@&apos; or a &apos;.&apos;
                  </div>
                  )}
                {!emailUnique
                  && (
                  <div className="text-danger">
                    The email is registered by another user.
                  </div>
                  )}
                <DefaultFormGroup
                  id="formControlsPassword"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Password..."
                  validationState={passwordValid}
                  feedback
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                />
                {showPasswordNotValid
                  && (
                  <div className="text-danger">
                    {this.notValidText}
                  </div>
                  )}
                <DefaultFormGroup
                  id="formControlsPassword2"
                  name="retype"
                  type="password"
                  label="Retype Password"
                  placeholder="Password..."
                  feedback
                  validationState={passwordsEqual}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                />
                {showPasswordsNotEqual
                  && (
                  <div className="text-danger">
                    The passwords does not match.
                  </div>
                  )}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={this.getDisable()}
                  onFocus={this.handleFocus}
                >
                  Register
                </Button>
                <Button
                  type="reset"
                  disabled={
                      username.length === 0
                      && email.length === 0
                      && password.length === 0
                      && retype.length === 0
}
                  onFocus={this.handleFocus}
                >
                  Reset Fields
                </Button>
                {wildCardError
                  && <WildCardError />}
              </form>
            </Col>
            <Col lg={2} md={2} />
          </Row>
        </Container>
      </div>
    );
  }
}

Register.propTypes = {
  authenticated: PropTypes.bool,
  signInAction: PropTypes.func.isRequired,
};

Register.defaultProps = {
  authenticated: false,
};

const mapStateToProps = (state) => ({
  authenticated: state.authenticate.authenticated,
});

const mapDispatchToProps = {
  signInAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
