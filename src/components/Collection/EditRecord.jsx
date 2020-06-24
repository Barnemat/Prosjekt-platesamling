/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Col,
  Row,
  Image,
  Button,
  OverlayTrigger,
  FormGroup,
  FormControl,
  FormCheck,
  Form,
} from 'react-bootstrap';
import { FaTrashAlt, FaCheck } from 'react-icons/fa';
import { TiStarOutline, TiStarFullOutline } from 'react-icons/ti';
import Rating from 'react-rating';
import tooltip from '../CommonComponents/Tooltip';
import { checkTimePassed, getValidFormatTypes, setLoadingCursor } from '../../util';
import DefaultFormGroup from './FormComponents/DefaultFormGroup';
import SelectFormGroup from './FormComponents/SelectFormGroup';
import WildCardError from '../CommonComponents/WildCardError';
import noRecordImg from '../../assets/img/no_record_img.png';

export default class EditRecord extends React.Component {
  constructor(props) {
    super(props);

    this.editRecordSubmit = this.editRecordSubmit.bind(this);
  }

  editRecordSubmit(formData) {
    const { editRecordInCollection, handleReset, setWildCardError } = this.props;

    editRecordInCollection(formData)
      .then(() => {
        handleReset();
      })
      .catch(() => {
        setWildCardError();
      })
      .then(() => {
        setLoadingCursor(false);
      });
  }

