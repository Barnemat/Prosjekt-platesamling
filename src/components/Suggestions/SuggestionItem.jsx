import React from 'react';
import PropTypes from 'prop-types';
import {
  Container, Row, Col, Button, ListGroupItem, ButtonGroup, OverlayTrigger,
} from 'react-bootstrap';
import { FaWindowClose } from 'react-icons/fa';
import tooltip from '../CommonComponents/Tooltip';

const SuggestionItem = ({
  title, artist, addToWishlist, addToCollection, handleDelete,
}) => (
  <ListGroupItem className="darker-onhover">
    <Container fluid>
      <Row>
        <Col className="no-padding" lg={10} md={10} sm={10} xs={10}>
          <h5 className="no-margin-bottom"><strong>{artist}</strong></h5>
        </Col>
        <Col className="no-padding text-right" lg={2} md={2} sm={2} xs={2}>
          <OverlayTrigger placement="left" overlay={tooltip('Remove suggestion.')}>
            <Button
              className="p-0"
              variant="light"
              size="sm"
              onClick={(e) => handleDelete(e, title, artist)}
            >
              <FaWindowClose />
            </Button>
          </OverlayTrigger>
        </Col>
      </Row>
      <Row>
        <Col className="no-padding" lg={12} md={12} sm={12} xs={12}>
          <h5>{title}</h5>
        </Col>
      </Row>
      <Row>
        <Col className="no-padding" lg={12} md={12} sm={12} xs={12}>
          <ButtonGroup size="sm">
            <Button
              variant="success"
              onClick={(e) => addToCollection(e, title, artist)}
            >
              Add to collection
            </Button>
            <Button
              variant="outline-dark"
              onClick={(e) => addToWishlist(e, title, artist)}
            >
              Add to wishlist
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Container>
  </ListGroupItem>
);

SuggestionItem.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  addToWishlist: PropTypes.func.isRequired,
  addToCollection: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default SuggestionItem;
