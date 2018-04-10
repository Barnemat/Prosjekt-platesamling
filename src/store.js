import { createStore } from 'redux';
import { setCollection, setSearch } from './action_creators';
import reducer from './reducer';

const initialState = {};
let store;

if (process.env.NODE_ENV === 'production') {
  store = createStore(reducer, initialState);
} else {
  // enables reduxDevTools when not in production
  const devTools = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ?
    window.devToolsExtension()
    :
    undefined;

  store = createStore(reducer, initialState, devTools);
}

const initialCollection = { records: [] };
const initialSearch = '';

store.dispatch(setCollection(initialCollection));
store.dispatch(setSearch(initialSearch));

export default store;
