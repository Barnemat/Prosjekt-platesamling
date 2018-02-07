import React from 'react';
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import AddRecord from './AddRecord';

export default class ListItems extends React.Component {
  static alertClicked() {
    // alert('You clicked the third ListGroupItem');
    return -1;
  }

  /*
  constructor(props) {
    super(props);
  } */

  render() {
    return (
      <Panel>
        <Panel.Body>
          <AddRecord />
        </Panel.Body>
        <ListGroup>
          <ListGroupItem onClick={ListItems.alertClicked}>Link 2</ListGroupItem>
          <ListGroupItem onClick={ListItems.alertClicked}>Link 3</ListGroupItem>
        </ListGroup>
      </Panel>
    );
  }
}
