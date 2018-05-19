export function setFilter(filter) {
  return {
    type: 'SET_FILTER',
    payload: {
      filter,
    },
  };
}

export function setFilterItem(groupName, tagName) {
  return {
    type: 'SET_FILTER',
    payload: {
      groupName,
      tagName,
    },
  };
}

export function resetFilter() {
  return {
    type: 'RESET_FILTER',
  };
}
