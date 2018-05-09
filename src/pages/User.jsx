import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Grid,
  Col,
  Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { signInAction } from '../actions';
import WildCardError from '../components/CommonComponents/WildCardError';
import CurrentUserPage from '../components/User/CurrentUserPage';
import PublicUserPage from '../components/User/PublicUserPage';

const UsernameNotMatching = ({ usernameFromPath, usernameFromPathExists }) => (
  <div>
    {usernameFromPathExists &&
    <span>The user <strong>{ usernameFromPath }</strong> has an account set to private.</span>
  }
    {!usernameFromPathExists &&
    <span>The user <strong>{ usernameFromPath }</strong> does not exist.</span>
    /* Maybe redirect to a 404 page later */
  }
    <div>
      <Link to="/">Return to front page</Link>
    </div>
  </div>
);

UsernameNotMatching.propTypes = {
  usernameFromPath: PropTypes.string.isRequired,
  usernameFromPathExists: PropTypes.bool.isRequired,
};

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:8080/api/user',
      passwordValidUrl: 'http://localhost:8080/api/validPassword',
      authenticatedUser: this.props.authenticatedUser || { username: '', email: '', private: true },
      usernameFromPath: this.props.match.params.username,
      usernameFromPathExists: false,
      usernameFromPathPrivate: true,
      showWildCardError: false,
    };

    this.getUserFromPathExistsAndPrivate = this.getUserFromPathExistsAndPrivate.bind(this);
  }

  componentWillMount() {
    this.getUserFromPathExistsAndPrivate();
  }

  getUserFromPathExistsAndPrivate() {
    const { url, usernameFromPath } = this.state;
    axios.get(`${url}?username=${usernameFromPath}`)
      .then((res) => {
        const { user } = res.data;
        if (user.username) {
          this.setState({ usernameFromPathExists: true, usernameFromPathPrivate: user.private });
        }
      })
      .catch(() => {
        this.setState({ showWildCardError: true });
      });
  }

  render() {
    const {
      authenticatedUser,
      url,
      passwordValidUrl,
      usernameFromPath,
      usernameFromPathExists,
      usernameFromPathPrivate,
      showWildCardError,
    } = this.state;

    return authenticatedUser.username === usernameFromPath ? (
      <Grid fluid>
        <Row className="show-grid">
          <Col lg={2} md={2} sm={2} xs={1} />
          <Col lg={5} md={5} sm={6} xs={10}>
            <CurrentUserPage
              url={url}
              passwordValidUrl={passwordValidUrl}
              authenticatedUser={authenticatedUser}
              signInAction={this.props.signInAction}
            />
          </Col>
          <Col lg={5} md={5} sm={4} xs={1} />
        </Row>
      </Grid>
    ) : (
      <Grid fluid>
        <Row className="show-grid">
          <Col lg={2} md={2} />
          <Col lg={8} md={8} sm={12} xs={12}>
            {showWildCardError && <WildCardError />}
            {usernameFromPathPrivate &&
            <UsernameNotMatching
              usernameFromPath={usernameFromPath}
              usernameFromPathExists={usernameFromPathExists}
            />
              }
            {usernameFromPathExists && !usernameFromPathPrivate &&
            <PublicUserPage
              url={url}
              usernameFromPath={usernameFromPath}
            />
              }
          </Col>
          <Col lg={2} md={2} />
        </Row>
      </Grid>
    );
  }
}

User.propTypes = {
  authenticatedUser: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    private: PropTypes.bool,
  }),
  signInAction: PropTypes.func.isRequired,
  match: PropTypes.shape({
    isExact: PropTypes.bool,
    params: PropTypes.shape({
      username: PropTypes.string,
    }),
    path: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
};

User.defaultProps = {
  authenticatedUser: {
    username: '',
    email: '',
    private: true,
  },

};

const mapStateToProps = state => ({
  authenticated: state.authenticate.authenticated,
  authenticatedUser: state.authenticate.user,
});

const mapDispatchToProps = {
  signInAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
