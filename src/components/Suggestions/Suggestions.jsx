import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { setNewCollectionElement, setSuggestions } from '../../actions';
import SuggestionItem from './SuggestionItem';
import { generateRandIndex, setLoadingCursor } from '../../util';

class Suggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldUpdateOnUnmount: true,
      suggestionItems: [],
    };

    this.getSuggestionItems = this.getSuggestionItems.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddToCollection = this.handleAddToCollection.bind(this);
    this.handleAddToWishlist = this.handleAddToWishlist.bind(this);
    this.handleSuggestionUpdate = this.handleSuggestionUpdate.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { suggestions } = this.props;

    this.handleSuggestionUpdate();

    if (suggestions.length > 0 && prevState.suggestionItems.length === 0) {
      this.setState({ suggestionItems: this.getSuggestionItems(5, suggestions) });
    }
  }

  componentWillUnmount() {
    const { shouldUpdateOnUnmount } = this.state;
    const {
      records, wishlist, ...props
    } = this.props;

    if (shouldUpdateOnUnmount) props.setSuggestions(records, wishlist);
  }

  getSuggestionItems(numSuggestions, suggestions) {
    if (suggestions.length === 0) return [];

    const randomIndexes = [];
    for (let i = 0; i < (numSuggestions <= suggestions.length ? numSuggestions : suggestions.length); i += 1) {
      randomIndexes.push(generateRandIndex(suggestions.length - 1, randomIndexes));
    }

    return randomIndexes.filter((index) => index > -1).map((index) => {
      const suggestion = suggestions[index];
      const artist = Object.keys(suggestion)[0];
      const title = suggestion[artist];

      return (
        <SuggestionItem
          key={index}
          artist={artist}
          title={title}
          addToWishlist={this.handleAddToWishlist}
          addToCollection={this.handleAddToCollection}
          handleDelete={this.handleDelete}
        />
      );
    });
  }

  handleSuggestionUpdate() {
    const {
      records, suggestions, wishlist, ...props
    } = this.props;

    if (records.length > 0 && wishlist && suggestions.length === 0) {
      props.setSuggestions(records, wishlist);
    }
  }

  handleDelete(e, title, artist) {
    const { suggestionItems } = this.state;

    for (let i = 0; i < suggestionItems.length; i += 1) {
      if (suggestionItems[i].props.title === title && suggestionItems[i].props.artist === artist) {
        suggestionItems[i] = (<span key={suggestionItems[i].key} />);
      }
    }

    this.setState({ suggestionItems });
  }

  handleAddToCollection(e, title, artist) {
    const { ...props } = this.props;

    props.setNewCollectionElement(title, artist);
    this.handleDelete(e, title, artist);
  }

  handleAddToWishlist(e, title, artist) {
    const { authenticatedUsername } = this.props;

    setLoadingCursor(true);

    axios.post('http://localhost:8080/api/wishlist', {
      title, artist, username: authenticatedUsername,
    })
      .then(() => {
        this.handleDelete(e, title, artist);
      })
      .then(() => {
        setLoadingCursor(false);
      });
  }

  render() {
    const { suggestionItems } = this.state;

    return (
      <ListGroup as="ul">
        { suggestionItems }
      </ListGroup>
    );
  }
}

/* eslint-disable react/forbid-prop-types */
Suggestions.propTypes = {
  suggestions: PropTypes.array.isRequired,
  records: PropTypes.array.isRequired,
  wishlist: PropTypes.array.isRequired,
  authenticatedUsername: PropTypes.string.isRequired,
};
/* eslint-enable react/forbid-prop-types */

const mapDispatchToProps = {
  setNewCollectionElement,
  setSuggestions,
};

const mapStateToProps = (state) => ({
  authenticatedUsername: state.authenticate.user.username,
  suggestions: state.suggestions.suggestions,
});

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
