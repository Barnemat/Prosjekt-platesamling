import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import AddRecord from './AddRecord';
import RecordItem from './RecordItem';
import axios from 'axios';

export default class ListItems extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      records: []
    };

    this.loadCollection = this.loadCollection.bind(this);
    this.addRecordToCollection = this.addRecordToCollection.bind(this);
  }

  loadCollection() {
    axios.get(this.props.url)
      .then(res => {
        this.setState({ records: res.data });
      });
  }

  addRecordToCollection(record) {
    axios.post(this.props.url, record)
      .then(res => {
        this.loadCollection();
      })
      .catch(err => {
        console.error(err);
      });
  }

  componentWillMount() {
    this.loadCollection();
  }

  render() {
    const recordItems = this.state.records.map(record => {
      return (
      <RecordItem
        record={record}
        key={record['_id']}
      />
      );
    });

    return (
      <Panel>
        <Panel.Body>
          <AddRecord
            url={this.props.url}
            addRecordToCollection={this.addRecordToCollection}
          />
        </Panel.Body>
        <ListGroup>
          { recordItems }
        </ListGroup>
      </Panel>
    );
  }
}

ListItems.propTypes = {
  url: PropTypes.string.isRequired,
};
