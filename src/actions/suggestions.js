import { requestAlbumSuggestions } from '../services/wikipediaApi';

export function setSuggestions(records, wishlist) {
  return (dispatch) => {
    requestAlbumSuggestions(records, wishlist)
      .then((res) => {
        dispatch({
          type: 'SET_SUGGESTIONS',
          payload: res,
        });
        dispatch({ type: 'CLEAR_SUGGESTION_ERROR' });
      })
      .catch(() => {
        dispatch({
          type: 'SUGGESTION_ERROR',
          payload: 'Error loading suggestions.',
        });
      });
  };
}

export function resetSuggestions() {
  return {
    type: 'RESET_SUGGESTIONS',
  };
}
