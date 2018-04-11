import { createStore } from 'redux';
import { setCollection, setSearch } from './action_creators';
import reducer from './reducer';

const initialState = {};
let tmpStore;

if (process.env.NODE_ENV === 'production') {
  tmpStore = createStore(reducer, initialState);
} else {
  // enables reduxDevTools when not in production
  const devTools = typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ?
    window.devToolsExtension()
    :
    undefined;

  tmpStore = createStore(reducer, initialState, devTools);
}

const store = tmpStore;

// Records added as array inside collection in case app is later extended to include other collectibles
const initialCollection = { records: [] };
const initialSearch = '';

store.dispatch(setCollection(initialCollection));
store.dispatch(setSearch(initialSearch));

export default store;
