export default function (state = {}, action) {
  switch (action.type) {
    case 'GET_COLLECTION':
      return action.payload.collection;
    case 'RESET_COLLECTION':
      return {};
    default:
      return state;
  }
}
