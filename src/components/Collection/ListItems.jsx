/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ListGroup, Panel, Container, Row, Col,
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
    const { publicUsername } = this.props;
    this.loadCollection(publicUsername);
  }

  getRecordItems() {
    const { sortMode } = this.state;
    const { records, publicUsername } = this.props;

    const type = Object.keys(sortMode)[0];
    const order = Object.values(sortMode)[0];

    return sortArrayOfObjects(records, type, order).map((record) => (
      <RecordItem
        record={record}
        key={record._id}
        handleDelete={this.removeRecordFromCollection}
        loadCollection={this.loadCollection}
        editRecordInCollection={this.editRecordInCollection}
        publicUsername={publicUsername}
      />
    ));
  }

  addRecordToCollection(record) {
    const { publicUsername, url, authenticatedUser } = this.props;
    if (!publicUsername) {
      record.append('username', authenticatedUser.username);
      return axios.post(url, record);
    }
    return Promise.resolve('Not allowed.');
  }

  removeRecordFromCollection(record) {
    const { publicUsername, url } = this.props;

    if (!publicUsername) {
      return axios.delete(`${url}?_id=${record._id}`);
    }
    return Promise.resolve('Not allowed.');
  }

  editRecordInCollection(record) {
    const { publicUsername, url } = this.props;

    if (!publicUsername) {
      return axios.put(url, record);
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
    this.setState((state) => ({
      galleryView: !state.galleryView,
    }));
  }

  loadCollection(publicUsername) {
    const { sortMode } = this.state;
    const { authenticatedUser, ...props } = this.props;

    if (authenticatedUser && authenticatedUser.username && !publicUsername) {
      props.getCollection(authenticatedUser.username, sortMode);
    } else if (publicUsername) {
      props.getCollection(publicUsername, sortMode);
    } else {
      props.resetCollection();
    }
  }

  render() {
    const { galleryView } = this.state;
    const { publicUsername, collectionHasEntries } = this.props;

    const recordItems = this.getRecordItems();
    const firstHalf = recordItems.slice(0, Math.ceil(recordItems.length / 2));
    const secondHalf = recordItems.slice(Math.ceil(recordItems.length / 2));

    return (
      <Container fluid>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <SortModes
              galleryView={galleryView}
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
                  {galleryView
                    && (
                    <Container fluid>
                      <Row>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <ListGroup as="ul">
                            { firstHalf }
                          </ListGroup>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6}>
                          <ListGroup as="ul">
                            { secondHalf }
                          </ListGroup>
                        </Col>
                      </Row>
                    </Container>
                    )}
                  {!galleryView
                    && (
                    <ListGroup as="ul">
                      { recordItems }
                    </ListGroup>
                    )}
                </div>
              ) : (<EmptyCollection publicUsername={publicUsername} collectionHasEntries={collectionHasEntries} />)}
            </Panel>
          </Col>
        </Row>
      </Container>
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
