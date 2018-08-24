import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ListGroup, ListGroupItem, Glyphicon, Collapse } from 'react-bootstrap';
import {  } from '../../actions';
import { sendWikiDiscographyRequest } from '../../services/api';

class Suggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    };
  }

  render() {
    return (
      <ListGroup>
        
      </ListGroup>
    );
  }
}

Suggestions.propTypes = {};

Suggestions.defaultProps = {};

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
  records: state.collection.records,
});

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
