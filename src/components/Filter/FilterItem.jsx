import React from 'react';
import PropTypes from 'prop-types';
import { FormCheck } from 'react-bootstrap';
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
    const {
      tagValue, handleUpdate, groupName, ...props
    } = this.props;
    const tag = this.getTagName();

    return (
      <FormCheck>
        <FormCheck.Input
          type="checkbox"
          checked={tagValue}
          onChange={(e) => handleUpdate(e, groupName, props.tag)}
          onClick={(e) => e.stopPropagation()}
        />
        <FormCheck.Label
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate(e, groupName, props.tag);
          }}
        >
          {tag.length > 30 ? <ExtendTag tag={tag} /> : tag}
        </FormCheck.Label>
      </FormCheck>
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
