import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import PasswordValidator from 'password-validator';
import {
  Button,
  ControlLabel,
  Checkbox,
} from 'react-bootstrap';
import DefaultFormGroup from '../Collection/FormComponents/DefaultFormGroup';
import { setLoadingCursor } from '../../util';
import WildCardError from '../CommonComponents/WildCardError';

export default class CurrentUserPage extends React.Component {
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

    this.wrongPassword = 'The password is wrong.';

    this.state = {
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
      publicUser: this.props.authenticatedUser && this.props.authenticatedUser.public !== undefined
        ? this.props.authenticatedUser.public
        : false,
      showPublicUserSubmitSuccess: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.handleEmailReset = this.handleEmailReset.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.handlePasswordReset = this.handlePasswordReset.bind(this);
    this.handlePublicUserSubmit = this.handlePublicUserSubmit.bind(this);
    this.getEmailValid = this.getEmailValid.bind(this);
    this.getPasswordValid = this.getPasswordValid.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.getEmailBtnDisable = this.getEmailBtnDisable.bind(this);
    this.getPasswordBtnDisable = this.getPasswordBtnDisable.bind(this);
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

  getEmailBtnDisable() {
    const {
      newEmail,
      confirmEmailPassword,
      emailValid,
    } = this.state;

    return (
      newEmail.length === 0
      || confirmEmailPassword.length === 0
      || emailValid === 'error');
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
      newPassword.length === 0
      || newPasswordRetype.length === 0
      || confirmPasswordEdit.length === 0
      || passwordValid === 'error'
      || passwordsEqual === 'error');
  }

