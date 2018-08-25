import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ListGroup } from 'react-bootstrap';
//import { setSuggestions } from '../../actions';
import SuggestionItem from './SuggestionItem';
import { generateRandIndex } from '../../util';

class Suggestions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      shouldUpdateOnUnmount: false,
    };

    this.getSuggestionItems = this.getSuggestionItems.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  getSuggestionItems(numSuggestions) {
    const { suggestions } = this.props;
    const suggestionItems = suggestions.map((item) => {
      for (let key in item) {
        return (<SuggestionItem
          key={`${key}-${item[key]}`}
          artist={key}
          title={item[key]}
        />);
    }});

    let randomIndexes = [];
    for (let i = 0; i < numSuggestions + 1; i++) {
      randomIndexes.push(generateRandIndex(suggestionItems.length, randomIndexes));
    }

    return randomIndexes.map(index => suggestionItems[index]);
  }

  handleUpdate(e) {
    if (e) e.preventDefault();
    // TODO
  }

  componentWillUnmount() {
    const {
      records, wishlist,
    } = this.props;

    if (this.state.shouldUpdateOnUnmount) this.props.setSuggestions(records, wishlist);
  }

  render() {
    const suggestionItems = this.getSuggestionItems(5);

    return (
      <ListGroup componentClass="ul">
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

const mapDispatchToProps = {};

const mapStateToProps = (state) => ({
  //records: state.collection.records,
});

export default connect(mapStateToProps, mapDispatchToProps)(Suggestions);
