import axios from 'axios';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { setCollection, setSearch, authenticatedAction } from './actions';
import reducer from './reducer';

const initialState = {};
let tmpStore;

if (process.env.NODE_ENV === 'production') {
  tmpStore = createStore(reducer, initialState, applyMiddleware(thunk));
} else {
  // enables reduxDevTools when not in production
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  tmpStore = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));
}

const store = tmpStore;

// Records added as array inside collection in case app is later extended to include other collectibles
const initialCollection = { records: [] };
const initialSearch = '';

store.dispatch(authenticatedAction());
store.dispatch(setCollection(initialCollection));
store.dispatch(setSearch(initialSearch));

export default store;
