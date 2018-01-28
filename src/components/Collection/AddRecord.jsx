import React from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  FormGroup,
  Button,
  Glyphicon,
  InputGroup,
  ControlLabel,
  Collapse,
  HelpBlock } from 'react-bootstrap';

export default class AddRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      largeForm: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.toggleLargeForm = this.toggleLargeForm.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ title: e.target.value });
  }

  toggleLargeForm(e) {
    e.preventDefault();
    this.setState({ largeForm: !this.state.largeForm });
  }

  render() {
    const { largeForm } = this.state;
    return (
      <form>
        <TitleFormGroup
          value={this.state.title}
          label={largeForm ? 'The name of your record:' : 'Add a record to your collection:'}
          handleChange={this.handleChange}
          toggleLargeForm={this.toggleLargeForm}
          glyph={largeForm ? 'minus' : 'plus'}
        />
        <Collapse in={largeForm}>
          <div>
            <DefaultFormGroup
              id="formControlsArtist"
              type="text"
              label="The artist of the record:"
              placeholder="Artist..."
            />
            <DefaultFormGroup
              id="formControlsGenre"
              type="text"
              label="The genre of the record:"
              placeholder="Genre..."
            />
          </div>
        </Collapse>
      </form>
    );
  }
}

const TitleFormGroup = ({
  value,
  glyph,
  label,
  handleChange,
  toggleLargeForm,
}) => (
  <FormGroup controlId="formControlsTitle">
    {label && <ControlLabel>{label}</ControlLabel>}
    <InputGroup>
      <FormControl
        type="text"
        value={value}
        placeholder="Record title..."
        onChange={handleChange}
      />
      <InputGroup.Button>
        <Button onClick={toggleLargeForm}>
          <Glyphicon glyph={glyph} />
        </Button>
      </InputGroup.Button>
    </InputGroup>
  </FormGroup>
);

TitleFormGroup.propTypes = {
  value: PropTypes.string.isRequired,
  glyph: PropTypes.string.isRequired,
  label: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  toggleLargeForm: PropTypes.func.isRequired,
};

TitleFormGroup.defaultProps = {
  label: '',
};

const DefaultFormGroup = ({
  id,
  label,
  help,
  ...props
}) => (
  <FormGroup controlId={id}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <FormControl {...props} />
    {help && <HelpBlock>{help}</HelpBlock>}
  </FormGroup>
);

DefaultFormGroup.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  help: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

DefaultFormGroup.defaultProps = {
  id: PropTypes.string.isRequired,
  label: '',
  help: '',
  type: PropTypes.string.isRequired,
  value: '',
  placeholder: PropTypes.string,
  onChange: null,
};
