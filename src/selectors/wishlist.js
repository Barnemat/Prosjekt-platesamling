import { createSelector } from 'reselect';

export const getWishlist = state => state.wishlist;

export const getSearch = state => state.search;

export const getWishlistBySearch = createSelector(
  [getWishlist, getSearch],
  (wishlist = [], search = '') => wishlist.filter((record) => {
    const title = record.title.toLowerCase();
    const artist = record.artist ? record.artist.toLowerCase() : '';
    const lwrCaseSearch = search.toLowerCase();

    return search === '' || title.indexOf(lwrCaseSearch) > -1 || artist.indexOf(lwrCaseSearch) > -1;
  }),
);
