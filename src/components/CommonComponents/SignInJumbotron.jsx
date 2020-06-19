import React from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';

export default class SignInJumbotron extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signinButton: false,
      registerButton: false,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    const { name } = e.target;

    this.setState({ [name]: true });
  }

  render() {
    const {
      signinButton, registerButton,
    } = this.state;

    if (signinButton) {
      return (<Redirect to="/signin" push />);
    } if (registerButton) {
      return (<Redirect to="/register" push />);
    }

    return (
      <Jumbotron>
        <h1>You have not signed in!</h1>
        <p>
          To view a collection on this page, you need to
          {' '}
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          {<Link href="#" to="/signin">sign in</Link>}
          {' '}
          first.
          If you don&apos;t have a user yet, you can
          {' '}
          {<Link href="#" to="/register">register here.</Link>}
          {/* eslint-enable jsx-a11y/anchor-is-valid */}
        </p>
        <p>
          <Button
            bsStyle="primary"
            name="signinButton"
            onClick={this.handleClick}
          >
            Sign in
          </Button>
          {' '}
          <Button
            bsStyle="primary"
            name="registerButton"
            onClick={this.handleClick}
          >
            Register
          </Button>
        </p>
      </Jumbotron>
    );
  }
}
