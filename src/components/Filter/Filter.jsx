import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button, ListGroup, ListGroupItem, Collapse,
} from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { getFilter } from '../../util';
import { setFilter, setFilterItem, resetFilter } from '../../actions';
import FilterGroup from './FilterGroup';
import { getRecords } from '../../selectors/collection';
import { getWishlist } from '../../selectors/wishlist';

const FilterGroups = ({ filterGroups, handleReset }) => (
  <div>
    { filterGroups }
    <Button
      variant="outline-dark"
      className="rm-focus-outline"
      onClick={handleReset}
      block
    >
      Clear filter
    </Button>
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
      width: 0,
      expand: false,
    };

    this.breakWidth = 992;

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
    const { ...props } = this.props;

    props.resetFilter();
    this.updateWidth();
    window.addEventListener('resize', this.updateWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
  }

  getFilterGroups() {
    const { filter, expand } = this.state;
    return Object.keys(filter).map((groupName) => (
      <FilterGroup
        key={groupName}
        groupName={groupName}
        tags={filter[groupName]}
        expand={expand}
        handleUpdate={this.handleUpdate}
      />
    ));
  }

  updateWidth() {
    this.setState({ width: window.innerWidth, expand: window.innerWidth >= this.breakWidth });
  }

  toggleExpand(e, outer) {
    if (e) e.preventDefault();

    const { width } = this.state;

    if (outer) {
      if (width >= this.breakWidth) {
        this.setState({ expand: true });
      }
    } else {
      this.setState((state) => ({
        expand: !state.expand,
      }));
    }
  }

  handleUpdate(e, groupName, tag) {
    const { ...props } = this.props;
    let { filter } = this.props;

    if (Object.keys(filter).length === 0) {
      ({ filter } = this.state);
      props.setFilter(filter);
    }

    props.setFilterItem(groupName, tag);
    filter[groupName][tag] = !filter[groupName][tag];
    this.setState({ filter });
  }

  handleReset(e) {
    e.preventDefault();
    e.stopPropagation();

    const { ...props } = this.props;

    props.resetFilter();
    this.setState({
      filter: {},
      records: [],
      expand: false,
    });
  }

  render() {
    const filterGroups = this.getFilterGroups();
    const { width, expand } = this.state;

    return (
      <ListGroup onClick={(e) => this.toggleExpand(e, true)}>
        {width < this.breakWidth
          && (
          <div>
            <ListGroupItem className="no-padding-bottom rm-outline" onClick={this.toggleExpand}>
              <strong>Filter:</strong>
              <span
                role="button"
                tabIndex={0}
                className="standard-glyph pull-right md-glyph"
              >
                {expand ? <FaAngleDown /> : <FaAngleRight />}
              </span>
            </ListGroupItem>
            <Collapse in={expand}>
              <div>
                <FilterGroups filterGroups={filterGroups} handleReset={this.handleReset} />
              </div>
            </Collapse>
          </div>
          )}
        {width >= this.breakWidth
          && <FilterGroups filterGroups={filterGroups} handleReset={this.handleReset} />}
      </ListGroup>
    );
  }
}

Filter.propTypes = {
  filter: PropTypes.shape({}).isRequired,
  records: PropTypes.arrayOf(PropTypes.shape({})),
  setFilter: PropTypes.func.isRequired,
  setFilterItem: PropTypes.func.isRequired,
  resetFilter: PropTypes.func.isRequired,
  wishlist: PropTypes.bool,
};

Filter.defaultProps = {
  wishlist: false,
  records: [],
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
