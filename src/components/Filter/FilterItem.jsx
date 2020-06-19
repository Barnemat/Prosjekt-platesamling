import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';
import { capitalize } from '../../util';
import ExtendTag from './ExtendTag';

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
      return formattedString;
    } if (groupName === 'date') {
      return `Last ${tag}`;
    } if (groupName === 'format') {
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
    const tag = this.getTagName();

    return (
      <Checkbox
        checked={this.props.tagValue}
        onChange={(e) => this.props.handleUpdate(e, this.props.groupName, this.props.tag)}
      >
        {tag.length > 30 ? <ExtendTag tag={tag} /> : tag}
      </Checkbox>
    );
  }
}

FilterItem.propTypes = {
  groupName: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  tagValue: PropTypes.bool.isRequired,
  handleUpdate: PropTypes.func.isRequired,
};

FilterItem.defaultProps = {};
