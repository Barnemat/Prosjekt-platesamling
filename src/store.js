/* eslint-disable no-underscore-dangle */

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { setSearch, authenticatedAction, resetCollection } from './actions';
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

const initialSearch = '';

store.dispatch(authenticatedAction());
store.dispatch(resetCollection());
store.dispatch(setSearch(initialSearch));

export default store;
