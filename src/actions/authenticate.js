import axios from 'axios';

export function signInAction({ username, password, remember }) {
  return (dispatch) => {
    axios.post('http://localhost:8080/api/signin', { username, password, remember })
      .then((res) => {
        if (res.data.success) {
          dispatch({
            type: 'AUTHENTICATED',
            payload: res.data.user,
          });
          dispatch({ type: 'CLEAR_AUTH_ERROR' });
        } else {
          dispatch({
            type: 'AUTHENTICATION_ERROR',
            payload: res.data.msg,
          });
        }
      })
      .catch(() => {
        dispatch({
          type: 'AUTHENTICATION_ERROR',
          payload: 'Invalid username or password',
        });
      });
  };
}

export function authenticatedAction() {
  return (dispatch) => {
    axios.get('http://localhost:8080/api/authenticated')
      .then((res) => {
        if (res.data.authenticated) {
          dispatch({
            type: 'AUTHENTICATED',
            payload: res.data.user,
          });
        } else {
          dispatch({ type: 'UNAUTHENTICATED' });
        }
      })
      .catch(() => {
        dispatch({ type: 'UNAUTHENTICATED' });
      });
  };
}

export function signOutAction() {
  return (dispatch) => {
    axios.get('http://localhost:8080/api/signout')
      .then(() => {
        dispatch({ type: 'UNAUTHENTICATED' });
        dispatch({ type: 'CLEAR_AUTH_ERROR' });
        dispatch({ type: 'RESET_FILTER' });
        dispatch({ type: 'RESET_COLLECTION' });
        dispatch({ type: 'RESET_SEARCH' });
      })
      .catch(() => {
        dispatch({ type: 'UNAUTHENTICATED' });
        dispatch({ type: 'CLEAR_AUTH_ERROR' });
        dispatch({ type: 'RESET_FILTER' });
        dispatch({ type: 'RESET_COLLECTION' });
        dispatch({ type: 'RESET_SEARCH' });
      });
  };
}
