import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Grid, Row, Jumbotron, Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import ListItems from '../components/Collection/ListItems';
import Filter from '../components/Filter/Filter';

class Collection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:8080/api/records',
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
      signinButton, registerButton, url,
    } = this.state;
    const { authenticated } = this.props;

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
                <ListItems url={url} />
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
  authenticated: state.authenticate.authenticated || false,
});

export default connect(mapStateToProps)(Collection);
