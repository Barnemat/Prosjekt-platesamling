import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Col,
  Row,
  Image,
  Button,
  Glyphicon,
  OverlayTrigger,
  FormGroup,
  FormControl,
  Checkbox,
  Collapse,
  FormLabel,
  InputGroup,
  Well,
} from 'react-bootstrap';
import Rating from 'react-rating';
import tooltip from '../CommonComponents/Tooltip';
import { setLoadingCursor, getValidFormatTypes } from '../../util';
import DefaultFormGroup from './FormComponents/DefaultFormGroup';
import SelectFormGroup from './FormComponents/SelectFormGroup';
import WildCardError from '../CommonComponents/WildCardError';

export default class AddRecord extends React.Component {
  constructor(props) {
    super(props);

    this.addRecordSubmit = this.addRecordSubmit.bind(this);
  }

  addRecordSubmit(formData) {
    const {
      addRecordToCollection, loadCollection, handleReset, setWildCardError,
    } = this.props;

    addRecordToCollection(formData)
      .then(() => {
        loadCollection();
        handleReset(undefined, true);
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
      handleSubmit,
      showWildCardError,
      title,
      largeForm,
      handleChange,
      handleReset,
      toggleLargeForm,
      artist,
      format,
      selectedCheckboxes,
      allowImgReq,
      wikiImg,
      wikiDesc,
      handleResetWiki,
      wikiReqImg,
      wikiReqDesc,
      wikiHref,
      handleFileUpload,
      invalidImg,
      image,
      imageData,
      handleRemoveImg,
      notes,
      rating,
      handleRatingChange,
      handleCheckbox,
      handleSearchRequest,
      handleImgRequest,
      disableWishlistFields,
    } = this.props;

    return (
      <form onSubmit={(e) => handleSubmit(e, this.addRecordSubmit)}>
        {showWildCardError && <WildCardError />}
        <TitleFormGroup
          name="title"
          value={title}
          label={largeForm ? 'The name of your record:' : 'Add a record to your collection:'}
          handleChange={handleChange}
          handleReset={handleReset}
          largeForm={largeForm}
          toggleLargeForm={toggleLargeForm}
          glyph={largeForm ? 'minus' : 'plus'}
          tooltip={largeForm ? '' : 'Click here to add a record.'}
          disabled={disableWishlistFields}
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
              onChange={handleChange}
              disabled={disableWishlistFields}
            />
            <SelectFormGroup
              id="formControlsFormat"
              name="format"
              value={format}
              label="The format of the record (e.g. LP, EP, CD):"
              onChange={handleChange}
              options={getValidFormatTypes()}
              disabled={disableWishlistFields}
            />
            <FormGroup>
              <Checkbox
                name="wikiDescCB"
                onChange={(e) => {
                  handleCheckbox(e);
                  handleSearchRequest();
                }}
                checked={selectedCheckboxes.indexOf('wikiDescCB') !== -1}
                inline
              >
                Add description from Wikipedia
              </Checkbox>
              <Checkbox
                name="wikiImgCB"
                onChange={(e) => {
                  handleCheckbox(e);
                  handleImgRequest();
                }}
                disabled={!allowImgReq}
                checked={selectedCheckboxes.indexOf('wikiImgCB') !== -1}
                inline
              >
                Add image from Wikipedia
              </Checkbox>
              {' '}
              {' '}
              {(wikiImg || wikiDesc)
              && (
              <Button onClick={handleResetWiki}>
                Reset Wikipedia fields
              </Button>
              )}
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
              onChange={handleFileUpload}
            />
            {invalidImg
            && <p className="text-danger">The uploaded file is invalid.</p>}
            {image
            && (
            <Container fluid>
              <Row>
                <Col lg={6} md={7} sm={5} xs={8}>
                  <Well bsSize="small">
                    {imageData
                    && <Image src={imageData} responsive />}
                  </Well>
                  <Button bsSize="small" onClick={handleRemoveImg}>Remove file</Button>
                </Col>
              </Row>
            </Container>
            )}
            <FormGroup controlId="formControlsNotes">
              <FormLabel>Add your own notes here:</FormLabel>
              <FormControl
                className="vresize"
                as="textarea"
                name="notes"
                value={notes}
                placeholder="Record markings, playback speed, record quality..."
                onChange={handleChange}
              />
            </FormGroup>
            <Rating
              emptySymbol="glyphicon glyphicon-star-empty"
              fullSymbol="glyphicon glyphicon-star"
              initialRating={rating}
              onChange={(rate) => handleRatingChange(rate)}
            />
            <Button variant="primary" type="submit" block>
              Add record to collection
            </Button>
            <Button onClick={handleReset} block>
              Discard submition
            </Button>
          </div>
        </Collapse>
      </form>
    );
  }
}

AddRecord.propTypes = {
  title: PropTypes.string.isRequired,
  largeForm: PropTypes.bool.isRequired,
  artist: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired,
  selectedCheckboxes: PropTypes.arrayOf(PropTypes.string).isRequired,
  allowImgReq: PropTypes.bool.isRequired,
  wikiImg: PropTypes.string.isRequired,
  wikiDesc: PropTypes.string.isRequired,
  handleResetWiki: PropTypes.func.isRequired,
  wikiReqImg: PropTypes.shape({
    req: PropTypes.bool.isRequired,
    searchTerm: PropTypes.string.isRequired,
  }).isRequired,
  wikiReqDesc: PropTypes.bool.isRequired,
  wikiHref: PropTypes.string.isRequired,
  invalidImg: PropTypes.bool.isRequired,
  imageData: PropTypes.string.isRequired,
  notes: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  /* eslint-disable react/forbid-prop-types */
  image: PropTypes.any, // Should be file, but I don't know how to specify
  /* eslint-enable react/prop-types */
  loadCollection: PropTypes.func.isRequired,
  addRecordToCollection: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleReset: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  handleRemoveImg: PropTypes.func.isRequired,
  handleRatingChange: PropTypes.func.isRequired,
  handleCheckbox: PropTypes.func.isRequired,
  handleSearchRequest: PropTypes.func.isRequired,
  handleImgRequest: PropTypes.func.isRequired,
  showWildCardError: PropTypes.bool.isRequired,
  setWildCardError: PropTypes.func.isRequired,
  toggleLargeForm: PropTypes.func.isRequired,
  disableWishlistFields: PropTypes.bool,
};

AddRecord.defaultProps = {
  image: null,
  disableWishlistFields: false,
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
  disabled,
  ...rest
}) => (
  <FormGroup controlId="formControlsTitle">
    <Container fluid>
      <Row>
        <Col className="no-padding" lg={11} md={11} sm={11} xs={11}>
          {label && <FormLabel>{label}</FormLabel>}
        </Col>
        <Col className="no-padding text-right" lg={1} md={1} sm={1} xs={1}>
          {(largeForm || value)
            && (
            <OverlayTrigger placement="right" overlay={tooltip('Click here to discard submition.')}>
              <span
                role="button"
                tabIndex={0}
                className="standard-glyph md-glyph"
                onClick={handleReset}
                onKeyUp={handleReset}
              >
                <Glyphicon glyph="trash" />
              </span>
            </OverlayTrigger>
            )}
        </Col>
      </Row>
    </Container>
    <InputGroup>
      <FormControl
        type="text"
        name={name}
        value={value}
        placeholder="Record title..."
        onChange={handleChange}
        disabled={disabled}
      />
      <InputGroup.Button>
        { rest.tooltip
          ? (
            <OverlayTrigger placement="right" overlay={tooltip(rest.tooltip)}>
              <Button onClick={toggleLargeForm} disabled={disabled}>
                <Glyphicon glyph={glyph} />
              </Button>
            </OverlayTrigger>
          )
          : (
            <Button onClick={toggleLargeForm} disabled={disabled}>
              <Glyphicon glyph={glyph} />
            </Button>
          )}
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
  disabled: PropTypes.bool,
};

TitleFormGroup.defaultProps = {
  disabled: false,
};

const WikiInfo = ({
  wikiReqDesc,
  wikiReqImg,
  wikiDesc,
  wikiImg,
  wikiHref,
}) => (
  <Collapse in={wikiReqDesc || wikiReqImg.req}>
    {wikiReqDesc && wikiReqImg.req
      ? (
        <div>
          <Well>
            <Container fluid>
              <Row>
                <Col lg={4} md={5} sm={5}>
                  <Collapse in={wikiReqImg.req}>
                    <div>
                      {wikiImg
                        ? <Image src={wikiImg} rounded responsive />
                        : 'No image was found.'}
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
            </Container>
          </Well>
        </div>
      )
      : (
        <div>
          <Well>
            <Collapse in={wikiReqImg.req}>
              <div>
                {wikiImg
                  ? <Image src={wikiImg} rounded responsive />
                  : 'No image was found.'}
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
      )}
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
