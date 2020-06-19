import { createSelector } from 'reselect';

export const getRecords = (state) => state.collection.records;

export const getSearch = (state) => state.search;

export const getFilter = (state) => state.filter;

export const getRecordsBySearch = createSelector(
  [getRecords, getSearch],
  (records = [], search = '') => records.filter((record) => {
    const title = record.title.toLowerCase();
    const artist = record.artist ? record.artist.toLowerCase() : '';
    const lwrCaseSearch = search.toLowerCase();

    return search === '' || title.indexOf(lwrCaseSearch) > -1 || artist.indexOf(lwrCaseSearch) > -1;
  }),
);

export const getRecordsBySearchAndFilter = createSelector(
  [getRecordsBySearch, getFilter],
  (records = [], filter = {}) => {
    const matching = {
      artist: [], date: [], format: [], rating: [],
    };
    const now = new Date();

    return records.reduce((res, record) => {
      const dateDistance = now - new Date(record.date);
      const yearDistance = Math.floor(dateDistance / (1000 * 60 * 60 * 24 * 365));
      const monthDistance = Math.floor(dateDistance / (1000 * 60 * 60 * 24 * 30));
      const weekDistance = Math.floor(dateDistance / (1000 * 60 * 60 * 24 * 7));

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
            } else if (groupName === 'date') {
              if ((weekDistance < 1 && tag === 'week')
                || (monthDistance < 1 && tag === 'month')
                || (yearDistance < 1 && tag === 'year')) {
                matching[groupName].push(tag.toLowerCase());
              } else {
                matching[groupName].push('no_date_match');
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
        artist: false, date: false, format: false, rating: false,
      };
      if (matching.artist.length === 0
        || (matching.artist.includes('no artist') && record.artist === '')
        || matching.artist.includes(record.artist.toLowerCase())) {
        matches.artist = true;
      }

      if (matching.date.length === 0
        || (weekDistance < 1 && matching.date.includes('week'))
        || (monthDistance < 1 && matching.date.includes('month'))
        || (yearDistance < 1 && matching.date.includes('year'))) {
        matches.date = true;
      }

      if (matching.format.length === 0
        || matching.format.includes(record.format.toLowerCase())) {
        matches.format = true;
      }

      if (matching.rating.length === 0
        || (record.rating === 0 && matching.rating.includes('unrated'))
        || matching.rating.includes(record.rating.toString())) {
        matches.rating = true;
      }

      return Object.keys(matching).reduce((acc, groupName) => acc && (matches[groupName]), true)
        ? [...res, record] : res;
    }, []);
  },
);
