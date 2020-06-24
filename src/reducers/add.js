export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_NEW_COLLECTION_ELEMENT':
      return action.payload;
    case 'RESET_NEW_COLLECTION_ELEMENT':
      return {};
    default:
      return state;
  }
};
