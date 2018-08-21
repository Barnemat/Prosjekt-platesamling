import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger } from 'react-bootstrap';
import tooltip from '../CommonComponents/Tooltip';

const ExtendTag = ({ tag }) => (
  <span>
    <span>{tag.substr(0, 30)}</span>
    <OverlayTrigger placement="right" overlay={tooltip(tag)}>
      <span className="underline-onhover">...</span>
    </OverlayTrigger>
  </span>
);

ExtendTag.propTypes = {
  tag: PropTypes.string.isRequired,
};

export default ExtendTag;
