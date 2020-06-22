import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  FormLabel,
  Collapse,
  ListGroupItem,
} from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
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

  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.expand) {
      return { expand: false };
    }

    return {};
  }

  getFilterItems() {
    const { tags, groupName, handleUpdate } = this.props;
    return Object.keys(tags).map((item) => (
      <FilterItem
        key={item}
        groupName={groupName}
        tag={item}
        tagValue={tags[item]}
        handleUpdate={handleUpdate}
      />
    ));
  }

  toggleExpand(e) {
    if (e.target.className) {
      this.setState((state) => ({
        expand: !state.expand,
      }));
    }
  }

  render() {
    const { expand } = this.state;
    const { groupName } = this.props;
    const filterItems = this.getFilterItems();
    return (
      <ListGroupItem className="darker-onhover no-padding-bottom rm-outline" onClick={this.toggleExpand}>
        <FormGroup>
          <FormLabel>{`${capitalize(groupName === 'date' ? `${groupName} added` : groupName)}:`}</FormLabel>
          <span
            role="button"
            tabIndex={0}
            className="standard-glyph pull-right md-glyph"
          >
            {expand ? <FaAngleDown /> : <FaAngleRight />}
          </span>
          <Collapse in={expand}>
            <div>
              { filterItems }
            </div>
          </Collapse>
        </FormGroup>
      </ListGroupItem>
    );
  }
}

FilterGroup.propTypes = {
  groupName: PropTypes.string.isRequired,
  tags: PropTypes.shape({}).isRequired,
  handleUpdate: PropTypes.func.isRequired,
  expand: PropTypes.bool.isRequired,
};
