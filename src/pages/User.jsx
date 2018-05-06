import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
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
import { Redirect, Link } from 'react-router-dom';
import DefaultFormGroup from '../components/Collection/FormComponents/DefaultFormGroup';
import { setLoadingCursor } from '../util';
import { signInAction } from '../actions';
import WildCardError from '../components/CommonComponents/WildCardError';

const UsernameNotMatching = ({ usernameFromPath }) => (
  <div>
    The user <strong>{ usernameFromPath }</strong> either has an account set to private, or does not exist.
    <div>
      <Link to="/">Return to front page</Link>
    </div>
  </div>
);

class User extends React.Component {
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

    this.wrongPassword = 'The password is wrong.';

    this.state = {
      url: 'http://localhost:8080/api/user',
      passwordValidUrl: 'http://localhost:8080/api/validPassword',
      authenticatedUser: this.props.authenticatedUser || { username: '', email: '', private: true },
      usernameFromPath: this.props.match.params.username,
      newEmail: '',
      confirmEmailPassword: '',
      newPassword: '',
      newPasswordRetype: '',
      confirmPasswordEdit: '',
      emailValid: null,
      passwordValid: null,
      passwordsEqual: null,
      showPasswordSubmitSuccess: false,
      showEmailNotValid: false,
      showEmailPreviouslyUsed: false,
      showEmailSubmitSuccess: false,
      wrongPasswordEmail: false,
      wrongPasswordPassword: false,
      showPasswordNotValid: false,
      showPasswordsNotEqual: false,
      wildCardError: false,
      privateUser: this.props.authenticatedUser && this.props.authenticatedUser.private !== undefined ?
        this.props.authenticatedUser.private
        : 
        true,
      showPrivateUserSubmitSuccess: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.handleEmailReset = this.handleEmailReset.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
    this.handlePrivateUserSubmit = this.handlePrivateUserSubmit.bind(this);
    this.getEmailValid = this.getEmailValid.bind(this);
    this.getPasswordValid = this.getPasswordValid.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.getEmailBtnDisable = this.getEmailBtnDisable.bind(this);
    this.getPasswordBtnDisable = this.getPasswordBtnDisable.bind(this);
  }

  handleFocus(e) {
    e.preventDefault();
    const { name } = e.target;
    const { newEmail, newPassword, newPasswordRetype, passwordValid, url, emailValid } = this.state;
    let showEmailNotValid = false;
    let showPasswordNotValid = false;
    let showPasswordsNotEqual = false;

    if (name !== 'newEmail' && emailValid === 'error') showEmailNotValid = true;

    if (name !== 'newPassword' && passwordValid === 'error') showPasswordNotValid = true;

    if (name !== 'newPasswordRetype' && newPassword.length > 0 && newPasswordRetype.length > 0) {
      if (newPassword !== newPasswordRetype) {
        showPasswordsNotEqual = true;
      }
    }
    this.setState({ showPasswordNotValid, showEmailNotValid, showPasswordsNotEqual });
  }

  getPasswordValid(password = '') {
    if (this.state.newPassword.length === 0 && password.length === 0) return null;
    const validation = this.passwordValidator.validate(password || this.state.newPassword) ? 'success' : 'error';
    return validation;
  }

  getEmailValid(email = '') {
    const currentEmail = email || this.state.newEmail;

    if (currentEmail.length === 0) return null;
    return currentEmail.includes('@', 1) && currentEmail.includes('.', 2) ? 'success' : 'error';
  }

  handleChange(e) {
    if (e.target.name !== 'privateUserCheckbox') e.preventDefault();
    const { name, value } = e.target;
    const { newPassword, newPasswordRetype } = this.state;
    let passwordValid = this.state.passwordValid;
    let privateUser = this.state.privateUser;
    let emailValid = this.state.emailValid;
    let showEmailPreviouslyUsed = this.state.showEmailPreviouslyUsed;
    let passwordsEqual = this.state.passwordsEqual;

    if (name === 'newPassword') {
      passwordValid = this.getPasswordValid(value);
    } else if (name === 'privateUserCheckbox') {
      privateUser = !privateUser;
    } else if (name === 'newEmail') {
      emailValid = this.getEmailValid(value);
      showEmailPreviouslyUsed = false;
    } else if (name === 'newPasswordRetype') {
      passwordsEqual = newPassword === value ? 'success' : 'error';
    }

    this.setState({
      [name]: value,
      passwordValid,
      privateUser,
      emailValid,
      showEmailPreviouslyUsed,
      passwordsEqual,
      showEmailSubmitSuccess: false,
      showPasswordSubmitSuccess: false,
      showPrivateUserSubmitSuccess: false,
      showEmailNotValid: false,
      showPasswordsNotEqual: false,
      showPasswordNotValid: false,
      wrongPasswordEmail: false,
      wrongPasswordPassword: false,
      wildCardError: false,
    });
  }

