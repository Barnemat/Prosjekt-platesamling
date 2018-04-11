import { createSelector } from 'reselect';

const getRecords = state => state.collection.records;

const getSearch = state => state.search;

export const getRecordsBySearch = createSelector(
  [getRecords, getSearch],
  (records = [], search = '') => records.filter((record) => {
    const title = record.title.toLowerCase();
    const artist = artist ? record.artist.toLowerCase() : '';
    const lwrCaseSearch = search.toLowerCase();

    return search === '' || title.indexOf(lwrCaseSearch) > -1 || artist.indexOf(lwrCaseSearch) > -1;
  }),
);
