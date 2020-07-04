import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import ListItems from '../components/Collection/ListItems';
import Filter from '../components/Filter/Filter';
import SignInJumbotron from '../components/CommonComponents/SignInJumbotron';
import Suggestions from '../components/Suggestions/Suggestions';
import { getWishlist, resetWishlist } from '../actions';

class Collection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      url: 'http://localhost:8080/api/records',
    };
  }

  componentDidUpdate() {
    const {
      authenticatedUser, wishlist, ...props
    } = this.props;

    if (authenticatedUser && authenticatedUser.username) {
      if (wishlist.length === 0) props.getWishlist(authenticatedUser.username);
    } else {
      if (wishlist.length > 0) props.resetWishlist();
    }
  }

  render() {
    const { url } = this.state;
    const {
      authenticated, records, wishlist,
    } = this.props;

    return (
      <div>
        <Container fluid>
          <Row className="show-grid">
            <Col xl={1} lg={0} md={0} sm={0} xs={0} />
            <Col xl={2} lg={3} md={12} sm={12} xs={12}>
              {authenticated
                && <Filter />}
            </Col>
            <Col xl={6} lg={6} md={12} sm={12} xs={12}>
              {authenticated
                && <ListItems url={url} />}
              {!authenticated
                && <SignInJumbotron />}
            </Col>
            <Col className="no-padding-left" xl={2} lg={3} md={12} sm={12} xs={12}>
              {authenticated
                && (
                <Suggestions
                  records={records}
                  wishlist={wishlist}
                />
                )}
            </Col>
            <Col xl={1} lg={0} md={0} sm={0} xs={0} />
          </Row>
        </Container>
      </div>
    );
  }
}

Collection.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  authenticatedUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    public: PropTypes.bool.isRequired,
  }).isRequired,
  /* eslint-disable react/forbid-prop-types */
  records: PropTypes.array.isRequired,
  wishlist: PropTypes.array.isRequired,
  /* eslint-enable react/forbid-prop-types */
  getWishlist: PropTypes.func.isRequired,
  resetWishlist: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  getWishlist,
  resetWishlist,
};

const mapStateToProps = (state) => ({
  authenticated: state.authenticate.authenticated || false,
  authenticatedUser: state.authenticate.user || { username: '', email: '', public: false },
  records: state.collection.records || [],
  wishlist: state.wishlist,
});

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
