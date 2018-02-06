import React from 'react';
import { Tooltip } from 'react-bootstrap';

const tooltip = (text) => {
  return (
    <Tooltip id="tooltip">
      {text}
    </Tooltip>
)};

export default tooltip;