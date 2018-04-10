export function setCollection(collection) {
  return {
    type: 'SET_COLLECTION',
    payload: {
      collection,
    }
  };
}

export function resetCollection() {
  return {
    type: 'RESET_COLLECTION',
  };
}

export function setSearch(search) {
  return {
    type: 'SET_SEARCH',
    payload: {
      search,
    }
  };
}

export function resetSearch() {
  return {
    type: 'RESET_SEARCH',
  };
}
