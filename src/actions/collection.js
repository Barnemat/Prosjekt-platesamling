export function setCollection(collection) {
  return {
    type: 'SET_COLLECTION',
    payload: {
      collection,
    },
  };
}

export function resetCollection() {
  return {
    type: 'RESET_COLLECTION',
  };
}
