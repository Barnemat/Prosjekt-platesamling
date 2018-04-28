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
      userUnique: null,
      emailValid: null,
      passwordValid: null,
      passwordsEqual: null,
      showpasswordNotValid: false,
      registered: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getPasswordValid = this.getPasswordValid.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.getDisable = this.getDisable.bind(this);
  }

  handleFocus(e) {
    e.preventDefault();
    const { name } = e.target;
    const { username, email, password, retype, passwordValid, url } = this.state;
    let userUnique = null;
    let emailValid = null;
    let showpasswordNotValid = false;
    let passwordsEqual = null;

    axios.get(`${url}?username=${username}`)
      .then((res) => {
        axios.get(`${url}?email=${email}`)
          .then((innerRes) => {
            if (name !== 'username' && username.length > 0) {
              userUnique = res.data.unique ? 'success' : 'error';
            }

            if (name !== 'email' && email.length > 0) {
              emailValid = innerRes.data.unique && email.includes('@', 1) && email.includes('.', 2) ? 'success' : 'error';
            }

            if (name !== 'password' && passwordValid === 'error') {
              showpasswordNotValid = true;
            }

            if (name !== 'retype') {
              if (password.length > 0 && retype.length > 0) {
                passwordsEqual = password === retype ? 'success' : 'error';
              }
            }
            this.setState({ userUnique, emailValid, showpasswordNotValid, passwordsEqual });
          })
          .catch((err) => {
            this.setState({ userUnique, emailValid, showpasswordNotValid, passwordsEqual });
          })
      })
      .catch((err) => {
        this.setState({ userUnique, emailValid, showpasswordNotValid, passwordsEqual });
      })
  }

  getPasswordValid(password) {
    const validation = this.passwordValidator.validate(password || this.state.password) ? 'success' : 'error';
    return validation;
  }

  handleChange(e) {
    e.preventDefault();
    let passwordValid = this.state.passwordValid;

    if (e.target.name === 'password') passwordValid = this.getPasswordValid(e.target.value);
    this.setState({ [e.target.name]: e.target.value, passwordValid, lackingReqFields: false });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { username, email, password, userUnique, passwordValid, passwordsEqual } = this.state;

    if (!this.getDisable()) {
      setLoadingCursor(true);
      axios.post(this.state.url, { username, email, password })
        .then((res) => {
          this.setState({ registered: true });
        })
        .catch((err) => {
          console.error(err);
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
      userUnique: null,
      emailValid: null,
      passwordValid: null,
      passwordsEqual: null,
      showpasswordNotValid: false,
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
    userUnique === 'error' ||
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
      emailValid,
      passwordValid,
      showpasswordNotValid,
      passwordsEqual,
      registered,
    } = this.state;

    return this.props.authenticated || registered ? (<Redirect to="/" />) : (
      <div>
        <Grid fluid>
          <Row className="show-grid">
            <Col lg={2} md={2} />
            <Col lg={8} md={8} sm={12} xs={12}>
              <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                <DefaultFormGroup
                  id="formControlsUsername"
                  name="username"
                  value={username}
                  type="text"
                  label="Username"
                  placeholder="Username..."
                  validationState={userUnique}
                  feedback={true}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                />
                {userUnique === 'error' &&
                  <div className="text-danger">
                    The username is taken.
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
                {emailValid === 'error' &&
                  <div className="text-danger">
                    The email is registered by another user or does not contain an '@' or a '.'
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
                {showpasswordNotValid &&
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
                {passwordsEqual === 'error' &&
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
