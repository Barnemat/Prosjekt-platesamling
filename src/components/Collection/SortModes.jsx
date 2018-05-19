import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Grid, Row, Glyphicon, OverlayTrigger, Button, ButtonGroup, Form } from 'react-bootstrap';
import SelectFormGroup from './FormComponents/SelectFormGroup';
import DefaultFormGroup from './FormComponents/DefaultFormGroup';
import tooltip from '../CommonComponents/Tooltip';
import { getSortModes } from '../../util';
import { setSearch, resetSearch } from '../../actions';

class SortModes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortModes: getSortModes(),
    };

    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
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

  handleSearch(e) {
    e.preventDefault();
    const { value } = e.target;
    this.props.setSearch(value);
  }

  clearSearch(e) {
    e.preventDefault();
    this.props.resetSearch();
  }

  render() {
    return (
      <Grid className="no-padding" fluid>
        <Row>
          <Col lg={3} md={3} sm={3} xs={3}>
            <SelectFormGroup
              id="formControlsSort"
              name="sortMode"
              onChange={this.handleSortChange}
              options={Object.values(this.state.sortModes)}
            />
          </Col>
          <Col lg={3} md={3} sm={3} xs={3} className="no-padding">
            <Form inline>
              <DefaultFormGroup
                id="formControlsSearch"
                name="search"
                type="text"
                value={this.props.search}
                placeholder="Search in collection..."
                onChange={this.handleSearch}
              />
              {this.props.search &&
                <span
                  role="button"
                  tabIndex={0}
                  className="standard-glyph lg-glyph"
                  onClick={this.clearSearch}
                  onKeyUp={e => e.key.toLowerCase() === 'enter' && this.clearSearch(e)}
                >
                  <Glyphicon glyph="remove" />
                </span>}
            </Form>
          </Col>
          <Col lg={6} md={6} sm={6} xs={6}>
            <ButtonGroup className="pull-right">
              <OverlayTrigger placement="top" overlay={tooltip('Enable gallery view')}>
                <Button
                  className="rm-focus-outline"
                  active={this.props.galleryView}
                  onClick={this.props.handleGalleryView}
                >
                  <Glyphicon glyph="th-large" />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={tooltip('Enable list view')}>
                <Button
                  className="rm-focus-outline"
                  active={!this.props.galleryView}
                  onClick={this.props.handleGalleryView}
                >
                  <Glyphicon glyph="th-list" />
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

SortModes.propTypes = {
  search: PropTypes.string.isRequired,
  galleryView: PropTypes.bool.isRequired,
  handleSortMode: PropTypes.func.isRequired,
  handleGalleryView: PropTypes.func.isRequired,
  setSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  search: state.search,
});

const mapDispatchToProps = {
  setSearch,
  resetSearch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SortModes);
