import React from 'react';
import { Tooltip } from 'react-bootstrap';

const tooltip = (text) => (
  <Tooltip id="tooltip">
    {text}
  </Tooltip>
);

export default tooltip;
