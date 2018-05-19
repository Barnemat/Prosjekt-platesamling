import axios from 'axios';
import { setLoadingCursor } from '../util';

export function getCollection(username, sortMode = { date: -1 }) {
  return (dispatch) => {
    setLoadingCursor(true);
    axios.get(`http://localhost:8080/api/records?username=${username}&sort=${JSON.stringify(sortMode)}`)
      .then((res) => {
        dispatch({
          type: 'GET_COLLECTION',
          payload: {
            collection: { records: res.data },
          },
        });
      })
      .catch(() => {
        dispatch({
          type: 'COLLECTION_ERROR',
          payload: 'An error occured while retrieving collection',
        });
      })
      .then(() => {
        setLoadingCursor(false);
      });
  };
}

export function resetCollection() {
  return {
    type: 'RESET_COLLECTION',
  };
}
