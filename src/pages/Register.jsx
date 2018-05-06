import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import passwordValidator from 'password-validator';
import {
  FormControl,
  FormGroup,
  Button,
  Glyphicon,
  InputGroup,
  ControlLabel,
  Collapse,
  OverlayTrigger,
  Checkbox,
  Well,
  Image,
  Grid,
  Col,
  Row } from 'react-bootstrap';
  import DefaultFormGroup from '../components/Collection/FormComponents/DefaultFormGroup';
  import { setLoadingCursor } from '../util';
  import WildCardError from '../components/CommonComponents/WildCardError';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.passwordValidator = new passwordValidator()
      .is().min(8)
      .is().max(50)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().not().spaces();

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

  handleFocus(e) {
    e.preventDefault();
    const { name } = e.target;
    const { username, email, password, retype, passwordValid, emailValid } = this.state;
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

  getPasswordValid(password) {
    const validation = this.passwordValidator.validate(password || this.state.password) ? 'success' : 'error';
    return validation;
  }

  getEmailValid(email = '') {
    const currentEmail = email || this.state.email;

    if (currentEmail.length === 0) return null;
    return currentEmail.includes('@', 1) && currentEmail.includes('.', 2) ? 'success' : 'error';
  }

  handleChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    const { email, password, retype } = this.state;
    let passwordValid = this.state.passwordValid;
    let emailValid = this.state.emailValid;
    let passwordsEqual = this.state.passwordsEqual;

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
      lackingReqFields: false,
      userUnique: true,
      emailUnique: true,
      showPasswordNotValid: false,
      showPasswordsNotEqual: false,
      showEmailNotValid: false,
      wildCardError: false
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, email, password, passwordValid, passwordsEqual, url } = this.state;

    if (!this.getDisable()) {
      setLoadingCursor(true);
      axios.get(`${url}?username=${username}`)
      .then((res) => {
        if (res.data.unique) {
          axios.get(`${url}?email=${email}`)
            .then((innerRes) => {
              if (innerRes.data.unique) {
                axios.post(this.state.url, { username, email, password })
                  .then((res) => {
                    this.setState({ registered: true });
                  })
                  .catch((err) => {
                    this.setState({ wildCardError: true });
                  });
              } else {
                this.setState({ emailUnique: false });
              }
            })
            .catch((err) => {
              this.setState({ wildCardError: true });
            });
        } else {
          this.setState({ userUnique: false });
        }
      })
      .catch((err) => {
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

  getDisable() {
    const {
      username,
      email,
      password,
      retype,
      userUnique,
      emailValid,
      passwordValid,
      passwordsEqual,
    } = this.state;

    return (
    username.length === 0 ||
    email.length === 0 ||
    password.length === 0 ||
    retype.length === 0 ||
    passwordValid === 'error' ||
    passwordsEqual === 'error' ||
    emailValid === 'error');
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

    return this.props.authenticated || registered ? (<Redirect to="/" />) : (
      <div>
        <Grid fluid>
          <Row className="show-grid">
            <Col lg={2} md={2} />
            <Col lg={8} md={8} sm={12} xs={12}>
              <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                {wildCardError &&
                  <WildCardError />
                }
                <DefaultFormGroup
                  id="formControlsUsername"
                  name="username"
                  value={username}
                  type="text"
                  label="Username"
                  placeholder="Username..."
                  validationState={userUnique ? null : 'error'}
                  feedback={true}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                />
                {!userUnique &&
                  <div className="text-danger">
                    The username already is taken.
                  </div>
                }
                <DefaultFormGroup
                  id="formControlsEmail"
                  name="email"
                  value={email}
                  type="email"
                  label="Email"
                  placeholder="Email..."
                  validationState={emailValid}
                  feedback={true}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                />
                {showEmailNotValid === 'error' &&
                  <div className="text-danger">
                     The email does not contain an '@' or a '.'
                  </div>
                }
                {!emailUnique &&
                  <div className="text-danger">
                    The email is registered by another user.
                  </div>
                }
                <DefaultFormGroup
                  id="formControlsPassword"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Password..."
                  validationState={passwordValid}
                  feedback={true}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                />
                {showPasswordNotValid &&
                  <div className="text-danger">
                    {this.notValidText}
                  </div>
                }
                <DefaultFormGroup
                  id="formControlsPassword2"
                  name="retype"
                  type="password"
                  label="Retype Password"
                  placeholder="Password..."
                  feedback={true}
                  validationState={passwordsEqual}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                />
                {showPasswordsNotEqual &&
                  <div className="text-danger">
                    The passwords does not match.
                  </div>
                }
                <Button
                  bsStyle="primary"
                  type="submit"
                  disabled={this.getDisable()}
                  onFocus={this.handleFocus}>
                  Register
                </Button>
                <Button
                  type="reset"
                  disabled={
                      username.length === 0 &&
                      email.length === 0 &&
                      password.length === 0 &&
                      retype.length === 0}
                  onFocus={this.handleFocus}>
                  Reset Fields
                </Button>
                {wildCardError &&
                  <WildCardError />
                }
              </form>
            </Col>
            <Col lg={2} md={2} />
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authenticated: state.authenticate.authenticated,
});

export default connect(mapStateToProps)(Register);
