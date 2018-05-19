import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import collection from './reducers/collection';
import search from './reducers/search';
import authenticate from './reducers/authenticate';
import filter from './reducers/filter';

export default combineReducers({
  collection,
  search,
  authenticate,
  filter,
  form: formReducer,
});
