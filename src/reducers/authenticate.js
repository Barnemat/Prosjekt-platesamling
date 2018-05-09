export default function (state = {}, action) {
  switch (action.type) {
    case 'AUTHENTICATED':
      return { ...state, authenticated: true, user: action.payload };
    case 'UNAUTHENTICATED':
      return { ...state, authenticated: false, user: { username: '', email: '', private: true } };
    case 'AUTHENTICATION_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_AUTH_ERROR':
      return { ...state, error: '' };
    default:
      return state;
  }
}
