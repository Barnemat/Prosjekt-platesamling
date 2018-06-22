import { createSelector } from 'reselect';

export const getWishlist = state => state.wishlist;

export const getSearch = state => state.search;

export const getFilter = state => state.filter;

export const getWishlistBySearch = createSelector(
  [getWishlist, getSearch],
  (records = [], search = '') => records.filter((record) => {
    const title = record.title.toLowerCase();
    const artist = record.artist ? record.artist.toLowerCase() : '';
    const lwrCaseSearch = search.toLowerCase();

    return search === '' || title.indexOf(lwrCaseSearch) > -1 || artist.indexOf(lwrCaseSearch) > -1;
  }),
);

export const getWishlistBySearchAndFilter = createSelector(
  [getWishlistBySearch, getFilter],
  (records = [], filter = {}) => {
    const matching = {
      artist: [], format: [],
    };

    return records.reduce((res, record) => {
      Object.keys(filter).forEach((groupName) => {
        Object.keys(filter[groupName]).forEach((tag) => {
          const checked = filter[groupName][tag];

          if (checked && !matching[groupName].includes(tag)) {
            if (groupName === 'artist') {
              if (tag === 'no artist' && record.artist === '') {
                matching[groupName].push('no artist');
              } else {
                matching[groupName].push(tag.toLowerCase());
              }
            } else if (groupName === 'format') {
              matching[groupName].push(tag.toLowerCase());
            } else {
              matching[groupName].push(tag);
            }
          }
        });
      });

      const matches = {
        artist: false, format: false,
      };
      if (matching.artist.length === 0 ||
        (matching.artist.includes('no artist') && record.artist === '') ||
        matching.artist.includes(record.artist.toLowerCase())) {
        matches.artist = true;
      }

      if (matching.format.length === 0 ||
        matching.format.includes(record.format.toLowerCase())) {
        matches.format = true;
      }

      return Object.keys(matching).reduce((acc, groupName) => acc && (matches[groupName]), true) ?
        [...res, record] : res;
    }, []);
  },
);
