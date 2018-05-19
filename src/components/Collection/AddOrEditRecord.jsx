/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import { getBestImageURL, getValidFormatTypes, checkImgValid, setLoadingCursor } from '../../util';
import { sendDoubleWikiSearchRequest, sendWikiImageRequest } from '../../services/api';
import AddRecord from './AddRecord';
import EditRecord from './EditRecord';

export default class AddOrEditRecord extends React.Component {
  constructor(props) {
    super(props);

    const { record, edit } = this.props;

    this.state = {
      title: edit ? record.title : '',
      artist: edit ? record.artist : '',
      format: edit ? record.format : 'CD',
      rating: edit ? record.rating : 0,
      notes: edit ? record.notes : '',
      wikiHref: edit ? record.wikiHref : '',
      wikiDesc: edit ? record.wikiDesc : '',
      wikiImg: edit ? record.wikiImg : '',
      wikiReqDesc: edit && record.wikiDesc !== '',
      wikiReqImg: {
        req: edit && record.wikiImg !== '',
        searchTerm: edit ? record.title : '',
      },
      allowImgReq: edit && record.wikiDesc !== '',
      selectedCheckboxes: [edit && record.wikiDesc ? 'wikiDescCB' : '', edit && record.wikiImg ? 'wikiImgCB' : ''],
      image: undefined,
      imageData: '',
      ignoreRecordImg: false,
      invalidImg: false,
      showWildCardError: false,
      largeForm: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleResetWiki = this.handleResetWiki.bind(this);
    this.handleSearchRequest = this.handleSearchRequest.bind(this);
    this.handleImgRequest = this.handleImgRequest.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleRemoveImg = this.handleRemoveImg.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.setWildCardError = this.setWildCardError.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleLargeForm = this.toggleLargeForm.bind(this);
  }

  setWildCardError() {
    this.setState({ showWildCardError: true });
  }

  handleChange(e) {
    e.preventDefault();
    const { title, largeForm } = this.state;
    const { edit } = this.props;

    if (!edit && title !== '' && !largeForm) {
      this.setState({ [e.target.name]: e.target.value, largeForm: true, showWildCardError: false });
    } else {
      this.setState({ [e.target.name]: e.target.value, showWildCardError: false });
    }
  }

  handleRatingChange(rating) {
    this.setState({ rating });
  }

  handleSubmit(e, submitFunction) {
    e.preventDefault();
    setLoadingCursor(true);

    const { ignoreRecordImg, selectedCheckboxes } = this.state;
    const { record, edit } = this.props;
    const keys = ['title', 'artist', 'format', 'rating', 'wikiHref', 'wikiDesc', 'wikiImg', 'notes', 'image'];
    const formData = new FormData();

    if (edit) formData.append('id', record._id);
    keys.forEach((key) => {
      if (key === 'image') {
        if (ignoreRecordImg) {
          formData.append(key, undefined);
        } else if (this.state[key] !== undefined) {
          formData.append(key, this.state[key]);
        }
      } else if (key === 'wikiDesc') {
        if (selectedCheckboxes.includes('wikiDescCB')) {
          formData.append(key, this.state[key]);
        } else {
          formData.append(key, '');
        }
      } else if (key === 'wikiImg') {
        if (selectedCheckboxes.includes('wikiImgCB')) {
          formData.append(key, this.state[key]);
        } else {
          formData.append(key, '');
        }
      } else {
        formData.append(key, this.state[key]);
      }
    });

    submitFunction(formData);
  }

  handleResetWiki() {
    this.setState({
      allowImgReq: false,
      selectedCheckboxes: [],
      wikiHref: '',
      wikiReqDesc: false,
      wikiReqImg: {
        req: false,
        searchTerm: '',
      },
      wikiDesc: '',
      wikiImg: '',
    });
  }

  handleReset(e) {
    if (e) {
      e.preventDefault();

      if (e.key !== undefined && e.key.toLowerCase() !== 'enter') {
        return;
      }
    }

    this.setState({
      title: '',
      artist: '',
      format: getValidFormatTypes()[0],
      selectedCheckboxes: [],
      rating: 0,
      allowImgReq: false,
      wikiHref: '',
      wikiReqDesc: false,
      wikiReqImg: {
        req: false,
        searchTerm: '',
      },
      wikiDesc: '',
      wikiImg: '',
      largeForm: false,
      notes: '',
      image: undefined,
      imageData: '',
      invalidImg: false,
      showWildCardError: false,
    });
  }

  handleSearchRequest() {
    if (!this.state.wikiDesc) {
      setLoadingCursor(true);
      const searchRequest = sendDoubleWikiSearchRequest('en', this.state.title, this.state.artist);

      searchRequest
        .then((res) => {
          this.setState({
            allowImgReq: true,
            wikiDesc: res[2] ? res[2][0] : '',
            wikiHref: res[3] ? res[3][0] : '',
            wikiReqImg: {
              req: this.state.wikiReqImg.req,
              searchTerm: res[1] && res[1][0] !== '' ? res[1][0] : '',
            },
          });
        })
        .catch(() => {
          this.setState({ showWildCardError: true });
        })
        .then(() => {
          setLoadingCursor(false);
        });
    }
  }

  handleImgRequest() {
    const { searchTerm } = this.state.wikiReqImg;
    if (searchTerm && !this.state.wikiImg) {
      setLoadingCursor();

      sendWikiImageRequest(searchTerm)
        .then((res) => {
          this.setState({ wikiImg: getBestImageURL(searchTerm, JSON.parse(res.request.response)) });
        })
        .catch(() => {
          this.setState({ showWildCardError: true });
        })
        .then(() => {
          setLoadingCursor(false);
        });
    }
  }

  handleCheckbox(e) {
    const { name } = e.target;
    const { selectedCheckboxes: checkedBoxes } = this.state;

    if (checkedBoxes.indexOf(name) === -1) {
      checkedBoxes.push(name);
      this.setState({
        selectedCheckboxes: checkedBoxes,
        wikiReqDesc: name === 'wikiDescCB' || this.state.wikiReqDesc,
        wikiReqImg: {
          req: name === 'wikiImgCB' || this.state.wikiReqImg.req,
          searchTerm: this.state.wikiReqImg.searchTerm,
        },
      });
    } else {
      checkedBoxes.splice(checkedBoxes.indexOf(name), 1);
      this.setState({
        selectedCheckboxes: checkedBoxes,
        wikiReqDesc: name === 'wikiDescCB' ? false : this.state.wikiReqDesc,
        wikiReqImg: {
          req: name === 'wikiImgCB' ? false : this.state.wikiReqImg.req,
          searchTerm: this.state.wikiReqImg.searchTerm,
        },
      });
    }
  }

  handleFileUpload(e) {
    e.preventDefault();
    const reader = new FileReader();
    const image = e.target.files[0];

    reader.onloadend = () => {
      setLoadingCursor(false);
      this.setState({
        image,
        imageData: reader.result,
        ignoreRecordImg: false,
        invalidImg: false,
      });
    };

    reader.onerror = () => {
      setLoadingCursor(false);
    };

    if (image && checkImgValid(image)) {
      setLoadingCursor();
      reader.readAsDataURL(image);
    } else {
      this.setState({ image: undefined, imageData: '', invalidImg: image !== undefined });
    }
  }

  handleRemoveImg(e) {
    e.preventDefault();

    this.setState({
      image: undefined,
      imageData: '',
      ignoreRecordImg: true,
      invalidImg: false,
    });
  }

  handleKeyUp(e, submitFunction) {
    if (e.key.toLowerCase() === 'enter') {
      switch (e.target.id) {
        case 'delete':
          this.props.handleShowModal(e);
          break;
        case 'edit':
          this.handleSubmit(e, submitFunction);
          break;
        default: e.preventDefault();
      }
    }
  }

  toggleLargeForm(e) {
    e.preventDefault();
    this.setState({ largeForm: !this.state.largeForm });
  }

  render() {
    const {
      handleShowModal, record, edit, editRecordInCollection, handleReset, addRecordToCollection, loadCollection,
    } = this.props;
    const recordImg = edit && record.image ? record.image.data : undefined;

    return edit ? (
      <EditRecord
        record={record}
        recordImg={recordImg}
        editRecordInCollection={editRecordInCollection}
        handleShowModal={handleShowModal}
        handleReset={handleReset}
        handleChange={this.handleChange}
        handleKeyUp={this.handleKeyUp}
        handleSubmit={this.handleSubmit}
        handleRatingChange={this.handleRatingChange}
        handleCheckbox={this.handleCheckbox}
        handleSearchRequest={this.handleSearchRequest}
        handleImgRequest={this.handleImgRequest}
        handleResetWiki={this.handleResetWiki}
        handleFileUpload={this.handleFileUpload}
        handleRemoveImg={this.handleRemoveImg}
        setWildCardError={this.setWildCardError}
        {...this.state}
      />) : (
        <AddRecord
          addRecordToCollection={addRecordToCollection}
          loadCollection={loadCollection}
          handleReset={this.handleReset}
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
          handleResetWiki={this.handleResetWiki}
          handleFileUpload={this.handleFileUpload}
          handleRemoveImg={this.handleRemoveImg}
          handleRatingChange={this.handleRatingChange}
          handleCheckbox={this.handleCheckbox}
          handleSearchRequest={this.handleSearchRequest}
          handleImgRequest={this.handleImgRequest}
          toggleLargeForm={this.toggleLargeForm}
          setWildCardError={this.setWildCardError}
          {...this.state}
        />);
  }
}

AddOrEditRecord.propTypes = {
  record: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string,
    format: PropTypes.string,
    rating: PropTypes.number,
    wikiHref: PropTypes.string,
    wikiDesc: PropTypes.string,
    wikiImg: PropTypes.string,
    notes: PropTypes.string,
  }),
  handleShowModal: PropTypes.func,
  handleReset: PropTypes.func,
  editRecordInCollection: PropTypes.func,
  addRecordToCollection: PropTypes.func,
  loadCollection: PropTypes.func,
  edit: PropTypes.bool,
};

AddOrEditRecord.defaultProps = {
  record: null,
  handleReset: null,
  editRecordInCollection: null,
  addRecordToCollection: null,
  loadCollection: null,
  handleShowModal: null,
  edit: false,
};
