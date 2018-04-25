import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import collection from './reducers/collection';
import search from './reducers/search';
import authenticate from './reducers/authenticate';

export default combineReducers({
  collection,
  search,
  authenticate,
  form: formReducer,
});
