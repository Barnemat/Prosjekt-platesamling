import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Glyphicon, Form } from 'react-bootstrap';
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

    return (
      <Form inline>
        <DefaultFormGroup
          id="formControlsSearch"
          name="search"
          type="text"
          value={search}
          placeholder={`Search in ${wishlist ? 'wishlist...' : 'collection...'}`}
          onChange={this.handleSearch}
        />
        {search
          && (
          <span
            role="button"
            tabIndex={0}
            className="standard-glyph lg-glyph"
            onClick={this.clearSearch}
            onKeyUp={(e) => e.key.toLowerCase() === 'enter' && this.clearSearch(e)}
          >
            <Glyphicon glyph="remove" />
          </span>
          )}
      </Form>
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
