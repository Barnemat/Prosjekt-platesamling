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
  HelpBlock,
  OverlayTrigger,
  Checkbox,
  Well,
  Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Rating from 'react-rating';
import { sendDoubleWikiSearchRequest, sendWikiImageRequest } from '../../services/api';
import { getBestImageURL } from '../../util';
import tooltip from '../CommonComponents/Tooltip';

export default class AddRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      artist: '',
      format: '',
      selectedCheckboxes: [],
      rating: 0,
      allowImgReq: false,
      wikiHref: '',
      wikiReqDesc: false,
      wikiReqImg: {
        req: false,
        searchTerm: '',
      },
      wikiDesc: '',
      wikiImg: '',
      largeForm: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleLargeForm = this.toggleLargeForm.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleSearchRequest = this.handleSearchRequest.bind(this);
    this.handleImgRequest = this.handleImgRequest.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    this.state.title !== '' && !this.state.largeForm ?
      this.setState({ [e.target.name]: e.target.value, largeForm: true })
      :
      this.setState({ [e.target.name]: e.target.value });
  }

  handleCheckbox(e) {
    const name = e.target.name;
    let checkedBoxes = this.state.selectedCheckboxes;

    if (checkedBoxes.indexOf(name) === -1) {
      checkedBoxes.push(name);
      this.setState({
        selectedCheckboxes: checkedBoxes,
        wikiReqDesc: name === 'wikiDescCB' || this.state.wikiReqDesc,
        wikiReqImg: {
          req: name === 'wikiImgCB' || this.state.wikiReqImg.req,
          searchTerm: this.state.wikiReqImg.searchTerm,
        },
      })
    } else {
      checkedBoxes.splice(checkedBoxes.indexOf(name), 1);
      this.setState({
        selectedCheckboxes: checkedBoxes,
        wikiReqDesc: name === 'wikiDescCB' ? false: this.state.wikiReqDesc,
        wikiReqImg: {
          req: name === 'wikiImgCB' ? false: this.state.wikiReqImg.req,
          searchTerm: this.state.wikiReqImg.searchTerm,
        },
      });
    }
  }

  handleRatingChange(e) {
    this.setState({ rating: e });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleSearchRequest() {
    if(!this.state.wikiDesc){
      const searchRequest = sendDoubleWikiSearchRequest('en', this.state.title, this.state.artist);
    
      searchRequest
        .then((res) => {
          this.setState({ 
            allowImgReq: true,
            wikiDesc: res[2] ? res[2][0] : '',
            wikiHref: res[3] ? res[3][0] : '',
            wikiReqImg: { 
              req: this.state.wikiReqImg.req,
              searchTerm: res[1] && res[1][0] !== '' ? res[1][0] : '',
            }
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  handleImgRequest() {
    const searchTerm = this.state.wikiReqImg.searchTerm;
    if (searchTerm && !this.state.wikiImg) {
      sendWikiImageRequest(searchTerm)
        .then((res) => {
          this.setState({ wikiImg: getBestImageURL(searchTerm, JSON.parse(res.request.response)) });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  toggleLargeForm(e) {
    e.preventDefault();
    this.setState({ largeForm: !this.state.largeForm });
  }

  render() {
    const { largeForm, title, rating, allowImgReq, wikiDesc, wikiImg, wikiReqImg, wikiReqDesc, wikiHref } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <TitleFormGroup
          name="title"
          value={title}
          label={largeForm ? 'The name of your record:' : 'Add a record to your collection:'}
          handleChange={this.handleChange}
          toggleLargeForm={this.toggleLargeForm}
          glyph={largeForm ? 'minus' : 'plus'}
          tooltip={largeForm ? '' : 'Click here to add a record.'}
        />
        <Collapse in={largeForm}>
          <div>
            <DefaultFormGroup
              id="formControlsArtist"
              name="artist"
              type="text"
              label="The artist of the record:"
              placeholder="Artist..."
              onChange={this.handleChange}
            />
            <DefaultFormGroup
              id="formControlsFormat"
              name="format"
              type="text"
              label="The format of the record (e.g. LP, EP, CD):"
              placeholder="LP, EP, CD..."
              onChange={this.handleChange}
            />
            <FormGroup>
              <Checkbox
                name="wikiDescCB"
                onChange={(e) => {
                  this.handleCheckbox(e);
                  this.handleSearchRequest();
                }}
                inline >
                Add description from Wikipedia
              </Checkbox>
              <Checkbox
                name="wikiImgCB"
                onChange={(e) => {
                  this.handleCheckbox(e);
                  this.handleImgRequest();
                }}
                disabled={!allowImgReq}
                inline >
                Add image from Wikipedia
              </Checkbox>
            </FormGroup>
            <Collapse in={wikiReqDesc || wikiReqImg.req}>
              <div>
                <Well>
                  <Collapse in={wikiReqImg.req}>
                    <div>
                      {wikiImg ? 
                        <Image src={wikiImg} rounded responsive />
                        :
                        'No image was found.'
                      }
                    </div>
                  </Collapse>
                  <Collapse in={wikiReqDesc}>
                    <div>
                      {wikiDesc || 'No information was found.'}
                    </div>
                  </Collapse>
                  {wikiHref ? <a href={wikiHref} target="blank">Wikipedia</a> : null}
                </Well>
              </div>
            </Collapse>
            <Rating
              emptySymbol="glyphicon glyphicon-star-empty"
              fullSymbol="glyphicon glyphicon-star"
              initialRating={rating}
              onChange={this.handleRatingChange}
            />
            <Button bsStyle="primary" type="submit" block>
              Add record to collection
            </Button>
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
  name,
  ...props,
}) => (
  <FormGroup controlId="formControlsTitle">
    {label && <ControlLabel>{label}</ControlLabel>}
    <InputGroup>
      <FormControl
        type="text"
        name={name}
        value={value}
        placeholder="Record title..."
        onChange={handleChange}
      />
      <InputGroup.Button>
      { props.tooltip ?
        <OverlayTrigger placement="right" overlay={tooltip(props.tooltip)}>
          <Button onClick={toggleLargeForm}>
            <Glyphicon glyph={glyph} />
          </Button>
        </OverlayTrigger>
        :
        <Button onClick={toggleLargeForm}>
          <Glyphicon glyph={glyph} />
        </Button>}
      </InputGroup.Button>
    </InputGroup>
  </FormGroup>
);

TitleFormGroup.propTypes = {
  value: PropTypes.string.isRequired,
  glyph: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  toggleLargeForm: PropTypes.func.isRequired,
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
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  help: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};
/* Locks the input fields for some reason

DefaultFormGroup.defaultProps = {
  id: PropTypes.string.isRequired,
  label: '',
  help: '',
  type: PropTypes.string.isRequired,
  value: '',
  placeholder: PropTypes.string,
  onChange: null,
};
*/
