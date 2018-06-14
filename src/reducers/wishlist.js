export default function (state = {}, action) {
  switch (action.type) {
    case 'GET_WISHLIST':
      return action.payload.wishlist;
    case 'RESET_WISHLIST':
      return [];
    default:
      return state;
  }
}
