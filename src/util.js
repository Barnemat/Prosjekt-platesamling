import md5 from 'md5';
import stringSimilarity from 'string-similarity';

export const getValidLanugages = () => ['no', 'en'];

export const getValidImgTypes = () => ['gif', 'ico', 'img', 'jpe', 'jpeg', 'jpg', 'jpx', 'png'];

export const getSortModes = () => ({
  newest: 'Newest first',
  oldest: 'Oldest first',
  albumDesc: 'Album (A-Z)',
  albumAsc: 'Album (Z-A)',
  artistDesc: 'Artist (A-Z)',
  artistAsc: 'Artist (Z-A)',
});

const getFileEnding = (file) => file.split('.').pop().toLowerCase();

/*
* Returns the image URL from a wikipedia page that has the title closest to the search query and has a valid filetype
* The one with the title closest to the search term, is most likely to be an image of the album.
* @params {String} album, {Object} response
* @returns {String}
*/
export const getBestImageURL = (album, response) => {
  let files = response.query.pages[0].images;

  files = files.filter((file) => getValidImgTypes().includes(getFileEnding(file.title)));
  if (files.length === 0) return false;

  for (let i = 0; i < files.length; i += 1) {
    files[i] = files[i].title;
  }

  // The album term is concatenated with itself to increase the weight of it in stringSimilarity
  const bestMatch = stringSimilarity.findBestMatch(album + album, files).bestMatch.target;
  const relativeURL = bestMatch.replace('File:', '').replace(/ /g, '_');
  const hash = md5(relativeURL);

  return `https://upload.wikimedia.org/wikipedia/en/${hash.charAt(0)}/${hash.slice(0, 2)}/${relativeURL}`;
};

/*
* Checks the description results from two wikipedia search queries. The one that includes the term 'album' is returned,
* or if both includes it, checks which one is most similar to the first search query term.
* @params {Array} res1, {Array} res2
* @returns {Array} || {Boolean}
*/
export const getBestSearchResult = (res1, res2) => {
  let res1String = res1[3] ? res1[3][0] : '';
  let res2String = res2[3] ? res2[3][0] : '';

  if (!res1String) res1String = '';
  if (!res2String) res2String = '';

  let bestMatch;
  if (res1String.includes('album') && res2String.includes('album')) {
    bestMatch = stringSimilarity.findBestMatch(res1String, [res1String, res2String]).bestMatch.target;
  } else if (res2String.includes('album')) {
    bestMatch = res2String;
  } else if (res1String.includes('album')) {
    bestMatch = res1String;
  }

  if (bestMatch === res1String) return res1;
  if (bestMatch === res2String) return res2;

  if (res2String.length > 0) {
    return res2;
  } if (res1String.length > 0) {
    return res1;
  }

  return false;
};

/*
* Sorts valid format types for records alphabetically, but puts 'Other' last
* @returns {Array} validFormats
*/
export const getValidFormatTypes = () => {
  const validFormats = ['LP', 'EP', 'SP', 'CD'].sort();
  validFormats.push('Other');
  return validFormats;
};

/*
* Checks how much time has passed since a record was added.
* Returns it on the form '{someNumber} of days, weeks or years ago'
* @param {String} date
* @returns {String}
*/
export const checkTimePassed = (date) => {
  const prevDate = new Date(date);
  const todayDate = new Date();
  const dateDistance = todayDate - prevDate;

  /* 1000 ms in a second, 60 seconds in a minute, 60 minutes in an hour,
  24 hours in a day, 7 days in a week, 30 days in a month, 365 days in a year */
  const yearDistance = Math.floor(dateDistance / (1000 * 60 * 60 * 24 * 365));
  const monthDistance = Math.floor(dateDistance / (1000 * 60 * 60 * 24 * 30));
  const weekDistance = Math.floor(dateDistance / (1000 * 60 * 60 * 24 * 7));
  const dayDistance = Math.floor(dateDistance / (1000 * 60 * 60 * 24));

  const frontmatter = 'This record was added';

  if (yearDistance === 0) {
    if (dayDistance >= 30) {
      if (dayDistance >= 60) {
        return `${frontmatter} ${monthDistance} months ago`;
      }
      return `${frontmatter} 1 month ago`;
    }
    if (dayDistance < 7) {
      if (dayDistance === 0) {
        if (prevDate.getDay() === todayDate.getDay()) {
          return `${frontmatter} today`;
        }
        return `${frontmatter} yesterday`;
      }
      if (dayDistance > 1) {
        return `${frontmatter} ${dayDistance} days ago`;
      }
      return `${frontmatter} yesterday`;
    }
    if (weekDistance === 1) {
      return `${frontmatter} 1 week ago`;
    }
    return `${frontmatter} ${weekDistance} weeks ago`;
  } if (yearDistance === 1) {
    return `${frontmatter} 1 year ago`;
  }
  return `${frontmatter} ${yearDistance} years ago`;
};

