import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Col,
  Row,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { signInAction, authenticatedAction } from '../actions';
import WildCardError from '../components/CommonComponents/WildCardError';
import CurrentUserPage from '../components/User/CurrentUserPage';
import PublicUserPage from '../components/User/PublicUserPage';
import PageNotFound from './PageNotFound';
import Filter from '../components/Filter/Filter';

const UsernameNotMatching = ({ usernameFromPath, usernameFromPathExists }) => (
  !usernameFromPathExists ? (<PageNotFound />) : (
    <div>
      {usernameFromPathExists
        && (
        <span>
          The user
          <strong>{ usernameFromPath }</strong>
          {' '}
          has an account set to private.
        </span>
        )}
      <div>
        <Link to="/">Return to front page</Link>
      </div>
    </div>
  )
);

UsernameNotMatching.propTypes = {
  usernameFromPath: PropTypes.string.isRequired,
  usernameFromPathExists: PropTypes.bool.isRequired,
};

class User extends React.Component {
  constructor(props) {
    super(props);

    const { authenticatedUser, match } = this.props;

    this.state = {
      url: 'http://localhost:8080/api/user',
      passwordValidUrl: 'http://localhost:8080/api/validPassword',
      authenticatedUser: authenticatedUser || { username: '', email: '', public: false },
      usernameFromPath: match.params.username,
      usernameFromPathExists: false,
      existCheckRun: false,
      usernameFromPathPublic: false,
      showWildCardError: false,
    };

    this.setUserFromPathExistsAndPublic = this.setUserFromPathExistsAndPublic.bind(this);
  }

  componentDidMount() {
    this.setUserFromPathExistsAndPublic();
  }

  setUserFromPathExistsAndPublic() {
    const { url, usernameFromPath } = this.state;
    axios.get(`${url}?username=${usernameFromPath}`)
      .then((res) => {
        const { user } = res.data;
        if (user.username) {
          this.setState({ usernameFromPathExists: true, usernameFromPathPublic: user.public, existCheckRun: true });
        } else {
          this.setState({ existCheckRun: true });
        }
      })
      .catch(() => {
        this.setState({ showWildCardError: true, existCheckRun: true });
      });
  }

  render() {
    const {
      authenticatedUser,
      url,
      passwordValidUrl,
      usernameFromPath,
      usernameFromPathExists,
      usernameFromPathPublic,
      showWildCardError,
      existCheckRun,
    } = this.state;

    const { ...props } = this.props;

    return authenticatedUser.username === usernameFromPath ? (
      <Container fluid>
        <Row className="show-grid">
          <Col lg={2} md={2} sm={2} xs={1} />
          <Col lg={5} md={5} sm={6} xs={10}>
            <CurrentUserPage
              url={url}
              passwordValidUrl={passwordValidUrl}
              authenticatedUser={authenticatedUser}
              signInAction={props.signInAction}
              authenticatedAction={props.authenticatedAction}
            />
          </Col>
          <Col lg={5} md={5} sm={4} xs={1} />
        </Row>
      </Container>
    ) : (
      <Container fluid>
        <Row className="show-grid">
          <Col lg={2} md={2}>
            {usernameFromPathExists && usernameFromPathPublic
              && <Filter />}
          </Col>
          <Col lg={8} md={8} sm={12} xs={12}>
            {showWildCardError && <WildCardError />}
            {!usernameFromPathPublic && existCheckRun
              && (
              <UsernameNotMatching
                usernameFromPath={usernameFromPath}
                usernameFromPathExists={usernameFromPathExists}
              />
              )}
            {usernameFromPathExists && usernameFromPathPublic
              && (
              <PublicUserPage
                url={url}
                usernameFromPath={usernameFromPath}
              />
              )}
          </Col>
          <Col lg={2} md={2} />
        </Row>
      </Container>
    );
  }
}

User.propTypes = {
  authenticatedUser: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    public: PropTypes.bool,
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
    public: false,
  },
};

const mapStateToProps = (state) => ({
  authenticated: state.authenticate.authenticated,
  authenticatedUser: state.authenticate.user,
});

const mapDispatchToProps = {
  signInAction,
  authenticatedAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
