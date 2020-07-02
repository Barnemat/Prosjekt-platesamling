import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ListGroupItem, Container, Col, Row, Image, Button, Modal, OverlayTrigger,
} from 'react-bootstrap';
import { FaTrashAlt, FaPen } from 'react-icons/fa';
import { TiStarOutline, TiStarFullOutline } from 'react-icons/ti';
import Rating from 'react-rating';
import { setLoadingCursor, getSplittedStringsForSearchFormatting } from '../../util';
import noRecordImg from '../../assets/img/logo-vanlig.png';
import tooltip from '../CommonComponents/Tooltip';
import WildCardError from '../CommonComponents/WildCardError';
import AddOrEditRecord from './AddOrEditRecord';
import DateAdded from './DateAdded';

const MinimizedView = ({
  record,
  image,
  handleEdit,
  handleShowModal,
  search,
  publicUsername,
  galleryView,
}) => (
  <Row>
    {record.wikiImg || image
      ? (
        <Col className={galleryView ? 'p-0' : ''} lg={2} md={4} sm={4} xs={12}>
          <Image src={image ? `data:image/jpeg;base64,${image}` : record.wikiImg} rounded fluid />
        </Col>
      )
      : (
        <Col className={galleryView ? 'p-0' : ''} lg={2} md={4} sm={4} xs={12}>
          <Image src={noRecordImg} rounded fluid />
        </Col>
      )}
    <Col className={galleryView ? 'p-0' : ''} lg={10} md={8} sm={8} xs={12}>
      <Container fluid>
        <CommonInformation
          title={record.title}
          artist={record.artist}
          search={search}
          handleEdit={handleEdit}
          handleShowModal={handleShowModal}
          publicUsername={publicUsername}
        />
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h6>Format:</h6>
            <h6>{record.format}</h6>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h6>Rating:</h6>
            <Rating
              emptySymbol={<TiStarOutline />}
              fullSymbol={<TiStarFullOutline />}
              initialRating={record.rating}
              readonly
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <DateAdded date={record.date} small />
          </Col>
          {!galleryView && (
            <Col className="text-right" lg={4} md={4} sm={4} xs={4}>
              <Button
                variant="outline-dark"
                size="sm"
                onClick={(e) => e.preventDefault()}
              >
                Show more
              </Button>
            </Col>
          )}
        </Row>
      </Container>
    </Col>
  </Row>
);

