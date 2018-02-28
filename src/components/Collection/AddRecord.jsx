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
  OverlayTrigger,
  Checkbox,
  Well,
  Image,
  Grid,
  Col,
  Row } from 'react-bootstrap';
import Rating from 'react-rating';
import { sendDoubleWikiSearchRequest, sendWikiImageRequest } from '../../services/api';
import { getBestImageURL, getValidFormatTypes, checkImgValid, setLoadingCursor } from '../../util';
import tooltip from '../CommonComponents/Tooltip';
import DefaultFormGroup from './FormComponents/DefaultFormGroup';
import SelectFormGroup from './FormComponents/SelectFormGroup';

export default class AddRecord extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      artist: '',
      format: getValidFormatTypes()[0],
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
      notes: '',
      image: undefined,
      imageData: '',
      invalidImg: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleLargeForm = this.toggleLargeForm.bind(this);
    this.handleSearchRequest = this.handleSearchRequest.bind(this);
    this.handleImgRequest = this.handleImgRequest.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleResetWiki = this.handleResetWiki.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleRemoveImg = this.handleRemoveImg.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    if (this.state.title !== '' && !this.state.largeForm) {
      this.setState({ [e.target.name]: e.target.value, largeForm: true });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  handleCheckbox(e) {
    const { name } = e.target;
    const { selectedCheckboxes: checkedBoxes } = this.state;

    if (checkedBoxes.indexOf(name) === -1) {
      checkedBoxes.push(name);
      this.setState({
        selectedCheckboxes: checkedBoxes,
        wikiReqDesc: name === 'wikiDescCB' || this.state.wikiReqDesc,
        wikiReqImg: {
          req: name === 'wikiImgCB' || this.state.wikiReqImg.req,
          searchTerm: this.state.wikiReqImg.searchTerm,
        },
      });
    } else {
      checkedBoxes.splice(checkedBoxes.indexOf(name), 1);
      this.setState({
        selectedCheckboxes: checkedBoxes,
        wikiReqDesc: name === 'wikiDescCB' ? false : this.state.wikiReqDesc,
        wikiReqImg: {
          req: name === 'wikiImgCB' ? false : this.state.wikiReqImg.req,
          searchTerm: this.state.wikiReqImg.searchTerm,
        },
      });
    }
  }

  handleFileUpload(e) {
    e.preventDefault();
    const reader = new FileReader();
    const image = e.target.files[0];

    reader.onloadend = () => {
      setLoadingCursor(false);
      this.setState({
        image,
        imageData: reader.result,
        invalidImg: false,
      });
    };

    reader.onerror = () => {
      setLoadingCursor(false);
    };

    if (image && checkImgValid(image)) {
      setLoadingCursor();
      reader.readAsDataURL(image);
    } else {
      this.setState({ image: undefined, imageData: '', invalidImg: image !== undefined });
    }
  }

  handleReset(e) {
    if (e) {
      e.preventDefault();

      if (e.key !== undefined && e.key.toLowerCase() !== 'enter') {
        return;
      }
    }

    this.setState({
      title: '',
      artist: '',
      format: getValidFormatTypes()[0],
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
      notes: '',
      image: undefined,
      imageData: '',
      invalidImg: false,
    });
  }

  handleResetWiki() {
    this.setState({
      allowImgReq: false,
      selectedCheckboxes: [],
      wikiHref: '',
      wikiReqDesc: false,
      wikiReqImg: {
        req: false,
        searchTerm: '',
      },
      wikiDesc: '',
      wikiImg: '',
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    setLoadingCursor(true);

    const keys = ['title', 'artist', 'format', 'rating', 'wikiHref', 'wikiDesc', 'wikiImg', 'notes', 'image'];
    const formData = new FormData();

    keys.forEach((key) => {
      if (key === 'wikiDesc') {
        if (this.state.selectedCheckboxes.includes('wikiDescCB')) {
          formData.append(key, this.state[key]);
        } else {
          formData.append(key, '');
        }
      } else if (key === 'wikiImg') {
        if (this.state.selectedCheckboxes.includes('wikiImgCB')) {
          formData.append(key, this.state[key]);
        } else {
          formData.append(key, '');
        }
      } else {
        formData.append(key, this.state[key]);
      }
    });

    this.props.addRecordToCollection(formData)
      .then(() => {
        this.props.loadCollection();
        this.handleReset();
      })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        setLoadingCursor(false);
      });
  }

  handleSearchRequest() {
    if (!this.state.wikiDesc) {
      setLoadingCursor(true);
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
            },
          });
        })
        .catch((err) => {
          console.error(err);
        })
        .then(() => {
          setLoadingCursor(false);
        });
    }
  }

  handleImgRequest() {
    const { searchTerm } = this.state.wikiReqImg;
    if (searchTerm && !this.state.wikiImg) {
      setLoadingCursor();

      sendWikiImageRequest(searchTerm)
        .then((res) => {
          this.setState({ wikiImg: getBestImageURL(searchTerm, JSON.parse(res.request.response)) });
        })
        .catch((err) => {
          console.error(err);
        })
        .then(() => {
          setLoadingCursor(false);
        });
    }
  }

  handleRemoveImg(e) {
    e.preventDefault();

    this.setState({
      image: undefined,
      imageData: '',
      invalidImg: false,
    });
  }

  toggleLargeForm(e) {
    e.preventDefault();
    this.setState({ largeForm: !this.state.largeForm });
  }

  render() {
    const {
      largeForm,
      title,
      artist,
      notes,
      allowImgReq,
      wikiDesc,
      wikiImg,
      wikiReqImg,
      wikiReqDesc,
      wikiHref,
      selectedCheckboxes,
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <TitleFormGroup
          name="title"
          value={title}
          label={largeForm ? 'The name of your record:' : 'Add a record to your collection:'}
          handleChange={this.handleChange}
          handleReset={this.handleReset}
          largeForm={largeForm}
          toggleLargeForm={this.toggleLargeForm}
          glyph={largeForm ? 'minus' : 'plus'}
          tooltip={largeForm ? '' : 'Click here to add a record.'}
        />
        <Collapse in={largeForm}>
          <div>
            <DefaultFormGroup
              id="formControlsArtist"
              name="artist"
              value={artist}
              type="text"
              label="The artist of the record:"
              placeholder="Artist..."
              onChange={this.handleChange}
            />
            <SelectFormGroup
              id="formControlsFormat"
              name="format"
              label="The format of the record (e.g. LP, EP, CD):"
              onChange={this.handleChange}
              options={getValidFormatTypes()}
            />
            <FormGroup>
              <Checkbox
                name="wikiDescCB"
                onChange={(e) => {
                  this.handleCheckbox(e);
                  this.handleSearchRequest();
                }}
                checked={selectedCheckboxes.indexOf('wikiDescCB') !== -1}
                inline
              >
                Add description from Wikipedia
              </Checkbox>
              <Checkbox
                name="wikiImgCB"
                onChange={(e) => {
                  this.handleCheckbox(e);
                  this.handleImgRequest();
                }}
                disabled={!allowImgReq}
                checked={selectedCheckboxes.indexOf('wikiImgCB') !== -1}
                inline
              >
                Add image from Wikipedia
              </Checkbox> {' '}
              {(wikiImg || wikiDesc) &&
              <Button onClick={this.handleResetWiki}>
                Reset Wikipedia fields
              </Button>}
            </FormGroup>
            <WikiInfo
              wikiReqDesc={wikiReqDesc}
              wikiReqImg={wikiReqImg}
              wikiDesc={wikiDesc}
              wikiImg={wikiImg}
              wikiHref={wikiHref}
            />
            <DefaultFormGroup
              id="formControlsImage"
              name="image"
              type="file"
              label="Upload an image of the record:"
              help="If you want to upload your own image. (Max: 2MB)"
              onChange={this.handleFileUpload}
            />
            {this.state.invalidImg &&
              <p className="text-danger">The uploaded file is invalid.</p>
            }
            {this.state.image &&
              <Grid fluid>
                <Row>
                  <Col lg={6} md={7} sm={5} xs={8}>
                    <Well bsSize="small">
                      {this.state.imageData &&
                        <Image src={this.state.imageData} responsive />
                      }
                    </Well>
                    <Button bsSize="small" onClick={this.handleRemoveImg}>Remove file</Button>
                  </Col>
                </Row>
              </Grid>
            }
            <FormGroup controlId="formControlsNotes">
              <ControlLabel>Add your own notes here:</ControlLabel>
              <FormControl
                className="vresize"
                componentClass="textarea"
                name="notes"
                value={notes}
                placeholder="Record markings, playback speed, record quality..."
                onChange={this.handleChange}
              />
            </FormGroup>
            <Rating
              emptySymbol="glyphicon glyphicon-star-empty"
              fullSymbol="glyphicon glyphicon-star"
              initialRating={this.state.rating}
              onChange={rating => this.setState({ rating })}
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

AddRecord.propTypes = {
  addRecordToCollection: PropTypes.func.isRequired,
  loadCollection: PropTypes.func.isRequired,
};

const TitleFormGroup = ({
  value,
  glyph,
  label,
  handleChange,
  handleReset,
  largeForm,
  toggleLargeForm,
  name,
  ...props
}) => (
  <FormGroup controlId="formControlsTitle">
    <Grid fluid>
      <Row>
        <Col className="no-padding" lg={11} md={11} sm={11} xs={11}>
          {label && <ControlLabel>{label}</ControlLabel>}
        </Col>
        <Col className="no-padding text-right" lg={1} md={1} sm={1} xs={1}>
          {(largeForm || value) &&
            <OverlayTrigger placement="right" overlay={tooltip('Click here to discard submition.')}>
              <span
                role="button"
                tabIndex={0}
                className="standard-glyph"
                onClick={handleReset}
                onKeyUp={handleReset}
              >
                <Glyphicon glyph="trash" />
              </span>
            </OverlayTrigger>}
        </Col>
      </Row>
    </Grid>
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
  label: PropTypes.string.isRequired,
  largeForm: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  toggleLargeForm: PropTypes.func.isRequired,
};

const WikiInfo = ({
  wikiReqDesc,
  wikiReqImg,
  wikiDesc,
  wikiImg,
  wikiHref,
}) => (
  <Collapse in={wikiReqDesc || wikiReqImg.req}>
    {wikiReqDesc && wikiReqImg.req ?
      <div>
        <Well>
          <Grid fluid>
            <Row>
              <Col lg={4} md={5} sm={5}>
                <Collapse in={wikiReqImg.req}>
                  <div>
                    {wikiImg ?
                      <Image src={wikiImg} rounded responsive />
                      :
                      'No image was found.'
                    }
                  </div>
                </Collapse>
              </Col>
              <Col lg={8} md={7} sm={7}>
                <Collapse in={wikiReqDesc}>
                  <div>
                    {wikiDesc || 'No information was found.'}
                  </div>
                </Collapse>
                {wikiHref && <a href={wikiHref} target="blank">Wikipedia</a>}
              </Col>
            </Row>
          </Grid>
        </Well>
      </div>
    :
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
          {wikiHref && <a href={wikiHref} target="blank">Wikipedia</a>}
        </Well>
      </div>
  }
  </Collapse>
);

WikiInfo.propTypes = {
  wikiReqDesc: PropTypes.bool.isRequired,
  wikiReqImg: PropTypes.shape({
    req: PropTypes.bool.isRequired,
    searchTerm: PropTypes.string.isRequired,
  }).isRequired,
  wikiDesc: PropTypes.string.isRequired,
  wikiImg: PropTypes.string.isRequired,
  wikiHref: PropTypes.string.isRequired,
};
