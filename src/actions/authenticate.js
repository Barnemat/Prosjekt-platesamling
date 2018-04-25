import axios from 'axios';

export function signInAction({ username, password }) {
  return (dispatch) => {
    axios.post('http://localhost:8080/api/signin', { username, password })
      .then((res) => {
        dispatch({ type: 'AUTHENTICATED' });
      })
      .catch((err) => {
        dispatch({
          type: 'AUTHENTICATION_ERROR',
          payload: 'Invalid username or password'
        });
      });
  };
}
