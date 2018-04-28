import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap';

const DefaultFormGroup = ({
  id,
  label,
  help,
  validationState,
  feedback,
  ...props
}) => (
  <FormGroup controlId={id} validationState={validationState}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <FormControl {...props} />
    {feedback && <FormControl.Feedback />}
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>
);

DefaultFormGroup.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  help: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  validationState: PropTypes.string,
  feedback: PropTypes.bool,
};

/* eslint react/require-default-props:[0] */
/* defaultProps does not work properly
DefaultFormGroup.defaultProps = {
  label: '',
  help: '',
  value: '',
  placeholder: '',
  onChange: undefined,
}; */

export default DefaultFormGroup;