  handleEmailSubmit(e) {
    e.preventDefault();
    const { newEmail, confirmEmailPassword, emailValid, authenticatedUser, url, passwordValidUrl } = this.state;

    if (emailValid) {
      setLoadingCursor(true);
      axios.get(`${url}?email=${newEmail}`)
        .then((res) => {
          if(res.data.unique) {
            axios.post(passwordValidUrl, { username: authenticatedUser.username, password: confirmEmailPassword })
              .then((innerRes) => {
                if (innerRes.data.success) {
                  axios.put(this.state.url, { username: authenticatedUser.username, email: newEmail })
                    .then((userRes) => {
                      this.props.signInAction({
                        username: authenticatedUser.username,
                        password: confirmEmailPassword,
                      });
                      this.handleEmailReset();
                    })
                    .catch((err) => {
                      this.setState({ wildCardError: true });
                    })
                    .then(() => {
                      setLoadingCursor(false);
                    });
                } else {
                  this.setState({ wrongPasswordEmail: true });
                }
              })
              .catch((err) => {
                this.setState({ wildCardError: true });
              });
          } else {
            this.setState({ emailValid: 'error', showEmailPreviouslyUsed: true });
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

  handlePasswordSubmit(e) {
    e.preventDefault();
    const {
      newPassword,
      newPasswordRetype,
      confirmPasswordEdit,
      passwordValid,
      passwordsEqual,
      authenticatedUser,
      passwordValidUrl,
      url,
    } = this.state;

    if (passwordValid === 'success' && passwordsEqual === 'success') {
      setLoadingCursor(true);
      axios.post(passwordValidUrl, { username: authenticatedUser.username, password: confirmPasswordEdit })
        .then((res) => {
          if (res.data.success) {
            axios.put(url, { username: authenticatedUser.username, password: newPassword })
              .then((innerRes) => {
                this.handlePasswordReset();
              })
              .catch((err) => {
                this.setState({ wildCardError: true });
              });
          } else {
            this.setState({ wrongPasswordPassword: true });
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

  handlePrivateUserSubmit(e) {
    e.preventDefault();
    const { authenticatedUser, privateUser, url } = this.state;

    setLoadingCursor(true);
    axios.put(url, { username: authenticatedUser.username, private: privateUser })
      .then((res) => {
        setLoadingCursor(false);
        this.setState({ showPrivateUserSubmitSuccess: true });
      })
      .catch((err) => {
        setLoadingCursor(false);
      });
  }

  handleEmailReset(e) {
    if (e) {
      e.preventDefault();
      this.setState({
        newEmail: '',
        confirmEmailPassword: '',
        emailValid: null,
        showEmailNotValid: false,
        showEmailPreviouslyUsed: false,
        showEmailSubmitSuccess: false,
      });
    } else {
      this.setState({
        newEmail: '',
        confirmEmailPassword: '',
        emailValid: null,
        showEmailNotValid: false,
        showEmailPreviouslyUsed: false,
        showEmailSubmitSuccess: true,
      });
    }
  }

  handlePasswordReset(e) {
    if (e) {
      e.preventDefault();
      this.setState({
        newPassword: '',
        newPasswordRetype: '',
        confirmPasswordEdit: '',
        passwordValid: null,
        passwordsEqual: null,
        showPasswordNotValid: false,
        showPasswordSubmitSuccess: false,
        showPasswordsNotEqual: false,
      });
    } else {
      this.setState({
        newPassword: '',
        newPasswordRetype: '',
        confirmPasswordEdit: '',
        passwordValid: null,
        passwordsEqual: null,
        showPasswordNotValid: false,
        showPasswordSubmitSuccess: true,
        showPasswordsNotEqual: false,
      });
    }
  }

  getPasswordBtnDisable() {
    const { 
      newPassword,
      newPasswordRetype,
      confirmPasswordEdit,
      passwordValid,
      passwordsEqual,
    } = this.state;

    return (
      newPassword.length === 0 ||
      newPasswordRetype.length === 0 ||
      confirmPasswordEdit.length === 0 ||
      passwordValid === 'error' ||
      passwordsEqual === 'error');
  }

  getEmailBtnDisable() {
    const {
      newEmail,
      confirmEmailPassword,
      emailValid,
    } = this.state;

    return (
      newEmail.length === 0 ||
      confirmEmailPassword.length === 0 ||
      emailValid === 'error');
  }

  render() {
    const {
      authenticatedUser,
      usernameFromPath,
      newEmail,
      confirmEmailPassword,
      emailValid,
      newPassword,
      newPasswordRetype,
      confirmPasswordEdit,
      passwordValid,
      passwordsEqual,
      privateUser,
      showPasswordNotValid,
      showEmailNotValid,
      showEmailPreviouslyUsed,
      showEmailSubmitSuccess,
      showPasswordSubmitSuccess,
      showPasswordsNotEqual,
      showPrivateUserSubmitSuccess,
      wrongPasswordEmail,
      wrongPasswordPassword,
      wildCardError,
    } = this.state;
    console.log(this.state);
    return authenticatedUser.username === usernameFromPath ? (
      <Grid fluid>
        <Row className="show-grid">
          <Col lg={2} md={2} sm={2} xs={1} />
          <Col lg={5} md={5} sm={6} xs={10}>
            <h3>Hi, {authenticatedUser.username}!</h3>
            <p>
              Here you can change your password and email.
              You can also set your account to private or public.
              If your account is set to public, your username and collection will be visible to others.
            </p>
            {wildCardError &&
              <WildCardError />
            }
            <form onSubmit={this.handleEmailSubmit} onReset={this.handleEmailReset}>
              <DefaultFormGroup
                id="formControlsEmailPassword"
                name="confirmEmailPassword"
                value={confirmEmailPassword}
                type="password"
                label="Type your password to confirm email change:"
                placeholder="Password..."
                validationState={wrongPasswordEmail ? 'error' : null}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                autoComplete="new-password"
              />
              {wrongPasswordEmail &&
                <div className="text-danger">
                  {this.wrongPassword}
                </div>
              }
              <DefaultFormGroup
                id="formControlsEmail"
                name="newEmail"
                value={newEmail}
                type="email"
                label="New email address:"
                placeholder="Email..."
                validationState={emailValid}
                feedback={true}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                autoComplete="new-email"
              />
              <Button
                bsStyle="primary"
                type="submit"
                disabled={this.getEmailBtnDisable()}
                onFocus={this.handleFocus}>
                Change email
              </Button>
              <Button
                type="reset"
                disabled={newEmail.length === 0 && confirmEmailPassword.length === 0}
                onFocus={this.handleFocus}>
                Reset Fields
              </Button>
              {showEmailSubmitSuccess &&
                <div className="text-success">
                  Your email address was successfully changed.
                </div>
              }
              {showEmailNotValid &&
                <div className="text-danger">
                  The email does not contain an '@' or a '.'
                </div>
              }
              {showEmailPreviouslyUsed &&
                <div className="text-danger">
                  The email is registered by another user.
                </div>
              }
            </form>
            <form onSubmit={this.handlePasswordSubmit} onReset={this.handlePasswordReset}>
              <DefaultFormGroup
                id="formControlsPasswordConfirm"
                name="confirmPasswordEdit"
                value={confirmPasswordEdit}
                type="password"
                label="Type in your current password to confirm password edit:"
                placeholder="Password..."
                validationState={wrongPasswordPassword ? 'error' : null}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                autoComplete="new-password"
              />
              {wrongPasswordPassword &&
                <div className="text-danger">
                  {this.wrongPassword}
                </div>
              }
              <DefaultFormGroup
                id="formControlsPassword"
                name="newPassword"
                value={newPassword}
                type="password"
                label="New password:"
                placeholder="Password..."
                validationState={passwordValid}
                feedback={true}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                autoComplete="new-password"
              />
              {showPasswordNotValid &&
                <div className="text-danger">
                  {this.notValidText}
                </div>
              }
              <DefaultFormGroup
                id="formControlsPasswordRetype"
                name="newPasswordRetype"
                value={newPasswordRetype}
                type="password"
                label="Retype new password:"
                placeholder="Password..."
                feedback={true}
                validationState={passwordsEqual}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                autoComplete="new-password"
              />
              {showPasswordsNotEqual &&
                <div className="text-danger">
                  The passwords does not match.
                </div>
              }
              <Button
                bsStyle="primary"
                type="submit"
                disabled={this.getPasswordBtnDisable()}
                onFocus={this.handleFocus}>
                Change password
              </Button>
              <Button
                type="reset"
                disabled={
                    confirmPasswordEdit.length === 0 &&
                    newPassword.length === 0 &&
                    newPasswordRetype.length === 0}
                onFocus={this.handleFocus}>
                Reset Fields
              </Button>
              {showPasswordSubmitSuccess &&
                <div className="text-success">
                  Your password was successfully changed.
                </div>
              }
            </form>
            <form onSubmit={this.handlePrivateUserSubmit}>
              <ControlLabel>Toggle privacy settings for user profile:</ControlLabel>
              <Checkbox
                name="privateUserCheckbox"
                checked={privateUser}
                onChange={this.handleChange}
              >
                Uncheck this box to make your user profile public
              </Checkbox>
              <Button
                bsStyle="primary"
                type="submit"
                onFocus={this.handleFocus}
                >
                Confirm public/private change
              </Button>
              {showPrivateUserSubmitSuccess &&
                <div className="text-success">
                  Your privacy change was a success.
                </div>
              }
            </form>
            {wildCardError &&
              <WildCardError />
            }
          </Col>
          <Col lg={5} md={5} sm={4} xs={1} />
        </Row>
      </Grid>
    ) : (
      <Grid fluid>
          <Row className="show-grid">
            <Col lg={2} md={2} sm={2} xs={1} />
            <Col lg={5} md={5} sm={6} xs={10}>
              <UsernameNotMatching usernameFromPath={usernameFromPath} />
            </Col>
          <Col lg={5} md={5} sm={4} xs={1} />
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.authenticate.authenticated,
  authenticatedUser: state.authenticate.user,
});

const mapDispatchToProps = {
  signInAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
