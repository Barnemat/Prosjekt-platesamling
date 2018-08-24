import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Grid, Row } from 'react-bootstrap';
import ListItems from '../components/Collection/ListItems';
import Filter from '../components/Filter/Filter';
import SignInJumbotron from '../components/CommonComponents/SignInJumbotron';
import Suggestions from '../components/Suggestions/Suggestions';
import { setSuggestions, getWishlist, resetWishlist } from '../actions';

class Collection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:8080/api/records',
    };
  }

  componentWillMount() {
    const {
      authenticatedUser, getWishlist, resetWishlist,
    } = this.props;
    if (authenticatedUser && authenticatedUser.username) {
      getWishlist(authenticatedUser.username);
    } else {
      resetWishlist();
    }
  }

  /*static getDerivedStateFromProps(nextProps, prevState) {
    console.log(prevState.records, nextProps.records, nextProps.suggestions);
    if (prevState.records !== nextProps.records && nextProps.records && nextProps.suggestions.length === 0) {
      console.log('suggestions')
      setSuggestions(nextProps.records);
      return { records: nextProps.records };
    }
    return {};
  }*/

  /*componentDidMount() {
    const { records, suggestions, setSuggestions } = this.props;
    console.log(records);
    console.log(suggestions);
    if (records && !suggestions) {
      console.log('asdasd')
      setSuggestions(records);
    }
  }*/

  componentDidUpdate() {
    const { records, suggestions, wishlist, setSuggestions } = this.props;
    if (records && suggestions.length === 0) {
      setSuggestions(records, wishlist);
    }
  }

  render() {
    const { url } = this.state;
    const { authenticated } = this.props;

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
                <SignInJumbotron />
              }
            </Col>
            <Col lg={2} md={2}>
              {authenticated &&
                <Suggestions />}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Collection.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  setSuggestions,
  getWishlist,
  resetWishlist,
};

const mapStateToProps = state => ({
  authenticated: state.authenticate.authenticated || false,
  authenticatedUser: state.authenticate.user,
  records: state.collection.records,
  wishlist: state.wishlist,
  suggestions: state.suggestions.suggestions,
});

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
