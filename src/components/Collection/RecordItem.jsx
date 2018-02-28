import React from 'react';
import PropTypes from 'prop-types';
import { ListGroupItem, Grid, Col, Row, Image, Button, Glyphicon, Modal, OverlayTrigger } from 'react-bootstrap';
import Rating from 'react-rating';
import { checkTimePassed, setLoadingCursor } from '../../util';
import noRecordImg from '../../assets/img/no_record_img.png';
import tooltip from '../CommonComponents/Tooltip';
import EditRecord from './EditRecord';

export default class RecordItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: false,
      showModal: false,
      isEditMode: false,
    };

    this.toggleExpand = this.toggleExpand.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  toggleExpand(e) {
    const {
      notes,
      wikiDesc,
      wikiImg,
    } = this.props.record;

    const isGlyph = e.target.className.split(' ').includes('glyphicon');

    if ((notes || wikiDesc || wikiImg) && (!isGlyph || this.state.isEditMode)) {
      this.setState({ expand: !this.state.expand });
    }
  }

  handleEdit(e) {
    e.preventDefault();
    this.setState({ isEditMode: !this.state.isEditMode, expand: !this.state.isEditMode });
  }

  handleDelete(e) {
    e.preventDefault();
    setLoadingCursor(true);

    this.props.handleDelete(this.props.record)
      .then(() => {
        this.props.loadCollection();
      })
      .catch((err) => {
        console.error(err);
      })
      .then(() => {
        setLoadingCursor(false);
      });
  }

  handleShowModal(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  }

  handleHideModal(e) {
    e.preventDefault();
    this.setState({ showModal: false });
  }

  handleReset() {
    this.props.loadCollection();
    this.setState({
      expand: false,
      showModal: false,
      isEditMode: false,
    });
  }

  render() {
    const image = this.props.record.image ? this.props.record.image.data : undefined;

    return (
      <ListGroupItem className="darker-onhover">
        <Modal show={this.state.showModal} onHide={this.handleHideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Remove record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to remove this record from your collection?</p>
            <p><b>This action can not be undone.</b></p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleHideModal}>Cancel</Button>
            <Button bsStyle="danger" onClick={this.handleDelete}>Remove Record</Button>
          </Modal.Footer>
        </Modal>
        <Grid onClick={this.toggleExpand} fluid>
          {(this.state.expand && !this.state.isEditMode) &&
            <ExpandedView
              record={this.props.record}
              image={image}
              handleEdit={this.handleEdit}
              handleShowModal={this.handleShowModal}
            />}
          {(!this.state.expand && !this.state.isEditMode) &&
            <MinimizedView
              record={this.props.record}
              image={image}
              handleEdit={this.handleEdit}
              handleShowModal={this.handleShowModal}
            />}
          {this.state.isEditMode &&
            <EditRecord
              record={this.props.record}
              handleShowModal={this.handleShowModal}
              handleEdit={this.handleEdit}
              handleReset={this.handleReset}
              editRecordInCollection={this.props.editRecordInCollection}
            />}
        </Grid>
      </ListGroupItem>
    );
  }
}

RecordItem.propTypes = {
  record: PropTypes.shape({
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    format: PropTypes.string,
    rating: PropTypes.num,
    wikiHref: PropTypes.string,
    wikiDesc: PropTypes.string,
    wikiImg: PropTypes.string,
    notes: PropTypes.string,
    image: PropTypes.any,
  }).isRequired,
  loadCollection: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  editRecordInCollection: PropTypes.func.isRequired,
};

const MinimizedView = ({
  record,
  image,
  handleEdit,
  handleShowModal,
}) => (
  <Row>
    {record.wikiImg || image ?
      <Col lg={2} md={4} sm={4} xs={12}>
        <Image src={image ? `data:image/jpeg;base64,${image}` : record.wikiImg} rounded responsive />
      </Col>
    :
      <Col lg={2} md={4} sm={4} xs={12}>
        <Image src={noRecordImg} rounded responsive />
      </Col>
    }
    <Col lg={10} md={8} sm={8} xs={12}>
      <Grid fluid>
        <CommonInformation
          title={record.title}
          artist={record.artist}
          handleEdit={handleEdit}
          handleShowModal={handleShowModal}
        />
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h6>Format:</h6>
            <h6>{record.format}</h6>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h6>Rating:</h6>
            <Rating
              emptySymbol="glyphicon glyphicon-star-empty"
              fullSymbol="glyphicon glyphicon-star"
              initialRating={record.rating}
              readonly
            />
          </Col>
        </Row>
        <Row>
          <Col lg={8} md={8} sm={4}>
            <small>{checkTimePassed(record.date)}</small>
          </Col>
        </Row>
      </Grid>
    </Col>
  </Row>
);

