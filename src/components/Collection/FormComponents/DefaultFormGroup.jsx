/* eslint-disable react/require-default-props, react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup, FormControl, FormLabel, Form,
} from 'react-bootstrap';

const DefaultFormGroup = ({
  controlId,
  label,
  help,
  validationState,
  feedback,
  as,
  classProps,
  ...props
}) => (
  <FormGroup as={as || 'div'} className={classProps} controlId={controlId}>
    {label && <FormLabel>{label}</FormLabel>}
    <FormControl
      className="w-100"
      isValid={validationState === 'success'}
      isInvalid={validationState === 'error'}
      {...props}
    />
    {feedback && <FormControl.Feedback />}
    {help && <Form.Text muted>{help}</Form.Text>}
  </FormGroup>
);

DefaultFormGroup.propTypes = {
  controlId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  help: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  validationState: PropTypes.string,
  feedback: PropTypes.bool,
  as: PropTypes.string,
  classProps: PropTypes.string,
};

/* defaultProps does not work properly
DefaultFormGroup.defaultProps = {
  label: '',
  help: '',
  value: '',
  placeholder: '',
  onChange: undefined,
}; */

export default DefaultFormGroup;
