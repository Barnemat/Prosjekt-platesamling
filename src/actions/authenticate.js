import axios from 'axios';

export function signInAction({ username, password }) {
  return (dispatch) => {
    axios.post('http://localhost:8080/api/signin', { username, password })
      .then((res) => {
        dispatch({
          type: 'AUTHENTICATED',
          payload: res.data.user,
        });
      })
      .catch((err) => {
        dispatch({
          type: 'AUTHENTICATION_ERROR',
          payload: 'Invalid username or password'
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
      })
      .catch((err) => {
        dispatch({ type: 'UNAUTHENTICATED' });
      });
  };
}