MinimizedView.propTypes = {
  record: PropTypes.shape({
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
  image: PropTypes.string,
  handleEdit: PropTypes.func.isRequired,
  handleShowModal: PropTypes.func.isRequired,
};

MinimizedView.defaultProps = {
  image: undefined,
};

const ExpandedView = ({
  record,
  image,
  handleEdit,
  handleShowModal,
}) => (
  <Row>
    {record.wikiImg || image ?
      <Col lg={4} md={4} sm={4} xs={12}>
        <Image src={image ? `data:image/jpeg;base64,${image}` : record.wikiImg} rounded responsive />
      </Col>
      :
      <Col lg={4} md={4} sm={4} xs={12}>
        <Image src={noRecordImg} rounded responsive />
      </Col>
    }
    <Col lg={8} md={8} sm={8} xs={12}>
      <Grid fluid>
        <CommonInformation
          title={record.title}
          artist={record.artist}
          handleEdit={handleEdit}
          handleShowModal={handleShowModal}
        />
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h5><b>Format:</b></h5>
            <h5>{record.format}</h5>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h5><b>Rating:</b></h5>
            <Rating
              emptySymbol="glyphicon glyphicon-star-empty"
              fullSymbol="glyphicon glyphicon-star"
              initialRating={record.rating}
              readonly
            />
          </Col>
        </Row>
        <Row>
          {record.wikiDesc &&
            <Col lg={12} md={12} sm={12} xs={12}>
              <h5><b>Description:</b></h5>
              {record.wikiDesc}
              {(record.wikiHref && <a href={record.wikiHref} target="blank"> Wikipedia</a>) ||
                <a href="https://en.wikipedia.com" target="blank"> Wikipedia</a>
              }
            </Col>
          }
        </Row>
        <Row>
          {record.notes &&
            <Col lg={12} md={12} sm={12} xs={12}>
              <h5><b>Notes:</b></h5>
              {record.notes}
            </Col>
          }
        </Row>
        <Row>
          <Col lg={8} md={8} sm={8} xs={8}>
            <h6>{checkTimePassed(record.date)}</h6>
          </Col>
        </Row>
      </Grid>
    </Col>
  </Row>
);

ExpandedView.propTypes = {
  record: PropTypes.shape({
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
  image: PropTypes.string,
  handleEdit: PropTypes.func.isRequired,
  handleShowModal: PropTypes.func.isRequired,
};

ExpandedView.defaultProps = {
  image: undefined,
};

const CommonInformation = ({
  title,
  artist,
  handleEdit,
  handleShowModal,
}) => (
  <Row>
    <Col lg={10} md={9} sm={10} xs={9}>
      <h4>{artist ? `${artist} - ` : ''}{title}</h4>
    </Col>
    <Col lg={2} md={3} sm={2} xs={3}>
      <OverlayTrigger placement="right" overlay={tooltip('Remove record')}>
        <span
          role="button"
          tabIndex={0}
          className="standard-glyph pull-right"
          onClick={handleShowModal}
          onKeyUp={e => e.key.toLowerCase() === 'enter' && handleShowModal(e)}
        >
          <Glyphicon glyph="trash" />
        </span>
      </OverlayTrigger>
      <OverlayTrigger placement="left" overlay={tooltip('Edit record')}>
        <span
          role="button"
          tabIndex={0}
          className="standard-glyph pull-right"
          onClick={handleEdit}
          onKeyUp={e => e.key.toLowerCase() === 'enter' && handleEdit(e)}
        >
          <Glyphicon glyph="pencil" />
        </span>
      </OverlayTrigger>
    </Col>
  </Row>
);

CommonInformation.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string,
  handleEdit: PropTypes.func.isRequired,
  handleShowModal: PropTypes.func.isRequired,
};

CommonInformation.defaultProps = {
  artist: '',
};
