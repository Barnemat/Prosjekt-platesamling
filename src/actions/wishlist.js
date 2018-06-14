import axios from 'axios';
import { setLoadingCursor } from '../util';

export function getWishlist(username) {
  return (dispatch) => {
    setLoadingCursor(true);
    axios.get(`http://localhost:8080/api/wishlist?username=${username}`)
      .then((res) => {
        dispatch({
          type: 'GET_WISHLIST',
          payload: {
            wishlist: res.data,
          },
        });
      })
      .catch(() => {
        dispatch({
          type: 'WISHLIST_ERROR',
          payload: 'An error occured while retrieving wishlist.',
        });
      })
      .then(() => {
        setLoadingCursor(false);
      });
  };
}

export function resetWishlist() {
  return {
    type: 'RESET_WISHLIST',
  };
}
