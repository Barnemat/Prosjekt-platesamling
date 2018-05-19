import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Col, Grid, Row, ListGroup, FormGroup, ControlLabel, Collapse, ListGroupItem, Glyphicon } from 'react-bootstrap';
import FilterItem from './FilterItem';
import { capitalize } from '../../util';

export default class FilterGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: false,
    };

    this.getFilterItems = this.getFilterItems.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  getFilterItems() {
    const { tags, groupName, handleUpdate } = this.props;
    return Object.keys(tags).map(item => (
      <FilterItem
        key={item}
        groupName={groupName}
        tag={item}
        tagValue={tags[item]}
        handleUpdate={handleUpdate}
      />));
  }

  toggleExpand(e) {
    if (e.target.className) this.setState({ expand: !this.state.expand });
  }

  render() {
    const { groupName } = this.props;
    const filterItems = this.getFilterItems();
    return (
      <Row>
        <Col  lg={2} md={2} className="no-padding"/>
        <Col  lg={10} md={10} sm={12} xs={12} className="no-padding">
        <ListGroupItem className="darker-onhover no-padding-bottom rm-outline" onClick={this.toggleExpand}>
          <FormGroup>
            <ControlLabel>{`${capitalize(groupName)}:`}</ControlLabel>
            <span
                role="button"
                tabIndex={0}
                className="standard-glyph pull-right md-glyph"
              >
                <Glyphicon glyph={this.state.expand ? 'chevron-down' : 'chevron-right'} />
            </span>
            <Collapse in={this.state.expand}>
              <div>
              { filterItems }
              </div>
            </Collapse>
          </FormGroup>
        </ListGroupItem>
        </Col>
      </Row>
    );
  }
}

FilterGroup.propTypes = {};

FilterGroup.defaultProps = {};

const mapStateToProps = state => ({});

