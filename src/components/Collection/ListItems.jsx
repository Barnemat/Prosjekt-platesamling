/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup, Panel, Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import AddRecord from './AddRecord';
import RecordItem from './RecordItem';
import SortModes from './SortModes';
import { setLoadingCursor, sortArrayOfObjects } from '../../util';
import { setCollection } from '../../actions';
import { getRecordsBySearch } from '../../selectors/collection';

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

  componentWillMount() {
    this.loadCollection();
  }

  getRecordItems() {
    const type = Object.keys(this.state.sortMode)[0];
    const order = Object.values(this.state.sortMode)[0];

    return sortArrayOfObjects(this.props.records, type, order).map(record => (
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
    this.setState({ sortMode });
  }

  handleGalleryView(e) {
    e.preventDefault();
    this.setState({ galleryView: !this.state.galleryView });
  }

  loadCollection() {
    setLoadingCursor(true);
    axios.get(`${this.props.url}?sort=${JSON.stringify(this.state.sortMode)}`)
      .then((res) => {
        this.props.setCollection({ records: res.data });
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

/* eslint react/forbid-prop-types:[0] */
ListItems.propTypes = {
  url: PropTypes.string.isRequired,
  records: PropTypes.array.isRequired,
  setCollection: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  records: getRecordsBySearch(state),
});

const mapDispatchToProps = {
  setCollection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListItems);
