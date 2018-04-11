export default function (state = {}, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return action.payload.search;
    case 'RESET_SEARCH':
      return '';
    default:
      return state;
  }
}
