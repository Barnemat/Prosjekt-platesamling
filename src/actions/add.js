export function setNewCollectionElement(title, artist) {
  return {
    type: 'SET_NEW_COLLECTION_ELEMENT',
    payload: {
      title,
      artist,
    },
  };
}

export function resetNewCollectionElement(title, artist) {
  return {
    type: 'RESET_NEW_COLLECTION_ELEMENT',
  };
}
