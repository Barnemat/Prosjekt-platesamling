import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import collection from './reducers/collection';
import search from './reducers/search';
import authenticate from './reducers/authenticate';
import filter from './reducers/filter';
import wishlist from './reducers/wishlist';
import suggestions from './reducers/suggestions';

export default combineReducers({
  collection,
  wishlist,
  search,
  authenticate,
  filter,
  suggestions,
  form: formReducer,
});
