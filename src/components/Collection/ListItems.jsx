/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ListGroup, Panel, Grid, Row, Col,
} from 'react-bootstrap';
import axios from 'axios';
import AddOrEditRecord from './AddOrEditRecord';
import RecordItem from './RecordItem';
import SortModes from './SortModes';
import { sortArrayOfObjects, getOwnershipFormat } from '../../util';
import { getCollection, resetCollection } from '../../actions';
import { getRecordsBySearchAndFilter } from '../../selectors/collection';

const EmptyCollection = ({ publicUsername, collectionHasEntries }) => (
  <div className="text-center lead">
    {collectionHasEntries
      ? 'The search and/or filter doesn\'t match any records'
      : `${publicUsername ? 'The' : 'Your'} collection is empty.`}
  </div>
);

EmptyCollection.propTypes = {
  publicUsername: PropTypes.string,
  collectionHasEntries: PropTypes.bool.isRequired,
};

EmptyCollection.defaultProps = {
  publicUsername: null,
};

class ListItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortMode: { date: -1 },
      galleryView: false,
    };

    this.loadCollection = this.loadCollection.bind(this);
    this.addRecordToCollection = this.addRecordToCollection.bind(this);
    this.removeRecordFromCollection = this.removeRecordFromCollection.bind(this);
    this.editRecordInCollection = this.editRecordInCollection.bind(this);
    this.handleSortMode = this.handleSortMode.bind(this);
    this.handleGalleryView = this.handleGalleryView.bind(this);
    this.getRecordItems = this.getRecordItems.bind(this);
  }

  componentDidMount() {
    this.loadCollection(this.props.publicUsername);
  }

  getRecordItems() {
    const type = Object.keys(this.state.sortMode)[0];
    const order = Object.values(this.state.sortMode)[0];

    return sortArrayOfObjects(this.props.records, type, order).map((record) => (
      <RecordItem
        record={record}
        key={record._id}
        handleDelete={this.removeRecordFromCollection}
        loadCollection={this.loadCollection}
        editRecordInCollection={this.editRecordInCollection}
        publicUsername={this.props.publicUsername}
      />
    ));
  }

  addRecordToCollection(record) {
    if (!this.props.publicUsername) {
      record.append('username', this.props.authenticatedUser.username);
      return axios.post(this.props.url, record);
    }
    return Promise.resolve('Not allowed.');
  }

  removeRecordFromCollection(record) {
    if (!this.props.publicUsername) {
      return axios.delete(`${this.props.url}?_id=${record._id}`);
    }
    return Promise.resolve('Not allowed.');
  }

  editRecordInCollection(record) {
    if (!this.props.publicUsername) {
      return axios.put(this.props.url, record);
    }
    return Promise.resolve('Not allowed.');
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

  handleGalleryView(e) {
    e.preventDefault();
    this.setState({ galleryView: !this.state.galleryView });
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
    const recordItems = this.getRecordItems();
    const firstHalf = recordItems.slice(0, Math.ceil(recordItems.length / 2));
    const secondHalf = recordItems.slice(Math.ceil(recordItems.length / 2));
    const { publicUsername, collectionHasEntries } = this.props;

    return (
      <Grid fluid>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <SortModes
              galleryView={this.state.galleryView}
              handleSortMode={this.handleSortMode}
              handleGalleryView={this.handleGalleryView}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <Panel>
              {publicUsername ? (
                <Panel.Body>
                  <h4>
                    You are viewing
                    {' '}
                    <strong>{getOwnershipFormat(publicUsername)}</strong>
                    {' '}
                    collection.
                  </h4>
                </Panel.Body>
              ) : (
                <Panel.Body>
                  <AddOrEditRecord
                    addRecordToCollection={this.addRecordToCollection}
                    loadCollection={this.loadCollection}
                  />
                </Panel.Body>
              )}
              {recordItems.length !== 0 ? (
                <div>
                  {this.state.galleryView
                    && (
                    <Grid fluid>
                      <Row>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <ListGroup componentClass="ul">
                            { firstHalf }
                          </ListGroup>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <ListGroup componentClass="ul">
                            { secondHalf }
                          </ListGroup>
                        </Col>
                      </Row>
                    </Grid>
                    )}
                  {!this.state.galleryView
                    && (
                    <ListGroup componentClass="ul">
                      { recordItems }
                    </ListGroup>
                    )}
                </div>
              ) : (<EmptyCollection publicUsername={publicUsername} collectionHasEntries={collectionHasEntries} />)}
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

/* eslint react/forbid-prop-types:[0] */
ListItems.propTypes = {
  url: PropTypes.string.isRequired,
  records: PropTypes.array.isRequired,
  getCollection: PropTypes.func.isRequired,
  resetCollection: PropTypes.func.isRequired,
  authenticatedUser: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
  }),
  publicUsername: PropTypes.string,
  collectionHasEntries: PropTypes.bool.isRequired,
};

ListItems.defaultProps = {
  authenticatedUser: {
    username: '',
    email: '',
  },
  publicUsername: null,
};

const mapStateToProps = (state) => ({
  records: getRecordsBySearchAndFilter(state),
  collectionHasEntries: state.collection.records ? Object.keys(state.collection.records).length > 1 : false,
  authenticatedUser: state.authenticate.user,
});

const mapDispatchToProps = {
  getCollection,
  resetCollection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListItems);
