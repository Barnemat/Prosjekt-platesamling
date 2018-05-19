import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Col, Grid, Row, ListGroup, Checkbox } from 'react-bootstrap';

export default class FilterItem extends React.Component {
  constructor(props) {
    super(props);


  }

  render() {
    return (<Checkbox checked={this.props.tagValue} onChange={e => this.props.handleUpdate(e, this.props.groupName, this.props.tag)}>{this.props.tag}</Checkbox>);
  }
}

FilterItem.propTypes = {};

FilterItem.defaultProps = {};

const mapStateToProps = state => ({});