  render() {
    const {
      title,
      artist,
      format,
      notes,
      image,
      imageData,
      wikiHref,
      wikiDesc,
      wikiReqDesc,
      wikiImg,
      wikiReqImg,
      selectedCheckboxes,
      allowImgReq,
      ignoreRecordImg,
      showWildCardError,
      rating,
      invalidImg,
      recordImg,
      record,
      handleShowModal,
      handleChange,
      handleKeyUp,
      handleSubmit,
      handleRatingChange,
      handleCheckbox,
      handleSearchRequest,
      handleImgRequest,
      handleResetWiki,
      handleFileUpload,
      handleRemoveImg,
      handleReset,
    } = this.props;

    return (
      <Row>
        {(wikiImg && wikiReqImg.req) || image || (recordImg && !ignoreRecordImg)
          ? (
            <Col lg={4} md={4} sm={4} xs={12}>
              {imageData
                ? <Image src={imageData} rounded fluid />
                : (
                  <Image
                    src={recordImg && !ignoreRecordImg ? `data:image/jpeg;base64,${recordImg}` : wikiImg}
                    rounded
                    fluid
                  />
                )}
            </Col>
          )
          : (
            <Col lg={4} md={4} sm={4} xs={12}>
              <Image src={noRecordImg} rounded fluid />
            </Col>
          )}
        <Col lg={8} md={8} sm={8} xs={8}>
          <Container fluid>
            <Row>
              <Col lg={5} md={5} sm={5} xs={12}>
                <DefaultFormGroup
                  controlId="formControlsTitle"
                  name="title"
                  label="Title:"
                  value={title}
                  type="text"
                  placeholder="Title..."
                  onChange={handleChange}
                />
              </Col>
              <Col lg={5} md={4} sm={5} xs={12}>
                <DefaultFormGroup
                  controlId="formControlsArtist"
                  name="artist"
                  label="Artist:"
                  value={artist}
                  type="text"
                  placeholder="Artist..."
                  onChange={handleChange}
                />
              </Col>
              <Col lg={2} md={3} sm={2} xs={3}>
                <OverlayTrigger placement="right" overlay={tooltip('Remove record')}>
                  <Button
                    id="delete"
                    variant="light"
                    tabIndex={0}
                    className="standard-glyph md-glyph"
                    onClick={handleShowModal}
                    onKeyUp={handleKeyUp}
                  >
                    <FaTrashAlt />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="left" overlay={tooltip('Confirm edit')}>
                  <Button
                    variant="light"
                    id="edit"
                    tabIndex={0}
                    className="standard-glyph md-glyph"
                    onClick={(e) => handleSubmit(e, this.editRecordSubmit)}
                    onKeyUp={(e) => handleKeyUp(e, this.editRecordSubmit)}
                  >
                    <FaCheck />
                  </Button>
                </OverlayTrigger>
              </Col>
            </Row>
            <Row>
              <Col lg={6} md={6} sm={6} xs={12}>
                <h5><b>Format:</b></h5>
                <SelectFormGroup
                  controlId="formControlsFormat"
                  name="format"
                  value={format}
                  onChange={handleChange}
                  options={getValidFormatTypes()}
                />
              </Col>
              <Col lg={6} md={6} sm={6} xs={12}>
                <h5><b>Rating:</b></h5>
                {/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Rating
                    emptySymbol={<TiStarOutline />}
                    fullSymbol={<TiStarFullOutline />}
                    initialRating={rating}
                    onChange={(rate) => handleRatingChange(rate)}
                  />
                </div>
                {/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <FormGroup>
                  <FormCheck
                    id="wikiDescCB"
                    inline
                  >
                    <FormCheck.Input
                      type="checkbox"
                      id="wikiDescCB"
                      onChange={(e) => {
                        handleCheckbox(e);
                        handleSearchRequest();
                      }}
                      checked={selectedCheckboxes.indexOf('wikiDescCB') !== -1}
                    />
                    <FormCheck.Label
                      id="wikiDescCB"
                      onClick={(e) => {
                        handleCheckbox(e);
                        handleSearchRequest();
                      }}
                    >
                      Add description from Wikipedia
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck
                    id="wikiImgCB"
                    inline
                  >
                    <FormCheck.Input
                      id="wikiImgCB"
                      type="checkbox"
                      onChange={(e) => {
                        handleCheckbox(e);
                        handleImgRequest();
                      }}
                      disabled={!allowImgReq}
                      checked={selectedCheckboxes.indexOf('wikiImgCB') !== -1}
                    />
                    <FormCheck.Label
                      id="wikiImgCB"
                      onClick={(e) => {
                        if (!allowImgReq) {
                          return;
                        }

                        handleCheckbox(e);
                        handleImgRequest();
                      }}
                    >
                      Add image from Wikipedia
                    </FormCheck.Label>
                  </FormCheck>
                  {' '}
                  {' '}
                  {(wikiImg || wikiDesc)
                  && (
                  <Button onClick={handleResetWiki}>
                    Reset Wikipedia fields
                  </Button>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <h5><b>Description:</b></h5>
                {wikiReqDesc && wikiDesc}
                {(wikiHref && (wikiReqDesc || wikiReqImg.req)) && <a href={wikiHref} target="blank"> Wikipedia</a>}
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <FormGroup>
                  <Form.File
                    id="formControlsImage"
                    name="image"
                    type="file"
                    label="Upload an image of the record:"
                    help="If you want to upload your own image. (Max: 2MB)"
                    onChange={handleFileUpload}
                    custom
                  />
                </FormGroup>
                {invalidImg
                  && <p className="text-danger">The uploaded file is invalid.</p>}
                {(image || recordImg)
                  && <Button onClick={handleRemoveImg}>Remove file</Button>}
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <h5><b>Notes:</b></h5>
                <FormGroup controlId="formControlsNotes">
                  <FormControl
                    className="vresize"
                    as="textarea"
                    name="notes"
                    value={notes}
                    placeholder="Record markings, playback speed, record quality..."
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={7} md={7} sm={7} xs={12}>
                <h6>{checkTimePassed(record.date)}</h6>
              </Col>
              <Col className="text-right" lg={5} md={5} sm={5} xs={12}>
                {showWildCardError && <WildCardError />}
                <Button
                  variant="success"
                  onClick={(e) => handleSubmit(e, this.editRecordSubmit)}
                  block
                >
                  Confirm Edit
                </Button>
                <Button
                  onClick={handleReset}
                  block
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    );
  }
}

EditRecord.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  notes: PropTypes.string.isRequired,
  imageData: PropTypes.string.isRequired,
  wikiHref: PropTypes.string.isRequired,
  wikiDesc: PropTypes.string.isRequired,
  wikiReqDesc: PropTypes.bool.isRequired,
  wikiImg: PropTypes.string.isRequired,
  wikiReqImg: PropTypes.shape({
    req: PropTypes.bool.isRequired,
    searchTerm: PropTypes.string.isRequired,
  }).isRequired,
  selectedCheckboxes: PropTypes.arrayOf(PropTypes.string).isRequired,
  allowImgReq: PropTypes.bool.isRequired,
  ignoreRecordImg: PropTypes.bool.isRequired,
  showWildCardError: PropTypes.bool.isRequired,
  rating: PropTypes.number.isRequired,
  invalidImg: PropTypes.bool.isRequired,
  /* eslint-disable react/forbid-prop-types */
  image: PropTypes.any, // Should be file, but I don't know how to specify
  recordImg: PropTypes.any, // Should be file, but I don't know how to specify
  /* eslint-enable react/prop-types */
  record: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    format: PropTypes.string,
    rating: PropTypes.number,
    wikiHref: PropTypes.string,
    wikiDesc: PropTypes.string,
    wikiImg: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  handleShowModal: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleKeyUp: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleRatingChange: PropTypes.func.isRequired,
  handleCheckbox: PropTypes.func.isRequired,
  handleSearchRequest: PropTypes.func.isRequired,
  handleImgRequest: PropTypes.func.isRequired,
  handleResetWiki: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  handleRemoveImg: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  editRecordInCollection: PropTypes.func.isRequired,
  setWildCardError: PropTypes.func.isRequired,
};

EditRecord.defaultProps = {
  image: null,
  recordImg: null,
};
