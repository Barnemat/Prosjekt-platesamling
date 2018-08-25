import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Button, ListGroupItem, ButtonGroup, OverlayTrigger, Glyphicon } from 'react-bootstrap';
import tooltip from '../CommonComponents/Tooltip';

export default class SuggestionItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, artist } = this.props;
    return (
      <ListGroupItem className="darker-onhover">
        <Grid fluid>
          <Row>
            <Col className="no-padding" lg={10} md={10} sm={10} xs={10}>
              <h5 className="no-margin-bottom"><strong>{artist}</strong></h5>
            </Col>
            <Col className="no-padding text-right" lg={2} md={2} sm={2} xs={2}>
              <OverlayTrigger placement="left" overlay={tooltip('Remove suggestion.')}>
                <Button bsSize="xsmall">
                  <Glyphicon glyph="remove" />
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
          <Row>
            <Col className="no-padding" lg={12} md={12} sm={12} xs={12}>
              <h5 className="no-margin-bottom">{title}</h5>
            </Col>
          </Row>
          <Row>
            <h5 className="no-margin-bottom"><strong>Add to:</strong></h5>
          </Row>
          <Row>
            <Col className="no-padding" lg={12} md={12} sm={12} xs={12}>
              <ButtonGroup bsSize="xsmall">
                <Button bsStyle="success">
                  Collection
                </Button>
                <Button>
                  Wishlist
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Grid>
      </ListGroupItem>
    );
  }
}

SuggestionItem.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
};

SuggestionItem.defaultProps = {};
