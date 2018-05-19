import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Col, Grid, Row, ListGroup } from 'react-bootstrap';
import { getFilter } from '../../util';
import { setFilter, setFilterItem } from '../../actions';
import FilterGroup from './FilterGroup';
import { getRecords } from '../../selectors/collection';

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      records: [],
      hasReset: false,
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getFilterGroups = this.getFilterGroups.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.records !== nextProps.records && nextProps.records) {
      const filter = getFilter(nextProps.records);
      return { filter, records: nextProps.records };
    }
    return {};
  }

  getFilterGroups() {
    const { filter, hasReset } = this.state;
    return Object.keys(filter).map(groupName => (
      <FilterGroup
        key={groupName}
        groupName={groupName}
        tags={filter[groupName]}
        hasReset={hasReset}
        handleUpdate={this.handleUpdate}
      />));
  }

  handleUpdate(e, groupName, tag) {
    let filter;
    if (Object.keys(this.props.filter).length > 0) {
      ({ filter } = this.props);
    } else {
      ({ filter } = this.state);
      this.props.setFilter(filter);
    }

    this.props.setFilterItem(groupName, tag);
    filter[groupName][tag] = !filter[groupName][tag];
    this.setState({ filter, hasReset: false });
  }

  handleReset(e) {
    e.preventDefault();

    const { records } = this.props;
    const filter = getFilter(records);
    this.props.setFilter(filter);
    this.setState({ filter: {}, records: [], hasReset: true });
  }

  render() {
    const filterGroups = this.getFilterGroups();

    return (
      <Grid className="no-padding" fluid>
        <ListGroup>
          { filterGroups }
          <Row>
            <Col lg={2} md={2} className="no-padding" />
            <Col lg={10} md={10} sm={12} xs={12} className="no-padding">
              <Button className="rm-focus-outline" onClick={this.handleReset} block>Clear filter</Button>
            </Col>
          </Row>
        </ListGroup>
      </Grid>
    );
  }
}

Filter.propTypes = {
  filter: PropTypes.shape({}).isRequired,
  records: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFilter: PropTypes.func.isRequired,
  setFilterItem: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  setFilter,
  setFilterItem,
};

const mapStateToProps = state => ({
  filter: state.filter,
  records: getRecords(state) || [],
});

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
