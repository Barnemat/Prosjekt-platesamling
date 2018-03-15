/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, Panel, Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import AddRecord from './AddRecord';
import RecordItem from './RecordItem';
import SortModes from './SortModes';
import { setLoadingCursor, sortArrayOfObjects } from '../../util';

export default class ListItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      records: [],
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

  componentWillMount() {
    this.loadCollection();
  }

  getRecordItems() {
    return this.state.records.map(record => (
      <RecordItem
        record={record}
        key={record._id}
        handleDelete={this.removeRecordFromCollection}
        loadCollection={this.loadCollection}
        editRecordInCollection={this.editRecordInCollection}
      />));
  }

  addRecordToCollection(record) {
    return axios.post(this.props.url, record);
  }

  removeRecordFromCollection(record) {
    return axios.delete(`${this.props.url}?_id=${record._id}`);
  }

  editRecordInCollection(record) {
    return axios.put(this.props.url, record);
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
    const type = Object.keys(sortMode)[0];
    const order = Object.values(sortMode)[0];

    const records = sortArrayOfObjects(this.state.records, type, order);
    this.setState({ records, sortMode });
  }

  handleGalleryView(e) {
    e.preventDefault();
    this.setState({ galleryView: !this.state.galleryView });
  }

  loadCollection() {
    setLoadingCursor(true);
    axios.get(`${this.props.url}?sort=${JSON.stringify(this.state.sortMode)}`)
      .then((res) => {
        this.setState({ records: res.data });
      })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        setLoadingCursor(false);
      });
  }

  render() {
    const recordItems = this.getRecordItems();
    const firstHalf = recordItems.slice(0, Math.ceil(recordItems.length / 2));
    const secondHalf = recordItems.slice(Math.ceil(recordItems.length / 2));

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
              <Panel.Body>
                <AddRecord
                  addRecordToCollection={this.addRecordToCollection}
                  loadCollection={this.loadCollection}
                />
              </Panel.Body>
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
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

ListItems.propTypes = {
  url: PropTypes.string.isRequired,
};
