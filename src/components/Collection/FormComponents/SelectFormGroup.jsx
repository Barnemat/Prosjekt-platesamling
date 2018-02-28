import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';

const SelectFormGroup = ({
  id,
  label,
  help,
  options,
  value,
  ...props
}) => (
  <FormGroup controlId={id}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <FormControl componentClass="select" defaultValue={value} {...props}>
      {options.map(item => <option key={item} value={item}>{item}</option>)}
    </FormControl>
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>
);

SelectFormGroup.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string,
  help: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

/* eslint react/require-default-props:[0] */
/* defaultProps does not work properly
SelectFormGroup.defaultProps = {
  label: '',
  help: '',
  value: '',
  placeholder: '',
  onChange: undefined,
}; */

export default SelectFormGroup;
