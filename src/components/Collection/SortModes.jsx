import React from 'react';
import PropTypes from 'prop-types';
import { Col, Grid, Row, Glyphicon, OverlayTrigger, Button, ButtonToolbar } from 'react-bootstrap';
import SelectFormGroup from './FormComponents/SelectFormGroup';
import tooltip from '../CommonComponents/Tooltip';
import { getSortModes } from '../../util';

export default class SortModes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortModes: getSortModes(),
    };

    this.handleSortChange = this.handleSortChange.bind(this);
  }

  handleSortChange(e) {
    e.preventDefault();
    const { sortModes } = this.state;
    const { value } = e.target;
    const keys = Object.keys(sortModes);

    let key;
    keys.forEach((k) => {
      if (sortModes[k] === value) key = k;
    });

    if (key) this.props.handleSortMode(key);
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <Col lg={6} md={6} sm={6} xs={6}>
            <SelectFormGroup
              id="formControlsSort"
              name="sortMode"
              onChange={this.handleSortChange}
              options={Object.values(this.state.sortModes)}
            />
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <ButtonToolbar>
              <OverlayTrigger placement="top" overlay={tooltip('Enable gallery view')}>
                <Button
                  className="pull-right rm-focus-outline"
                  active={this.props.galleryView}
                  onClick={this.props.handleGalleryView}
                >
                  <Glyphicon glyph="th-large" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={tooltip('Enable list view')}>
                <Button
                  className="pull-right rm-focus-outline"
                  active={!this.props.galleryView}
                  onClick={this.props.handleGalleryView}
                >
                  <Glyphicon glyph="th-list" />
                </Button>
              </OverlayTrigger>
            </ButtonToolbar>
          </Col>
        </Row>
      </Grid>
    );
  }
}

SortModes.propTypes = {
  galleryView: PropTypes.bool.isRequired,
  handleSortMode: PropTypes.func.isRequired,
  handleGalleryView: PropTypes.func.isRequired,
};
