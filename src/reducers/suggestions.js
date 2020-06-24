export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    case 'RESET_SUGGESTIONS':
      return { ...state, suggestions: [], error: '' };
    case 'SUGGESTION_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_SUGGESTION_ERROR':
      return { ...state, error: '' };
    default:
      return state;
  }
};
