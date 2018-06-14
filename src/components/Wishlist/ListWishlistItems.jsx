/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup, Panel, Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { getWishlist, resetWishlist } from '../../actions';
import { getWishlistBySearch } from '../../selectors/wishlist';
import AddToWishlist from './AddToWishlist';

const EmptyWishlist = ({ publicUsername, wishlistHasEntries }) => (
  <div className="text-center lead">
    {wishlistHasEntries ?
      'The search and/or filter doesn\'t match any records'
      :
      `${publicUsername ? 'The' : 'Your'} wishlist is empty.`
    }
  </div>
);

EmptyWishlist.propTypes = {
  publicUsername: PropTypes.string,
  wishlistHasEntries: PropTypes.bool.isRequired,
};

EmptyWishlist.defaultProps = {
  publicUsername: null,
};

class ListWishlistItems extends React.Component {
  constructor(props) {
    super(props);

    this.loadWishlist = this.loadWishlist.bind(this);
    this.addRecordToWishlist = this.addRecordToWishlist.bind(this);
    this.removeRecordFromWishList = this.removeRecordFromWishList.bind(this);
    this.getWishlistItems = this.getWishlistItems.bind(this);
  }

  componentWillMount() {
    this.loadWishlist();
  }

  getWishlistItems() {
    return this.props.wishlist.map(record => (
      <div>
        {record.title}
        {record.artist}
      </div>));
  }

  addRecordToWishlist(record) {
    return axios.post(this.props.url, record);
  }

  removeRecordFromWishList(record) {
    return axios.delete(`${this.props.url}?_id=${record._id}`);
  }

  loadWishlist() {
    const { authenticatedUser } = this.props;
    if (authenticatedUser && authenticatedUser.username) {
      this.props.getWishlist(authenticatedUser.username);
    } else {
      this.props.resetWishlist();
    }
  }

  render() {
    const wishlistItems = this.getWishlistItems();
    const { wishlistHasEntries, authenticatedUser } = this.props;

    return (
      <Grid fluid>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <Panel>
              <Panel.Body>
                <AddToWishlist
                  addRecordToWishlist={this.addRecordToWishlist}
                  loadWishlist={this.loadWishlist}
                  authenticatedUsername={authenticatedUser.username}
                />
              </Panel.Body>
              {wishlistItems.length !== 0 ? (
                <div>
                  <ListGroup componentClass="ul">
                    { wishlistItems }
                  </ListGroup>
                </div>
                ) : (<EmptyWishlist wishlistHasEntries={wishlistHasEntries} />)}
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

/* eslint react/forbid-prop-types:[0] */
ListWishlistItems.propTypes = {
  url: PropTypes.string.isRequired,
  wishlist: PropTypes.array.isRequired,
  getWishlist: PropTypes.func.isRequired,
  resetWishlist: PropTypes.func.isRequired,
  authenticatedUser: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
  }),
  wishlistHasEntries: PropTypes.bool.isRequired,
};

ListWishlistItems.defaultProps = {
  authenticatedUser: {
    username: '',
    email: '',
  },
};

const mapStateToProps = state => ({
  wishlist: getWishlistBySearch(state),
  wishlistHasEntries: state.collection.wishlist ? Object.keys(state.wishlist).length > 1 : false,
  authenticatedUser: state.authenticate.user,
});

const mapDispatchToProps = {
  getWishlist,
  resetWishlist,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListWishlistItems);
