import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ListGroup, ListGroupItem, Glyphicon, Collapse } from 'react-bootstrap';
import { getFilter } from '../../util';
import { setFilter, setFilterItem, resetFilter } from '../../actions';
import FilterGroup from './FilterGroup';
import { getRecords } from '../../selectors/collection';
import { getWishlist } from '../../selectors/wishlist';

const FilterGroups = ({ filterGroups, handleReset }) => (
  <div>
    { filterGroups }
    <Button className="rm-focus-outline" onClick={handleReset} block>Clear filter</Button>
  </div>
);

FilterGroups.propTypes = {
  filterGroups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleReset: PropTypes.func.isRequired,
};

class Filter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      records: [],
      hasReset: false,
      width: 0,
      expand: false,
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.getFilterGroups = this.getFilterGroups.bind(this);
    this.updateWidth = this.updateWidth.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.records !== nextProps.records && nextProps.records) {
      const filter = getFilter(nextProps.records, nextProps.wishlist);
      return { filter, records: nextProps.records };
    }
    return {};
  }

  componentDidMount() {
    this.props.resetFilter();
    this.updateWidth();
    window.addEventListener('resize', this.updateWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
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

  updateWidth() {
    this.setState({ width: window.innerWidth });
  }

  toggleExpand(e) {
    if (e) e.preventDefault();

    this.setState({ expand: !this.state.expand });
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

    const { records, wishlist } = this.props;
    const filter = getFilter(records, wishlist);
    this.props.setFilter(filter);
    this.setState({ filter: {}, records: [], hasReset: true });
  }

  render() {
    const filterGroups = this.getFilterGroups();
    const { width, expand } = this.state;

    return (
      <ListGroup>
        {width < 992 &&
          <div>
            <ListGroupItem className="no-padding-bottom rm-outline" onClick={this.toggleExpand}>
              <strong>Filter:</strong>
              <span
                role="button"
                tabIndex={0}
                className="standard-glyph pull-right md-glyph"
              >
                <Glyphicon glyph={expand ? 'chevron-down' : 'chevron-right'} />
              </span>
            </ListGroupItem>
            <Collapse in={expand}>
              <div>
                <FilterGroups filterGroups={filterGroups} handleReset={this.handleReset} />
              </div>
            </Collapse>
          </div>}
        {width >= 992 &&
          <FilterGroups filterGroups={filterGroups} handleReset={this.handleReset} />}
      </ListGroup>
    );
  }
}

Filter.propTypes = {
  filter: PropTypes.shape({}).isRequired,
  records: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  setFilter: PropTypes.func.isRequired,
  setFilterItem: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  wishlist: PropTypes.bool,
};

Filter.defaultProps = {
  records: [],
  wishlist: false,
};

const mapDispatchToProps = {
  setFilter,
  setFilterItem,
  resetFilter,
};

const mapStateToProps = (state, ownProps) => ({
  filter: state.filter,
  records: ownProps.wishlist ? getWishlist(state) : getRecords(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
