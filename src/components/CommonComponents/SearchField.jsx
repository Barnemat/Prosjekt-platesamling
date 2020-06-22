import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Form, Button, Col, Container, Row,
} from 'react-bootstrap';
import { FaUndo } from 'react-icons/fa';
import DefaultFormGroup from '../Collection/FormComponents/DefaultFormGroup';
import { setSearch, resetSearch } from '../../actions';

class SearchField extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  handleSearch(e) {
    e.preventDefault();
    const { ...props } = this.props;
    const { value } = e.target;
    props.setSearch(value);
  }

  clearSearch(e) {
    e.preventDefault();
    const { ...props } = this.props;
    props.resetSearch();
  }

  render() {
    const { search, wishlist } = this.props;

    const size = search ? 11 : 12;

    return (
      <Container fluid>
        <Row>
          <Col className="p-0" lg={size} md={size} sm={size} xs={size}>
            <Form inline>
              <DefaultFormGroup
                className="w-100"
                classProps="w-100"
                id="formControlsSearch"
                name="search"
                type="text"
                value={search}
                placeholder={`Search in ${wishlist ? 'wishlist...' : 'collection...'}`}
                onChange={this.handleSearch}
              />
            </Form>
          </Col>

          {search
        && (
          <Col className="p-0" lg={1} md={1} sm={1} xs={1}>
            <Button
              variant="light"
              tabIndex={0}
              className="lg-glyph pt-0"
              onClick={this.clearSearch}
              onKeyUp={(e) => e.key.toLowerCase() === 'enter' && this.clearSearch(e)}
            >
              <FaUndo />
            </Button>
          </Col>
        )}
        </Row>
      </Container>
    );
  }
}

SearchField.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  wishlist: PropTypes.bool,
};

SearchField.defaultProps = {
  wishlist: false,
};

const mapStateToProps = (state) => ({
  search: state.search,
});

const mapDispatchToProps = {
  setSearch,
  resetSearch,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchField);
