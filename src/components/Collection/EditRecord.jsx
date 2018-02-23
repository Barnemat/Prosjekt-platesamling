import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Col,
  Row,
  Image,
  Button,
  Glyphicon,
  OverlayTrigger,
  FormGroup,
  FormControl,
  Checkbox,
} from 'react-bootstrap';
import Rating from 'react-rating';
import tooltip from '../CommonComponents/Tooltip';
import { checkTimePassed, getBestImageURL, getValidFormatTypes } from '../../util';
import { sendDoubleWikiSearchRequest, sendWikiImageRequest } from '../../services/api';
import DefaultFormGroup from './FormComponents/DefaultFormGroup';
import SelectFormGroup from './FormComponents/SelectFormGroup';
import noRecordImg from '../../assets/img/no_record_img.png';

export default class EditRecord extends React.Component {
  constructor(props) {
    super(props);

    const { record } = this.props;

    this.state = {
      title: record.title,
      artist: record.artist,
      format: record.format,
      rating: record.rating,
      notes: record.notes,
      wikiHref: record.wikiHref,
      wikiDesc: record.wikiDesc,
      wikiImg: record.wikiImg,
      wikiReqDesc: false,
      wikiReqImg: {
        req: false,
        searchTerm: '',
      },
      allowImgReq: false,
      selectedCheckboxes: [record.wikiDesc ? 'wikiDescCB' : '', record.wikiImg ? 'wikiImgCB' : ''],
      image: undefined,
      imageURL: '',
      ignoreRecordImg: false,
    };

    this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleResetWiki = this.handleResetWiki.bind(this);
    this.handleSearchRequest = this.handleSearchRequest.bind(this);
    this.handleImgRequest = this.handleImgRequest.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleRemoveImg = this.handleRemoveImg.bind(this);
  }

  handleEdit(e) {
    e.preventDefault();
    const keys = ['title', 'artist', 'format', 'rating', 'wikiHref', 'wikiDesc', 'wikiImg', 'notes', 'image'];
    const formData = new FormData();

    formData.append('id', this.props.record._id);
    keys.forEach((key) => {
      if (key === 'image' && this.state.ignoreRecordImg) {
        formData.append(key, null);
      } else {
        formData.append(key, this.state[key]);
      }
    });

    this.props.editRecordInCollection(formData)
      .then(() => {
        this.props.handleReset();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
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

  handleSearchRequest() {
    if (!this.state.wikiDesc) {
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
        });
    }
  }

  handleImgRequest() {
    const { searchTerm } = this.state.wikiReqImg;
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
      this.setState({
        image,
        imageURL: reader.result,
        ignoreRecordImg: false,
      });
    };
    image ? reader.readAsDataURL(image) : this.setState({ image: null, imageURL: '' });
  }

  handleRemoveImg(e) {
    e.preventDefault();

    this.setState({
      image: undefined,
      imageURL: '',
      ignoreRecordImg: true,
    });
  }

