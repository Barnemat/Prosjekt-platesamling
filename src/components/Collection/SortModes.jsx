import React from 'react';
import PropTypes from 'prop-types';
import {
  Col, Container, Row, OverlayTrigger, Button, ButtonGroup,
} from 'react-bootstrap';
import { FaThList, FaThLarge } from 'react-icons/fa';
import SelectFormGroup from './FormComponents/SelectFormGroup';
import tooltip from '../CommonComponents/Tooltip';
import SearchField from '../CommonComponents/SearchField';
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
    const { handleSortMode } = this.props;
    const { value } = e.target;
    const keys = Object.keys(sortModes);

    let key;
    keys.forEach((k) => {
      if (sortModes[k] === value) key = k;
    });

    if (key) handleSortMode(key);
  }

  render() {
    const { sortModes } = this.state;
    const { galleryView, handleGalleryView } = this.props;

    return (
      <Container className="no-padding" fluid>
        <Row>
          <Col lg={3} md={3} sm={3} xs={3}>
            <SelectFormGroup
              id="formControlsSort"
              name="sortMode"
              onChange={this.handleSortChange}
              options={Object.values(sortModes)}
            />
          </Col>
          <Col lg={5} md={5} sm={5} xs={5} className="no-padding">
            <SearchField />
          </Col>
          <Col className="text-right" lg={4} md={4} sm={4} xs={4}>
            <ButtonGroup>
              <OverlayTrigger placement="top" overlay={tooltip('Enable gallery view')}>
                <Button
                  variant="outline-dark"
                  className="rm-focus-outline"
                  active={galleryView}
                  onClick={handleGalleryView}
                >
                  <FaThLarge />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={tooltip('Enable list view')}>
                <Button
                  variant="outline-dark"
                  className="rm-focus-outline"
                  active={!galleryView}
                  onClick={handleGalleryView}
                >
                  <FaThList />
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

SortModes.propTypes = {
  galleryView: PropTypes.bool.isRequired,
  handleSortMode: PropTypes.func.isRequired,
  handleGalleryView: PropTypes.func.isRequired,
};
