/* eslint-disable no-underscore-dangle */

import React from 'react';
import PropTypes from 'prop-types';
import {
  getBestImageURL, getValidFormatTypes, checkImgValid, setLoadingCursor,
} from '../../util';
import { sendDoubleWikiSearchRequest, sendWikiImageRequest, sendDescRequest } from '../../services/api';
import AddRecord from './AddRecord';
import EditRecord from './EditRecord';

export default class AddOrEditRecord extends React.Component {
  constructor(props) {
    super(props);

    const {
      record, edit, title, artist, format, expand,
    } = this.props;

    this.state = {
      title: edit ? record.title : title,
      artist: edit ? record.artist : artist,
      format: edit ? record.format : format,
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
      largeForm: expand,
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

    const { ignoreRecordImg, selectedCheckboxes, ...state } = this.state;
    const { record, edit } = this.props;
    const keys = ['title', 'artist', 'format', 'rating', 'wikiHref', 'wikiDesc', 'wikiImg', 'notes', 'image'];
    const formData = new FormData();

    if (edit) formData.append('id', record._id);
    keys.forEach((key) => {
      if (key === 'image') {
        if (ignoreRecordImg) {
          formData.append(key, undefined);
        } else if (state[key] !== undefined) {
          formData.append(key, state[key]);
        }
      } else if (key === 'wikiDesc') {
        if (selectedCheckboxes.includes('wikiDescCB')) {
          formData.append(key, state[key]);
        } else {
          formData.append(key, '');
        }
      } else if (key === 'wikiImg') {
        if (selectedCheckboxes.includes('wikiImgCB')) {
          formData.append(key, state[key]);
        } else {
          formData.append(key, '');
        }
      } else {
        formData.append(key, state[key]);
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

  handleReset(e, submitted) {
    if (e) {
      e.preventDefault();

      if (e.key !== undefined && e.key.toLowerCase() !== 'enter') {
        return;
      }
    }

    const {
      title, artist, format, expand, handleReset,
    } = this.props;

    if (handleReset) handleReset(submitted);

    this.setState({
      title: title || '',
      artist: artist || '',
      format: format || getValidFormatTypes()[0],
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
      largeForm: expand,
      notes: '',
      image: undefined,
      imageData: '',
      invalidImg: false,
      showWildCardError: false,
    });
  }

  handleSearchRequest() {
    const { wikiDesc, title, wikiReqImg } = this.state;

    if (!wikiDesc) {
      setLoadingCursor(true);
      const searchRequest = sendDoubleWikiSearchRequest('en', title, 'album');

      searchRequest
        .then((res) => {
          const href = res[3] ? res[3][0] : '';

          if (href) {
            sendDescRequest('en', res[1][0])
              .then((descRes) => {
                const page = descRes.data.query.pages ? descRes.data.query.pages[0] : { extract: '' };
                const desc = page.extract;

                this.setState({
                  allowImgReq: true,
                  wikiDesc: desc,
                  wikiHref: href,
                  wikiReqImg: {
                    req: wikiReqImg.req,
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
          } else {
            this.setState({
              allowImgReq: true,
              wikiDesc: '',
              wikiHref: '',
              wikiReqImg: {
                req: wikiReqImg.req,
                searchTerm: '',
              },
            });
          }
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
    const { wikiReqImg, wikiImg } = this.state;
    const { searchTerm } = wikiReqImg;

    if (searchTerm && !wikiImg) {
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
    const { id } = e.target;
    const { selectedCheckboxes: checkedBoxes, wikiReqDesc, wikiReqImg } = this.state;

    if (checkedBoxes.indexOf(id) === -1) {
      checkedBoxes.push(id);
      this.setState({
        selectedCheckboxes: checkedBoxes,
        wikiReqDesc: id === 'wikiDescCB' || wikiReqDesc,
        wikiReqImg: {
          req: id === 'wikiImgCB' || wikiReqImg.req,
          searchTerm: wikiReqImg.searchTerm,
        },
      });
    } else {
      checkedBoxes.splice(checkedBoxes.indexOf(id), 1);
      this.setState({
        selectedCheckboxes: checkedBoxes,
        wikiReqDesc: id === 'wikiDescCB' ? false : wikiReqDesc,
        wikiReqImg: {
          req: id === 'wikiImgCB' ? false : wikiReqImg.req,
          searchTerm: wikiReqImg.searchTerm,
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
    const { handleShowModal } = this.props;

    if (e.key.toLowerCase() === 'enter') {
      switch (e.target.id) {
        case 'delete':
          handleShowModal(e);
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

    this.setState((state) => ({
      largeForm: !state.largeForm,
    }));
  }

  render() {
    const {
      handleShowModal,
      record,
      edit,
      editRecordInCollection,
      handleReset,
      addRecordToCollection,
      loadCollection,
      disableWishlistFields,
    } = this.props;
    const recordImg = edit && record.image ? record.image.data : undefined;

    /* eslint-disable react/jsx-props-no-spreading */
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
      />
    ) : (
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
        disableWishlistFields={disableWishlistFields}
        {...this.state}
      />
    );
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
    image: PropTypes.shape({
      data: PropTypes.string,
    }),
  }),
  handleShowModal: PropTypes.func,
  handleReset: PropTypes.func,
  editRecordInCollection: PropTypes.func,
  addRecordToCollection: PropTypes.func,
  loadCollection: PropTypes.func,
  edit: PropTypes.bool,
  title: PropTypes.string,
  artist: PropTypes.string,
  format: PropTypes.string,
  expand: PropTypes.bool,
  disableWishlistFields: PropTypes.bool,
};

AddOrEditRecord.defaultProps = {
  record: null,
  handleReset: null,
  editRecordInCollection: null,
  addRecordToCollection: null,
  loadCollection: null,
  handleShowModal: null,
  edit: false,
  expand: false,
  title: '',
  artist: '',
  format: 'CD',
  disableWishlistFields: false,
};
