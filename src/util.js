import md5 from 'md5';
import stringSimilarity from 'string-similarity';

export function getValidLanugages() {
  return ['no', 'en'];
}
export const getValidImgTypes = () => ['gif', 'ico', 'img', 'jpe', 'jpeg', 'jpg', 'jpx', 'png'];

const getFileEnding = file => file.split('.').pop().toLowerCase();

/*
* Returns the image URL from a wikipedia page that has the title closest to the search query and has a valid filetype
* The one with the title closest to the search term, is most likely to be an image of the album.
* The album term is concatenated with itself to make weigh it more in stringSimilarity
* @params {String} album, {Object} response
* @returns {String}
*/
export const getBestImageURL = (album, response) => {
  let files = response.query.pages[0].images;

  files = files.filter(file => getValidImgTypes().includes(getFileEnding(file.title)));
  if (files.length === 0) return false;

  for (let i = 0; i < files.length; i += 1) {
    files[i] = files[i].title;
  }

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
  let res1String = res1[2] ? res1[2][0] : '';
  let res2String = res2[2] ? res2[2][0] : '';

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
  24 hours in a day, 30 days in a month, 365 days i a year */
  const yearDistance = Math.floor(dateDistance / (1000 * 60 * 60 * 24 * 365));
  const monthDistance = Math.floor(dateDistance / (1000 * 60 * 60 * 24 * 30));
  const dayDistance = Math.floor(dateDistance / (1000 * 60 * 60 * 24));

  const frontmatter = 'This record was added';

  if (yearDistance === 0) {
    if (dayDistance > 30) {
      if (dayDistance > 60) {
        return `${frontmatter} ${monthDistance} months ago`;
      }
      return `${frontmatter} 1 month ago`;
    }
    if (dayDistance === 0) {
      return `${frontmatter} today`;
    }
    return `${frontmatter} ${dayDistance} days ago`;
  } else if (yearDistance === 1) {
    return `${frontmatter} 1 year ago`;
  }
  return `${frontmatter} ${yearDistance} years ago`;
};