  handleEmailSubmit(e) {
    e.preventDefault();
    const { newEmail, confirmEmailPassword, emailValid } = this.state;
    const { url, passwordValidUrl, authenticatedUser } = this.props;

    if (emailValid) {
      setLoadingCursor(true);
      axios.get(`${url}?email=${newEmail}`)
        .then((res) => {
          if (res.data.unique) {
            axios.post(passwordValidUrl, { username: authenticatedUser.username, password: confirmEmailPassword })
              .then((innerRes) => {
                if (innerRes.data.success) {
                  axios.put(url, { username: authenticatedUser.username, email: newEmail })
                    .then(() => {
                      this.props.signInAction({
                        username: authenticatedUser.username,
                        password: confirmEmailPassword,
                      });
                      this.handleEmailReset();
                    })
                    .catch(() => {
                      this.setState({ wildCardError: true });
                    })
                    .then(() => {
                      setLoadingCursor(false);
                    });
                } else {
                  this.setState({ wrongPasswordEmail: true });
                }
              })
              .catch(() => {
                this.setState({ wildCardError: true });
              });
          } else {
            this.setState({ emailValid: 'error', showEmailPreviouslyUsed: true });
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

  handlePasswordSubmit(e) {
    e.preventDefault();
    const {
      newPassword,
      confirmPasswordEdit,
      passwordValid,
      passwordsEqual,
    } = this.state;
    const { authenticatedUser, passwordValidUrl, url } = this.props;

    if (passwordValid === 'success' && passwordsEqual === 'success') {
      setLoadingCursor(true);
      axios.post(passwordValidUrl, { username: authenticatedUser.username, password: confirmPasswordEdit })
        .then((res) => {
          if (res.data.success) {
            axios.put(url, { username: authenticatedUser.username, password: newPassword })
              .then(() => {
                this.handlePasswordReset();
              })
              .catch(() => {
                this.setState({ wildCardError: true });
              });
          } else {
            this.setState({ wrongPasswordPassword: true });
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

  handlePublicUserSubmit(e) {
    e.preventDefault();
    const { publicUser } = this.state;
    const { authenticatedUser, url } = this.props;

    setLoadingCursor(true);
    axios.put(url, { username: authenticatedUser.username, public: publicUser })
      .then(() => {
        this.setState({ showPublicUserSubmitSuccess: true });
      })
      .catch(() => {
        this.setState({ wildCardError: true });
      })
      .then(() => {
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

  handleChange(e) {
    if (e.target.name !== 'publicUserCheckbox') e.preventDefault();
    const { name, value } = e.target;
    const { newPassword } = this.state;
    let {
      passwordValid, publicUser, emailValid, showEmailPreviouslyUsed, passwordsEqual,
    } = this.state;

    if (name === 'newPassword') {
      passwordValid = this.getPasswordValid(value);
    } else if (name === 'publicUserCheckbox') {
      publicUser = !publicUser;
    } else if (name === 'newEmail') {
      emailValid = this.getEmailValid(value);
      showEmailPreviouslyUsed = false;
    } else if (name === 'newPasswordRetype') {
      passwordsEqual = newPassword === value ? 'success' : 'error';
    }

    this.setState({
      [name]: value,
      passwordValid,
      publicUser,
      emailValid,
      showEmailPreviouslyUsed,
      passwordsEqual,
      showEmailSubmitSuccess: false,
      showPasswordSubmitSuccess: false,
      showPublicUserSubmitSuccess: false,
      showEmailNotValid: false,
      showPasswordsNotEqual: false,
      showPasswordNotValid: false,
      wrongPasswordEmail: false,
      wrongPasswordPassword: false,
      wildCardError: false,
    });
  }

  handleFocus(e) {
    e.preventDefault();
    const { name } = e.target;
    const {
      newPassword, newPasswordRetype, passwordValid, emailValid,
    } = this.state;
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

  render() {
    const {
      newEmail,
      confirmEmailPassword,
      emailValid,
      newPassword,
      newPasswordRetype,
      confirmPasswordEdit,
      passwordValid,
      passwordsEqual,
      publicUser,
      showPasswordNotValid,
      showEmailNotValid,
      showEmailPreviouslyUsed,
      showEmailSubmitSuccess,
      showPasswordSubmitSuccess,
      showPasswordsNotEqual,
      showPublicUserSubmitSuccess,
      wrongPasswordEmail,
      wrongPasswordPassword,
      wildCardError,
    } = this.state;
    const { authenticatedUser } = this.props;
    return (
      <div>
        <h3>
          Hi,
          {authenticatedUser.username}
          !
        </h3>
        <p>
          Here you can change your password and email.
          You can also set your account to private or public.
          If your account is set to public, your username and collection will be visible to others.
        </p>
        {wildCardError
          && <WildCardError />}
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
          {wrongPasswordEmail
            && (
            <div className="text-danger">
              {this.wrongPassword}
            </div>
            )}
          <DefaultFormGroup
            id="formControlsEmail"
            name="newEmail"
            value={newEmail}
            type="email"
            label="New email address:"
            placeholder="Email..."
            validationState={emailValid}
            feedback
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            autoComplete="new-email"
          />
          <Button
            bsStyle="primary"
            type="submit"
            disabled={this.getEmailBtnDisable()}
            onFocus={this.handleFocus}
          >
            Change email
          </Button>
          <Button
            type="reset"
            disabled={newEmail.length === 0 && confirmEmailPassword.length === 0}
            onFocus={this.handleFocus}
          >
            Reset Fields
          </Button>
          {showEmailSubmitSuccess
            && (
            <div className="text-success">
              Your email address was successfully changed.
            </div>
            )}
          {showEmailNotValid
            && (
            <div className="text-danger">
              The email does not contain an &apos;@&apos; or a &apos;.&apos;
            </div>
            )}
          {showEmailPreviouslyUsed
            && (
            <div className="text-danger">
              The email is registered by another user.
            </div>
            )}
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
          {wrongPasswordPassword
            && (
            <div className="text-danger">
              {this.wrongPassword}
            </div>
            )}
          <DefaultFormGroup
            id="formControlsPassword"
            name="newPassword"
            value={newPassword}
            type="password"
            label="New password:"
            placeholder="Password..."
            validationState={passwordValid}
            feedback
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            autoComplete="new-password"
          />
          {showPasswordNotValid
            && (
            <div className="text-danger">
              {this.notValidText}
            </div>
            )}
          <DefaultFormGroup
            id="formControlsPasswordRetype"
            name="newPasswordRetype"
            value={newPasswordRetype}
            type="password"
            label="Retype new password:"
            placeholder="Password..."
            feedback
            validationState={passwordsEqual}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            autoComplete="new-password"
          />
          {showPasswordsNotEqual
            && (
            <div className="text-danger">
              The passwords does not match.
            </div>
            )}
          <Button
            bsStyle="primary"
            type="submit"
            disabled={this.getPasswordBtnDisable()}
            onFocus={this.handleFocus}
          >
            Change password
          </Button>
          <Button
            type="reset"
            disabled={
                confirmPasswordEdit.length === 0
                && newPassword.length === 0
                && newPasswordRetype.length === 0
}
            onFocus={this.handleFocus}
          >
            Reset Fields
          </Button>
          {showPasswordSubmitSuccess
            && (
            <div className="text-success">
              Your password was successfully changed.
            </div>
            )}
        </form>
        <form onSubmit={this.handlePublicUserSubmit}>
          <ControlLabel>Toggle privacy settings for user profile:</ControlLabel>
          <Checkbox
            name="publicUserCheckbox"
            checked={publicUser}
            onChange={this.handleChange}
          >
            Check this box to make your user profile public
          </Checkbox>
          <Button
            bsStyle="primary"
            type="submit"
            onFocus={this.handleFocus}
          >
            Confirm public/private change
          </Button>
          {showPublicUserSubmitSuccess
            && (
            <div className="text-success">
              Your privacy change was a success.
            </div>
            )}
        </form>
        {wildCardError
          && <WildCardError />}
      </div>
    );
  }
}

CurrentUserPage.propTypes = {
  url: PropTypes.string.isRequired,
  passwordValidUrl: PropTypes.string.isRequired,
  authenticatedUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    public: PropTypes.bool.isRequired,
  }).isRequired,
  signInAction: PropTypes.func.isRequired,
};
