import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, Panel } from 'react-bootstrap';
import axios from 'axios';
import AddRecord from './AddRecord';
import RecordItem from './RecordItem';

export default class ListItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      records: [],
    };

    this.loadCollection = this.loadCollection.bind(this);
    this.addRecordToCollection = this.addRecordToCollection.bind(this);
    this.removeRecordFromCollection = this.removeRecordFromCollection.bind(this);
    this.editRecordInCollection = this.editRecordInCollection.bind(this);
  }

  componentWillMount() {
    this.loadCollection();
  }

  loadCollection() {
    axios.get(this.props.url)
      .then((res) => {
        this.setState({ records: res.data });
      });
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

  render() {
    const recordItems = this.state.records.map(record => (
      <RecordItem
        record={record}
        key={record._id}
        handleDelete={this.removeRecordFromCollection}
        loadCollection={this.loadCollection}
        editRecordInCollection={this.editRecordInCollection}
      />));

    return (
      <Panel>
        <Panel.Body>
          <AddRecord
            addRecordToCollection={this.addRecordToCollection}
            loadCollection={this.loadCollection}
          />
        </Panel.Body>
        <ListGroup componentClass="ul">
          { recordItems }
        </ListGroup>
      </Panel>
    );
  }
}

ListItems.propTypes = {
  url: PropTypes.string.isRequired,
};