  render() {
    const { handleShowModal, record } = this.props;
    const recordImg = record.image ? record.image.data : undefined;
    const {
      title,
      artist,
      format,
      notes,
      image,
      imageURL,
      wikiHref,
      wikiDesc,
      wikiImg,
      selectedCheckboxes,
      allowImgReq,
      ignoreRecordImg,
    } = this.state;

    return (
      <Row>
        {wikiImg || image || (record.image && !ignoreRecordImg) ?
          <Col lg={4} md={4} sm={4} xs={12}>
            {imageURL ?
              <Image src={imageURL} rounded responsive />
              :
              <Image
                src={recordImg && !ignoreRecordImg ? `data:image/jpeg;base64,${recordImg}` : wikiImg}
                rounded
                responsive
              />
            }
          </Col>
          :
          <Col lg={4} md={4} sm={4} xs={12}>
            <Image src={noRecordImg} rounded responsive />
          </Col>
        }
        <Col lg={8} md={8} sm={8} xs={8}>
          <Grid fluid>
            <Row>
              <Col lg={5} md={5} sm={5} xs={12}>
                <DefaultFormGroup
                  id="formControlsTitle"
                  name="title"
                  label="Title:"
                  value={title}
                  type="text"
                  placeholder="Title..."
                  onChange={this.handleChange}
                />
              </Col>
              <Col lg={5} md={4} sm={5} xs={12}>
                <DefaultFormGroup
                  id="formControlsArtist"
                  name="artist"
                  label="Artist:"
                  value={artist}
                  type="text"
                  placeholder="Artist..."
                  onChange={this.handleChange}
                />
              </Col>
              <Col lg={2} md={3} sm={2} xs={3}>
                <OverlayTrigger placement="right" overlay={tooltip('Remove record')}>
                  <span role="button" tabIndex={0} className="standard-glyph pull-right" onClick={handleShowModal}>
                    <Glyphicon glyph="trash" />
                  </span>
                </OverlayTrigger>
                <OverlayTrigger placement="left" overlay={tooltip('Confirm edit')}>
                  <span role="button" tabIndex={0} className="standard-glyph pull-right" onClick={this.handleEdit}>
                    <Glyphicon glyph="ok" />
                  </span>
                </OverlayTrigger>
              </Col>
            </Row>
            <Row>
              <Col lg={6} md={6} sm={6} xs={12}>
                <h5><b>Format:</b></h5>
                <SelectFormGroup
                  id="formControlsFormat"
                  name="format"
                  value={format}
                  onChange={this.handleChange}
                  options={getValidFormatTypes()}
                />
              </Col>
              <Col lg={6} md={6} sm={6} xs={12}>
                <h5><b>Rating:</b></h5>
                <div onClick={e => e.stopPropagation()}>
                  <Rating
                    emptySymbol="glyphicon glyphicon-star-empty"
                    fullSymbol="glyphicon glyphicon-star"
                    initialRating={this.state.rating}
                    onChange={rating => this.setState({ rating })}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
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
                    Add/edit description from Wikipedia
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
                    Add/edit image from Wikipedia
                  </Checkbox> {' '}
                  {(wikiImg || wikiDesc) &&
                  <Button onClick={this.handleResetWiki}>
                    Reset Wikipedia fields
                  </Button>}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <h5><b>Description:</b></h5>
                {wikiDesc}
                {(wikiHref && <a href={wikiHref} target="blank"> Wikipedia</a>)}
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <DefaultFormGroup
                  id="formControlsImage"
                  name="image"
                  type="file"
                  label="Upload an image of the record:"
                  help="If you want to upload your own image, rather than use the suggestion from Wikipedia"
                  onChange={this.handleFileUpload}
                />
                {(image || recordImg) &&
                  <Button onClick={this.handleRemoveImg}>Remove file</Button>
                }
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <h5><b>Notes:</b></h5>
                <FormGroup controlId="formControlsNotes">
                  <FormControl
                    className="vresize"
                    componentClass="textarea"
                    name="notes"
                    value={notes}
                    placeholder="Record markings, playback speed, record quality..."
                    onChange={this.handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={7} md={7} sm={7} xs={12}>
                <h6>{checkTimePassed(record.date)}</h6>
              </Col>
              <Col lg={5} md={5} sm={5} xs={12}>
                <Button className="pull-right" bsStyle="success" onClick={this.handleEdit}>Confirm Edit</Button>
                <Button className="pull-right" onClick={this.props.handleReset}>Cancel</Button>
              </Col>
            </Row>
          </Grid>
        </Col>
      </Row>
    );
  }
}

EditRecord.propTypes = {
  record: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    format: PropTypes.string,
    rating: PropTypes.num,
    wikiHref: PropTypes.string,
    wikiDesc: PropTypes.string,
    wikiImg: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  handleShowModal: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  editRecordInCollection: PropTypes.func.isRequired,
};
