export default function(state={}, action) {
  switch(action.type) {
    case 'AUTHENTICATED':
      return { ...state, authenticated: true, user: action.payload };
    case 'UNAUTHENTICATED':
      return { ...state, authenticated: false };
    case 'AUTHENTICATION_ERROR':
      return { ...state, error: action.payload };
  }
  return state;
}