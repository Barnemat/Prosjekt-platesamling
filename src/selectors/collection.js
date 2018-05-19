import { createSelector } from 'reselect';

export const getRecords = state => state.collection.records;

export const getSearch = state => state.search;

export const getFilter = state => state.filter;

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
  (records = [], filter={}) => {
    let matching = { artist: [], date: [], format: [], rating: [] };
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
            if(groupName === 'artist') {
              if (tag === 'no artist' && record.artist === '') {
                matching[groupName].push('no artist');
              } else {
                matching[groupName].push(tag.toLowerCase());
              }
            } else if (groupName === 'date') {
              if ((weekDistance < 1 && tag === 'week') || (monthDistance < 1 && tag === 'month') || (yearDistance < 1 && tag === 'year')) {
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

      let match = false;
      if(matching['artist'].includes(record.artist.toLowerCase()) || matching['artist'].includes('no artist') && record.artist === '') {
        match = true;
      } else if ((weekDistance < 1 && matching['date'].includes('week')) || (monthDistance < 1 && matching['date'].includes('month')) || (yearDistance < 1 && matching['date'].includes('year'))) {
        match = true;
      } else if (matching['format'].includes(record.format.toLowerCase())) {
        match = true;
      } else if (matching['rating'].includes(record.rating.toString()) || record.rating === 0 && matching['rating'].includes('unrated')) {
        match = true;
      } else if (Object.keys(matching).reduce((res, groupName) => {
          return res && matching[groupName].length === 0;
        }, true)) {
        match = true;
      }

      return match ? [...res, record] : res;
      }, []);
});