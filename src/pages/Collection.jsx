import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Grid, Row, Jumbotron, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import ListItems from '../components/Collection/ListItems';
import Filter from '../components/Filter/Filter';
import { getCollection, resetCollection } from '../actions';
import { getRecordsBySearchAndFilter } from '../selectors/collection';

class Collection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:8080/api/records',
      signinButton: false,
      registerButton: false,
      sortMode: { date: -1 },
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSortMode = this.handleSortMode.bind(this);
    this.loadCollection = this.loadCollection.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    const { name } = e.target;

    this.setState({ [name]: true });
  }

  handleSortMode(key) {
    const possibleSortModes = {
      newest: { date: -1 },
      oldest: { date: 1 },
      albumDesc: { title: 1 },
      albumAsc: { title: -1 },
      artistDesc: { artist: 1 },
      artistAsc: { artist: -1 },
    };

    const sortMode = possibleSortModes[key];
    this.setState({ sortMode });
  }

  loadCollection(publicUsername) {
    const { authenticatedUser } = this.props;
    if (authenticatedUser && authenticatedUser.username && !publicUsername) {
      this.props.getCollection(authenticatedUser.username, this.state.sortMode);
    } else if (publicUsername) {
      this.props.getCollection(publicUsername, this.state.sortMode);
    } else {
      this.props.resetCollection();
    }
  }

  render() {
    const { signinButton, registerButton, url, sortMode } = this.state;
    const { authenticated, authenticatedUser, records } = this.props;

    if (signinButton) {
      return (<Redirect to="/signin" push />);
    } else if (registerButton) {
      return (<Redirect to="/register" push />);
    }
    return (
      <div>
        <Grid fluid>
          <Row className="show-grid">
            <Col lg={2} md={2}>
              {authenticated &&
                <Filter />}
            </Col>
            <Col lg={8} md={8} sm={12} xs={12}>
              {authenticated &&
                <ListItems
                  url={url}
                  sortMode={sortMode}
                  authenticatedUser={authenticatedUser}
                  records={records}
                  handleSortMode={this.handleSortMode}
                  loadCollection={this.loadCollection}
                />
              }
              {!authenticated &&
                <Jumbotron>
                  <h1>You have not signed in!</h1>
                  <p>
                    To view a collection on this page, you need to {<Link href="#" to="/signin">sign in</Link>} first.
                    If you don&apos;t have a user yet, you can {<Link href="#" to="/register">register here.</Link>}
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
              }
            </Col>
            <Col lg={2} md={2} />
          </Row>
        </Grid>
      </div>
    );
  }
}

Collection.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  records: getRecordsBySearchAndFilter(state),
  authenticated: state.authenticate.authenticated || false,
  authenticatedUser: state.authenticate.user,
});

const mapDispatchToProps = {
  getCollection,
  resetCollection,
};

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
