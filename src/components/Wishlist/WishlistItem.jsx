import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ListGroupItem, Container, Col, Row, Button, Glyphicon, OverlayTrigger, Collapse, Well,
} from 'react-bootstrap';
import { setLoadingCursor, getSplittedStringsForSearchFormatting } from '../../util';
import tooltip from '../CommonComponents/Tooltip';
import WildCardError from '../CommonComponents/WildCardError';
import AddOrEditRecord from '../Collection/AddOrEditRecord';

class WishlistItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddMode: false,
      showWildCardError: false,
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleAdd(e) {
    e.preventDefault();
    this.setState((state) => ({
      isAddMode: !state.isAddMode, showWildCardError: false,
    }));
  }

  handleDelete(e) {
    if (e) e.preventDefault();
    setLoadingCursor(true);

    const { record, loadWishlist, ...props } = this.props;

    props.handleDelete(record)
      .then(() => {
        loadWishlist();
      })
      .catch(() => {
        this.setState({ showWildCardError: true });
      })
      .then(() => {
        setLoadingCursor(false);
      });
  }

  handleReset(shouldDelete) {
    if (shouldDelete) this.handleDelete();

    this.setState({
      isAddMode: false,
      showWildCardError: false,
    });
  }

  render() {
    const {
      record, search, addRecordToCollection, loadWishlist,
    } = this.props;

    const { isAddMode, showWildCardError } = this.state;

    const artistStrings = getSplittedStringsForSearchFormatting(record.artist, search);
    const titleStrings = getSplittedStringsForSearchFormatting(record.title, search);

    return (
      <ListGroupItem className="darker-onhover">
        <Container fluid>
          <Row className="margin-bottom">
            <Col lg={11} md={11} sm={11} xs={11}>
              <span className="h4">
                {artistStrings[0]}
                <span className="yellow-bg">{artistStrings[1]}</span>
                {artistStrings[2]}
                {record.artist && ' - '}
                {titleStrings[0]}
                <span className="yellow-bg">{titleStrings[1]}</span>
                {titleStrings[2]}
              </span>
              <span className="h5">
                {record.format && ` (${record.format})`}
              </span>
            </Col>
            {!isAddMode
              && (
              <Col lg={1} md={1} sm={1} xs={1}>
                <div>
                  <OverlayTrigger placement="right" overlay={tooltip('Remove record from wishlist')}>
                    <span
                      role="button"
                      tabIndex={0}
                      className="standard-glyph pull-right md-glyph"
                      onClick={this.handleDelete}
                      onKeyUp={(e) => e.key.toLowerCase() === 'enter' && this.handleDelete(e)}
                    >
                      <Glyphicon glyph="trash" />
                    </span>
                  </OverlayTrigger>
                </div>
              </Col>
              )}
          </Row>
          {!isAddMode
            && (
            <Row className="margin-bottom">
              <Col lg={12} md={12} sm={12} xs={12}>
                <Button variant="success" onClick={this.handleAdd}>
                  Add record to collection
                </Button>
              </Col>
            </Row>
            )}
          <Collapse in={isAddMode}>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <Well>
                  <AddOrEditRecord
                    title={record.title}
                    artist={record.artist}
                    format={record.format}
                    addRecordToCollection={addRecordToCollection}
                    loadCollection={loadWishlist}
                    handleReset={this.handleReset}
                    expand
                    disableWishlistFields
                  />
                </Well>
              </Col>
            </Row>
          </Collapse>
          <Row>
            {showWildCardError && <WildCardError />}
          </Row>
        </Container>
      </ListGroupItem>
    );
  }
}

WishlistItem.propTypes = {
  record: PropTypes.shape({
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    format: PropTypes.string,
  }).isRequired,
  search: PropTypes.string.isRequired,
  loadWishlist: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  addRecordToCollection: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  search: state.search,
});

export default connect(mapStateToProps)(WishlistItem);
