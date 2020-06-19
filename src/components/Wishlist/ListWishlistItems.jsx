/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ListGroup, Panel, Grid, Row, Col,
} from 'react-bootstrap';
import axios from 'axios';
import { getWishlist, resetWishlist } from '../../actions';
import { getWishlistBySearchAndFilter } from '../../selectors/wishlist';
import AddToWishlist from './AddToWishlist';
import WishlistItem from './WishlistItem';
import SearchField from '../CommonComponents/SearchField';

const EmptyWishlist = ({ wishlistHasEntries }) => (
  <div className="text-center lead">
    {wishlistHasEntries
      ? 'The search and/or filter doesn\'t match any records'
      : 'Your wishlist is empty.'}
  </div>
);

EmptyWishlist.propTypes = {
  wishlistHasEntries: PropTypes.bool.isRequired,
};

class ListWishlistItems extends React.Component {
  constructor(props) {
    super(props);

    this.loadWishlist = this.loadWishlist.bind(this);
    this.addRecordToWishlist = this.addRecordToWishlist.bind(this);
    this.addRecordToCollection = this.addRecordToCollection.bind(this);
    this.removeRecordFromWishlist = this.removeRecordFromWishlist.bind(this);
    this.getWishlistItems = this.getWishlistItems.bind(this);
  }

  componentDidMount() {
    this.loadWishlist();
  }

  getWishlistItems() {
    const { wishlist } = this.props;
    return wishlist.map((record) => (
      <WishlistItem
        record={record}
        key={record._id}
        handleDelete={this.removeRecordFromWishlist}
        loadWishlist={this.loadWishlist}
        addRecordToCollection={this.addRecordToCollection}
      />
    ));
  }

  addRecordToCollection(record) {
    const { authenticatedUser, recordUrl } = this.props;

    record.append('username', authenticatedUser.username);
    return axios.post(recordUrl, record);
  }

  addRecordToWishlist(record) {
    const { url } = this.props;

    return axios.post(url, record);
  }

  removeRecordFromWishlist(record) {
    const { url } = this.props;

    return axios.delete(`${url}?_id=${record._id}`);
  }

  loadWishlist() {
    const { authenticatedUser, ...props } = this.props;
    if (authenticatedUser && authenticatedUser.username) {
      props.getWishlist(authenticatedUser.username);
    } else {
      props.resetWishlist();
    }
  }

  render() {
    const wishlistItems = this.getWishlistItems();
    const { wishlistHasEntries, authenticatedUser } = this.props;

    return (
      <Grid fluid>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12} className="margin-bottom">
            <SearchField wishlist />
          </Col>
        </Row>
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
  recordUrl: PropTypes.string.isRequired,
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

const mapStateToProps = (state) => ({
  wishlist: getWishlistBySearchAndFilter(state),
  wishlistHasEntries: state.wishlist ? Object.keys(state.wishlist).length > 1 : false,
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
