import { combineReducers } from 'redux';
import collection from './reducers/collection';
import search from './reducers/search';

export default combineReducers({
  collection,
  search,
});
