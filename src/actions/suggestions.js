import { sendWikiDiscographyRequest } from '../services/api';

export function setSuggestions(records, wishlist) {
  return (dispatch) => {
    sendRequests(records, wishlist)
      .then((res) => {
        console.log('action: SET_SUGGESTIONS\n', res);
        dispatch({
          type: 'SET_SUGGESTIONS',
          payload: res,
        });
        dispatch({ type: 'CLEAR_SUGGESTION_ERROR' });
      })
      .catch(() => {
        dispatch({
          type: 'SUGGESTION_ERROR',
          payload: 'Error loading suggestions.'
        });
      });
  }
}

export function resetSuggestions() {
  return {
    type: 'RESET_SUGGESTIONS',
  };
}


const sendRequests = (records, wishlist) => {
  const distinctArtists = records ? records.reduce((res, record) => {
    const artist = record.artist.toLowerCase().trim();
    return res.includes(artist) || artist === '' ? res : [...res, artist];
  }, []) : [];

  const length = distinctArtists.length >= 3 ? 3 : distinctArtists.length;
  let randomIndexes = [];
  for (let i = 0; i < length; i++) {
    randomIndexes.push(generateRandIndex(distinctArtists.length, randomIndexes));
  }

  const requests = randomIndexes.map(index => sendWikiDiscographyRequest(distinctArtists[index]));;

  return new Promise((resolve, reject) => {
    Promise.all(requests)
      .then(res => {
        const albumsInCollection = records.reduce((acc, record) => [...acc, record.title.toLowerCase()], []);
        const albumsInWishlist = wishlist.reduce((acc, record) => [...acc, record.title.toLowerCase()], []);

        const albums = res
          .reduce((acc, album) => [...acc, ...album], [])
          .filter(album => {
            for (let key in album) {
              return !albumsInCollection.includes(album[key].toLowerCase()) && !albumsInWishlist.includes(album[key].toLowerCase());
            }
          });
        resolve(albums);
      })
      .catch(() => {
        reject('Could not find any suggestions');
      });
  });
};

const generateRandIndex = (max, randomIndexes) => {
  const index = Math.round(Math.random() * max);
  return randomIndexes.includes(index) ? generateRandIndex(max, randomIndexes) : index;
};