MinimizedView.propTypes = {
  record: PropTypes.shape({
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
  image: PropTypes.string,
  search: PropTypes.string.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleShowModal: PropTypes.func.isRequired,
  publicUsername: PropTypes.string,
  galleryView: PropTypes.bool.isRequired,
};

MinimizedView.defaultProps = {
  image: undefined,
  publicUsername: null,
};

const ExpandedView = ({
  record,
  image,
  handleEdit,
  handleShowModal,
  search,
  publicUsername,
}) => (
  <Row>
    {record.wikiImg || image
      ? (
        <Col lg={4} md={4} sm={4} xs={12}>
          <Image src={image ? `data:image/jpeg;base64,${image}` : record.wikiImg} rounded fluid />
        </Col>
      )
      : (
        <Col lg={4} md={4} sm={4} xs={12}>
          <Image src={noRecordImg} rounded fluid />
        </Col>
      )}
    <Col lg={8} md={8} sm={8} xs={12}>
      <Container fluid>
        <CommonInformation
          title={record.title}
          artist={record.artist}
          search={search}
          handleEdit={handleEdit}
          handleShowModal={handleShowModal}
          publicUsername={publicUsername}
        />
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h5><b>Format:</b></h5>
            <h5>{record.format}</h5>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <h5><b>Rating:</b></h5>
            <Rating
              emptySymbol={<TiStarOutline />}
              fullSymbol={<TiStarFullOutline />}
              initialRating={record.rating}
              readonly
            />
          </Col>
        </Row>
        <Row>
          {record.wikiDesc
            && (
            <Col lg={12} md={12} sm={12} xs={12}>
              <h5><b>Description:</b></h5>
              {record.wikiDesc}
              {(record.wikiHref && <a href={record.wikiHref} target="blank"> Wikipedia</a>)
                || <a href="https://en.wikipedia.com" target="blank"> Wikipedia</a>}
            </Col>
            )}
        </Row>
        <Row>
          {record.notes
            && (
            <Col lg={12} md={12} sm={12} xs={12}>
              <h5><b>Notes:</b></h5>
              {record.notes}
            </Col>
            )}
        </Row>
        <Row>
          <Col lg={8} md={8} sm={8} xs={8} className="mt-2">
            <DateAdded date={record.date} />
          </Col>
          <Col className="text-right" lg={4} md={4} sm={4} xs={4}>
            <Button
              variant="outline-dark"
              size="sm"
              onClick={(e) => e.preventDefault()}
            >
              Show less
            </Button>
          </Col>
        </Row>
      </Container>
    </Col>
  </Row>
);

ExpandedView.propTypes = {
  record: PropTypes.shape({
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
  image: PropTypes.string,
  search: PropTypes.string.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleShowModal: PropTypes.func.isRequired,
  publicUsername: PropTypes.string,
};

ExpandedView.defaultProps = {
  image: undefined,
  publicUsername: null,
};

const CommonInformation = ({
  title,
  artist,
  handleEdit,
  handleShowModal,
  search,
  publicUsername,
}) => {
  const artistStrings = getSplittedStringsForSearchFormatting(artist, search);
  const titleStrings = getSplittedStringsForSearchFormatting(title, search);

  return (
    <Row>
      <Col lg={10} md={9} sm={10} xs={9}>
        <h5>
          {artistStrings[0]}
          <span className="yellow-bg">{artistStrings[1]}</span>
          {artistStrings[2]}
          {artist && ' - '}
          {titleStrings[0]}
          <span className="yellow-bg">{titleStrings[1]}</span>
          {titleStrings[2]}
        </h5>
      </Col>
      <Col className="p-0 text-right" lg={2} md={3} sm={2} xs={3}>
        {!publicUsername
        && (
        <div>
          <OverlayTrigger placement="left" overlay={tooltip('Edit record')}>
            <Button
              variant="light"
              tabIndex={0}
              className="standard-glyph md-glyph"
              onClick={handleEdit}
              onKeyUp={(e) => e.key.toLowerCase() === 'enter' && handleEdit(e)}
            >
              <FaPen />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="right" overlay={tooltip('Remove record')}>
            <Button
              variant="light"
              tabIndex={0}
              className="standard-glyph md-glyph"
              onClick={handleShowModal}
              onKeyUp={(e) => e.key.toLowerCase() === 'enter' && handleShowModal(e)}
            >
              <FaTrashAlt />
            </Button>
          </OverlayTrigger>
        </div>
        )}
      </Col>
    </Row>
  );
};

CommonInformation.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string,
  search: PropTypes.string.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleShowModal: PropTypes.func.isRequired,
  publicUsername: PropTypes.string,
};

CommonInformation.defaultProps = {
  artist: '',
  publicUsername: null,
};

class RecordItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: false,
      showModal: false,
      isEditMode: false,
      showWildCardError: false,
    };

    this.toggleExpand = this.toggleExpand.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  toggleExpand() {
    const { isEditMode } = this.state;
    const { record, galleryView } = this.props;
    const {
      notes,
      wikiDesc,
      wikiImg,
    } = record;

    if ((notes || wikiDesc || wikiImg) && !(isEditMode || galleryView)) {
      this.setState((state) => ({
        expand: !state.expand,
        showWildCardError: false,
      }));
    }
  }

  handleEdit(e) {
    e.stopPropagation();

    this.setState((state) => ({
      isEditMode: !state.isEditMode,
      expand: !state.isEditMode,
      showWildCardError: false,
    }));
  }

  handleDelete(e) {
    e.preventDefault();
    setLoadingCursor(true);

    const { record, handleDelete, loadCollection } = this.props;

    handleDelete(record)
      .then(() => {
        loadCollection();
      })
      .catch(() => {
        this.setState({ showWildCardError: true });
      })
      .then(() => {
        setLoadingCursor(false);
      });
  }

  handleShowModal(e) {
    if (e) e.stopPropagation();
    this.setState({ showModal: true });
  }

  handleHideModal(e) {
    if (e) e.preventDefault();
    this.setState({ showModal: false });
  }

  handleReset() {
    const { loadCollection } = this.props;

    loadCollection();
    this.setState({
      expand: false,
      showModal: false,
      isEditMode: false,
      showWildCardError: false,
    });
  }

  render() {
    const {
      showModal, expand, isEditMode, showWildCardError,
    } = this.state;
    const {
      record, search, publicUsername, editRecordInCollection, galleryView,
    } = this.props;
    const image = record.image ? record.image.data : undefined;

    return (
      <ListGroupItem className="darker-onhover rm-p-below-xl">
        <Modal show={showModal} onHide={this.handleHideModal}>
          <Modal.Header closeButton>
            <Modal.Title>Remove record</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to remove this record from your collection?</p>
            <p><b>This action can not be undone.</b></p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleHideModal}>Cancel</Button>
            <Button variant="danger" onClick={this.handleDelete}>Remove Record</Button>
          </Modal.Footer>
        </Modal>
        <Container onClick={this.toggleExpand} fluid>
          {(expand && !isEditMode && !galleryView)
            && (
            <ExpandedView
              record={record}
              image={image}
              search={search}
              handleEdit={this.handleEdit}
              handleShowModal={this.handleShowModal}
              publicUsername={publicUsername}
            />
            )}
          {(!expand && !isEditMode)
            && (
            <MinimizedView
              record={record}
              image={image}
              search={search}
              handleEdit={this.handleEdit}
              handleShowModal={this.handleShowModal}
              publicUsername={publicUsername}
              galleryView={galleryView}
            />
            )}
          {isEditMode
            && (
            <AddOrEditRecord
              newRecord={{}}
              record={record}
              handleShowModal={this.handleShowModal}
              handleReset={this.handleReset}
              editRecordInCollection={editRecordInCollection}
              edit
            />
            )}
          {showWildCardError && <WildCardError />}
        </Container>
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
    rating: PropTypes.number,
    wikiHref: PropTypes.string,
    wikiDesc: PropTypes.string,
    wikiImg: PropTypes.string,
    notes: PropTypes.string,
    image: PropTypes.any,
  }).isRequired,
  search: PropTypes.string.isRequired,
  loadCollection: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  editRecordInCollection: PropTypes.func.isRequired,
  publicUsername: PropTypes.string,
  galleryView: PropTypes.bool.isRequired,
};

RecordItem.defaultProps = {
  publicUsername: null,
};

const mapStateToProps = (state) => ({
  search: state.search,
});

export default connect(mapStateToProps)(RecordItem);
