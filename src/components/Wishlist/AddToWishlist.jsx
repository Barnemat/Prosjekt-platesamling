import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Collapse,
} from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { setLoadingCursor, getValidFormatTypes } from '../../util';
import DefaultFormGroup from '../Collection/FormComponents/DefaultFormGroup';
import SelectFormGroup from '../Collection/FormComponents/SelectFormGroup';
import WildCardError from '../CommonComponents/WildCardError';

export default class AddToWishlist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      artist: '',
      format: 'CD',
      show: false,
      showWildCardError: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
  }

  handleChange(e) {
    e.preventDefault();

    this.setState({ [e.target.name]: e.target.value, showWildCardError: false });
  }

  handleSubmit(e) {
    e.preventDefault();
    const {
      title, artist, format,
    } = this.state;

    const { addRecordToWishlist, loadWishlist, authenticatedUsername } = this.props;

    setLoadingCursor(true);

    addRecordToWishlist({
      title, artist, format, username: authenticatedUsername,
    })
      .then(() => {
        loadWishlist();
        this.handleReset();
      })
      .catch(() => {
        this.setState({ showWildCardError: true });
      })
      .then(() => {
        setLoadingCursor(false);
      });
  }

  handleReset() {
    this.setState({
      title: '',
      artist: '',
      show: false,
      showWildCardError: false,
    });
  }

  toggleShow(e) {
    e.preventDefault();
    const { show } = this.state;

    if (!show) {
      this.setState({ show: true });
    } else {
      this.handleReset();
    }
  }

  render() {
    const {
      title,
      artist,
      show,
      showWildCardError,
    } = this.state;

    return (
      <div>
        <Button
          className="margin-bottom"
          variant="outline-dark"
          onClick={this.toggleShow}
          block
        >
          {show ? <FaMinus /> : <FaPlus />}
        </Button>
        <Collapse in={show}>
          <form onSubmit={this.handleSubmit}>
            {showWildCardError && <WildCardError />}
            <DefaultFormGroup
              controlId="formControlsTitleW"
              name="title"
              value={title}
              type="text"
              label="The title of the record:"
              placeholder="Title..."
              onChange={this.handleChange}
            />
            <DefaultFormGroup
              controlId="formControlsArtistW"
              name="artist"
              value={artist}
              type="text"
              label="The artist of the record:"
              placeholder="Artist..."
              onChange={this.handleChange}
            />
            <SelectFormGroup
              controlId="formControlsFormatW"
              name="format"
              label="The format of the record (e.g. LP, EP, CD):"
              onChange={this.handleChange}
              options={getValidFormatTypes()}
            />
            <Button variant="primary" type="submit" block>
              Add record to wishlist
            </Button>
          </form>
        </Collapse>
      </div>
    );
  }
}

AddToWishlist.propTypes = {
  addRecordToWishlist: PropTypes.func.isRequired,
  loadWishlist: PropTypes.func.isRequired,
  authenticatedUsername: PropTypes.string.isRequired,
};
