import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';
import { capitalize } from '../../util';

export default class FilterItem extends React.Component {
  constructor(props) {
    super(props);

    this.getTagName = this.getTagName.bind(this);
  }

  getTagName() {
    const { groupName, tag } = this.props;

    if (groupName === 'artist') {
      const split = tag.split(' ');
      const formattedString = split.reduce((res, word) => `${res} ${capitalize(word)}`, '');
      return tag.length > 30 ? `${formattedString.substr(0, 30)}...` : formattedString;
    } else if (groupName === 'date') {
      return `Last ${tag}`;
    } else if (groupName === 'format') {
      switch (tag) {
        case 'other': return 'Other';
        default: return tag.toUpperCase();
      }
    } else if (groupName === 'rating') {
      switch (tag) {
        case 'unrated': return 'Unrated';
        default: return `${tag} star${tag > 1 ? 's' : ''}`;
      }
    }
    return tag;
  }

  render() {
    return (
      <Checkbox
        checked={this.props.tagValue}
        onChange={e => this.props.handleUpdate(e, this.props.groupName, this.props.tag)}
      >
        {this.getTagName()}
      </Checkbox>);
  }
}

FilterItem.propTypes = {
  groupName: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  tagValue: PropTypes.bool.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};

FilterItem.defaultProps = {};
