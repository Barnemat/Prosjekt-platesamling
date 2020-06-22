import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { addRecordToWishlist, setNewCollectionElement } from '../../actions';
import SuggestionItem from './SuggestionItem';
import { generateRandIndex, setLoadingCursor } from '../../util';

class Suggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldUpdateOnUnmount: false,
      suggestionItems: [],
    };

    this.getSuggestionItems = this.getSuggestionItems.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddToCollection = this.handleAddToCollection.bind(this);
    this.handleAddToWishlist = this.handleAddToWishlist.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { suggestions } = this.props;

    if (suggestions.length > 0 && prevState.suggestionItems.length == 0) {
      this.setState({ suggestionItems: this.getSuggestionItems(5, suggestions) });
    }
  }

  getSuggestionItems(numSuggestions, suggestions) {
    if (suggestions.length === 0) return;

    const randomIndexes = [];
    for (let i = 0; i < numSuggestions + 1; i++) {
      randomIndexes.push(generateRandIndex(suggestions.length, randomIndexes));
    }

    const suggestionItems = [];
    let i = 0;
    for (const index in randomIndexes) {
      const suggestion = suggestions[index];
      const artist = Object.keys(suggestion)[0];
      const title = suggestion[artist];

      suggestionItems.push(
        <SuggestionItem
          key={i}
          artist={artist}
          title={title}
          addToWishlist={this.handleAddToWishlist}
          addToCollection={this.handleAddToCollection}
          handleDelete={this.handleDelete}
        />,
      );

      i += 1;
    }

    return suggestionItems;
  }

  handleUpdate(e) {
    if (e) e.preventDefault();
    // TODO
  }

  handleDelete(e, title, artist) {
    const { suggestionItems } = this.state;

    for (let i = 0; i < suggestionItems.length; i += 1) {
      if (suggestionItems[i].props.title == title && suggestionItems[i].props.artist == artist) {
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

  componentWillUnmount() {
    const {
      records, wishlist,
    } = this.props;

    if (this.state.shouldUpdateOnUnmount) this.props.setSuggestions(records, wishlist);
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

Suggestions.propTypes = {
  suggestions: PropTypes.array.isRequired,
  records: PropTypes.array.isRequired,
  wishlist: PropTypes.array.isRequired,
};

Suggestions.defaultProps = {};

const mapDispatchToProps = {
  setNewCollectionElement,
};

const mapStateToProps = (state) => ({
  authenticatedUsername: state.authenticate.user.username,
});

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
