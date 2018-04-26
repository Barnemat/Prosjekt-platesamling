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
      .catch((err) => {
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
      .catch((err) => {
        dispatch({ type: 'UNAUTHENTICATED' });
      });
  }
}

export function signOutAction() {
  return (dispatch) => {
    axios.get('http://localhost:8080/api/signout')
      .then((res) => {
        dispatch({ type: 'UNAUTHENTICATED' });
        dispatch({ type: 'CLEAR_AUTH_ERROR' });
      })
      .catch((err) => {
        dispatch({ type: 'UNAUTHENTICATED' });
        dispatch({ type: 'CLEAR_AUTH_ERROR' });
      });
  };
}
