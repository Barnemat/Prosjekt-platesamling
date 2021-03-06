import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Button, Col, Container, Row, ListGroup, ListGroupItem,
} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import DefaultFormGroup from '../components/Collection/FormComponents/DefaultFormGroup';
import WildCardError from '../components/CommonComponents/WildCardError';
import UserItem from '../components/FindUser/UserItem';
import { setLoadingCursor } from '../util';

class FindUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:8080/api/allMatchingUsers',
      searchField: props.location.search.substr(1),
      showWildCardError: false,
      users: [],
      gotoUserPage: false,
      currentUsername: '',
      searchAtLastSubmit: '',
    };

    this.initialSearchField = props.location.search.substr(1);

    this.getUserItems = this.getUserItems.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { searchField, users } = this.state;

    if (users.length === 0 && this.initialSearchField === searchField && searchField.length > 0) {
      this.handleSubmit();
    }
  }

  getUserItems() {
    const { users } = this.state;
    const { authenticatedUser } = this.props;
    return users.map((user) => (
      <UserItem
        key={user.username}
        username={user.username}
        isPublic={user.public}
        usernamesEqual={authenticatedUser.username === user.username}
        handleClick={this.handleClick}
      />
    ));
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value, showWildCardError: false, searchAtLastSubmit: '' });
  }

  handleClick(e, username) {
    e.preventDefault();
    const { name } = e.target;

    this.setState({ [name]: true, currentUsername: username, showWildCardError: false });
  }

  handleSubmit(e) {
    if (e) e.preventDefault();
    const { url, searchField } = this.state;
    const { history, location } = this.props;
    const { pathname } = location;

    setLoadingCursor(true);
    history.replace(`${pathname}?${searchField}`);
    axios.get(`${url}?username=${searchField}`)
      .then((res) => {
        this.setState({ users: res.data, searchAtLastSubmit: searchField });
      })
      .catch(() => {
        this.setState({ showWildCardError: true, searchAtLastSubmit: searchField });
      })
      .then(() => {
        setLoadingCursor(false);
      });
  }

  render() {
    const {
      searchField, gotoUserPage, currentUsername, showWildCardError, searchAtLastSubmit,
    } = this.state;
    const userItems = searchField.length > 0 ? this.getUserItems() : [];

    return gotoUserPage ? (<Redirect to={`/user/${currentUsername}`} push />) : (
      <Container fluid>
        <Row className="show-grid">
          <Col lg={2} md={2} />
          <Col lg={8} md={8} sm={12} xs={12}>
            <Container fluid>
              <Row>
                <Col lg={12} md={12} sm={12} xs={12} className="mb-3">
                  {showWildCardError && <WildCardError />}
                  <form onSubmit={this.handleSubmit}>
                    <DefaultFormGroup
                      controlId="formControlsUsername"
                      name="searchField"
                      value={searchField}
                      type="text"
                      label="Find users by username:"
                      placeholder="Username..."
                      onChange={this.handleChange}
                    />
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={searchField.length === 0}
                    >
                      Find users
                    </Button>
                  </form>
                </Col>
              </Row>
              {(searchAtLastSubmit.length > 0 || userItems.length > 0)
                && (
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12}>
                    <ListGroup as="ul">
                      {userItems.length > 0 ? userItems : (
                        <ListGroupItem>
                          <strong>{`The search "${searchAtLastSubmit}" does not match any users...`}</strong>
                        </ListGroupItem>
                      )}
                    </ListGroup>
                  </Col>
                </Row>
                )}
            </Container>
          </Col>
          <Col lg={2} md={2} />
        </Row>
      </Container>
    );
  }
}

FindUser.propTypes = {
  location: PropTypes.shape({
    hash: PropTypes.string,
    key: PropTypes.string,
    pathname: PropTypes.string,
    search: PropTypes.string,
    state: PropTypes.shape({}),
  }).isRequired,
  authenticatedUser: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
    public: PropTypes.bool,
  }),
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

FindUser.defaultProps = {
  authenticatedUser: {
    username: '',
    email: '',
    public: false,
  },
};

const mapStateToProps = (state) => ({
  authenticatedUser: state.authenticate.user,
});

export default connect(mapStateToProps)(FindUser);