/*
* Returns true if the image is valid. This means that it should be an image, be specified as a valid type,
* and have a file size of max 2MB.
* @param {File} image
* @returns {Boolean}
*/
export const checkImgValid = (image) => {
  const type = image.type.split('/');

  return image.size <= 2000000 && type[0] === 'image' && getValidImgTypes().includes(type[1]);
};

/*
* Sets the cursor to a loading icon. Should be used during async waiting.
* @param {Boolean} bool
*/
export const setLoadingCursor = (bool) => {
  document.body.className = bool ? 'waiting' : '';
};

/*
* Sorts an array of similar objects based on the key selected by the type parameter.
* Order is either 1 or -1 and specifies descending or ascending order.
* @params {Array} array, {String} type, {int} order
* @returns {Array}
*/
export const sortArrayOfObjects = (array, type, order) => (
  array.sort((a, b) => {
    let elementA = type === 'date' ? Date.parse(a[type]) : a[type];
    let elementB = type === 'date' ? Date.parse(b[type]) : b[type];

    if (typeof elementA === 'string') {
      elementA = elementA.toUpperCase();
      elementB = elementB.toUpperCase();

      if (order === 1) {
        return elementA >= elementB ? 1 : -1;
      }
      return elementA < elementB ? 1 : -1;
    } if (typeof elementA === 'number') {
      return order === 1 ? (elementA - elementB) : (elementB - elementA);
    }
    return 0;
  })
);
/*
* Returns an array of strings where the first item is the part of the string (t) which comes before
* the search string (s), the second item is the search string (s) part of string (t)
* correctly formatted e.g. uppercase characters,
* and the third item is the part of the string (t) that remains after the search string (s) in string (t).
* @params {String} t, {String} s
* @returns {Array}
*/
export const getSplittedStringsForSearchFormatting = (t, s) => {
  const text = t.toLowerCase();
  const search = s.toLowerCase();

  const index = text.indexOf(search);
  const lastChar = index + search.length;

  if (s.length === 0 || index === -1) return [t, '', ''];

  return [
    t.substring(0, index),
    t.substring(index, lastChar),
    t.substring(lastChar)];
};

/*
* Returns a name with proper ownership format, such as Jon's or James'.
* @param {String} name
* @returns {String}
*/
export const getOwnershipFormat = (name) => {
  if (typeof name !== 'string') return -1;
  return name.endsWith('s')
    ? `${name}'`
    : `${name.substring(0, name.length)}'s`;
};

export const getFilter = (records, isWishlist) => {
  const artists = {};
  let isNoArtist = false;
  records.sort((a, b) => {
    const artistA = a.artist.toLowerCase();
    const artistB = b.artist.toLowerCase();
    return artistA < artistB ? -1 : 1;
  }).forEach((record) => {
    const value = record.artist;
    if (value) {
      artists[value.toLowerCase()] = false;
    } else {
      isNoArtist = true;
    }
  });

  if (isNoArtist) artists['no artist'] = false;

  const formats = {};
  getValidFormatTypes().forEach((format) => {
    formats[format.toLowerCase()] = false;
  });

  return isWishlist ? { artist: artists, format: formats } : {
    artist: artists,
    date: {
      week: false,
      month: false,
      year: false,
    },
    format: formats,
    rating: {
      5: false,
      4: false,
      3: false,
      2: false,
      1: false,
      unrated: false,
    },
  };
};

export const capitalize = (string) => `${string[0].toUpperCase()}${string.substr(1)}`;

export const generateRandIndex = (max, usedIndexes) => {
  if (max <= 0 || usedIndexes.length == max) return 0;
  const index = Math.round(Math.random() * max);
  return usedIndexes.includes(index) ? generateRandIndex(max, usedIndexes) : index;
};
