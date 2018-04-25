export function setSearch(search) {
  return {
    type: 'SET_SEARCH',
    payload: {
      search,
    },
  };
}

export function resetSearch() {
  return {
    type: 'RESET_SEARCH',
  };
}
