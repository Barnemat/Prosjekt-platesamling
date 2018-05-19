/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup, Panel, Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import AddOrEditRecord from './AddOrEditRecord';
import RecordItem from './RecordItem';
import SortModes from './SortModes';
import { sortArrayOfObjects, getOwnershipFormat } from '../../util';

const EmptyCollection = ({ publicUsername }) => (
  <div className="text-center lead">
    {publicUsername ? 'The' : 'Your'} collection is empty.
  </div>
);

EmptyCollection.propTypes = {
  publicUsername: PropTypes.string,
};

EmptyCollection.defaultProps = {
  publicUsername: null,
};

export default class ListItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      galleryView: false,
    };

    this.addRecordToCollection = this.addRecordToCollection.bind(this);
    this.removeRecordFromCollection = this.removeRecordFromCollection.bind(this);
    this.editRecordInCollection = this.editRecordInCollection.bind(this);
    this.handleGalleryView = this.handleGalleryView.bind(this);
    this.getRecordItems = this.getRecordItems.bind(this);
  }

  componentWillMount() {
    this.props.loadCollection(this.props.publicUsername);
  }

  getRecordItems() {
    const type = Object.keys(this.props.sortMode)[0];
    const order = Object.values(this.props.sortMode)[0];

    return sortArrayOfObjects(this.props.records, type, order).map(record => (
      <RecordItem
        record={record}
        key={record._id}
        handleDelete={this.removeRecordFromCollection}
        loadCollection={this.props.loadCollection}
        editRecordInCollection={this.editRecordInCollection}
        publicUsername={this.props.publicUsername}
      />));
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

  handleGalleryView(e) {
    e.preventDefault();
    this.setState({ galleryView: !this.state.galleryView });
  }

  render() {
    const recordItems = this.getRecordItems();
    const firstHalf = recordItems.slice(0, Math.ceil(recordItems.length / 2));
    const secondHalf = recordItems.slice(Math.ceil(recordItems.length / 2));
    const { publicUsername } = this.props;

    return (
      <Grid fluid>
        <Row>
          <Col lg={12} md={12} sm={12} xs={12}>
            <SortModes
              galleryView={this.state.galleryView}
              handleSortMode={this.props.handleSortMode}
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
                    You are viewing <strong>{getOwnershipFormat(publicUsername)}</strong> collection.
                  </h4>
                </Panel.Body>) : (
                  <Panel.Body>
                    <AddOrEditRecord
                      addRecordToCollection={this.addRecordToCollection}
                      loadCollection={this.props.loadCollection}
                    />
                  </Panel.Body>)}
              {recordItems.length !== 0 ? (
                <div>
                  {this.state.galleryView &&
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
                    </Grid>}
                  {!this.state.galleryView &&
                    <ListGroup componentClass="ul">
                      { recordItems }
                    </ListGroup>}
                </div>
                ) : (<EmptyCollection publicUsername={publicUsername} />)}
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
  authenticatedUser: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
  }),
  publicUsername: PropTypes.string,
};

ListItems.defaultProps = {
  authenticatedUser: {
    username: '',
    email: '',
  },
  publicUsername: null,
};
