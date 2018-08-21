import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger } from 'react-bootstrap';
import { checkTimePassed } from '../../util';
import tooltip from '../CommonComponents/Tooltip';

const DateAdded = ({ date, small }) => {
  const dateObject = new Date(date);
  const formattedDate = checkTimePassed(date);
  const formattedExactDate = dateObject.toDateString();

  return (
    <OverlayTrigger placement="bottom" overlay={tooltip(formattedExactDate)}>
      <span>
        {small ? <small>{formattedDate}</small> : formattedDate}
      </span>
    </OverlayTrigger>
  );
};

DateAdded.propTypes = {
  date: PropTypes.string.isRequired,
  small: PropTypes.bool,
};

DateAdded.defaultProps = {
  small: false,
};

export default DateAdded;
