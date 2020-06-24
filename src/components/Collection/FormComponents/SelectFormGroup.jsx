/* eslint-disable react/require-default-props, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup, FormLabel, FormControl, Form,
} from 'react-bootstrap';

const SelectFormGroup = ({
  controlId,
  label,
  help,
  options,
  value,
  ...props
}) => (
  <FormGroup controlId={controlId}>
    {label && <FormLabel>{label}</FormLabel>}
    <FormControl as="select" defaultValue={value} {...props}>
      {options.map((item) => <option key={item} value={item}>{item}</option>)}
    </FormControl>
    {help && <Form.Text muted>{help}</Form.Text>}
  </FormGroup>
);

SelectFormGroup.propTypes = {
  controlId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string,
  help: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

/* defaultProps does not work properly
SelectFormGroup.defaultProps = {
  label: '',
  help: '',
  value: '',
  placeholder: '',
  onChange: undefined,
}; */

export default SelectFormGroup;
