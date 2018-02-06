import md5 from 'md5';
import stringSimilarity from 'string-similarity';

export function getValidLanugages() {
  return ['no', 'en'];
}
export const getValidImgTypes = () => ['gif', 'ico', 'img', 'jpe', 'jpeg', 'jpg', 'jpx', 'png'];

const checkFileEnding = file => file.split('.').pop().toLowerCase();

export const getBestImageURL = (album, response) => {
  let files = response.query.pages[0].images;

  files = files.filter(file => getValidImgTypes().includes(checkFileEnding(file.title)));
  if (files.length === 0) return false;

  for (let i = 0; i < files.length; i += 1) {
    files[i] = files[i].title;
  }

  const bestMatch = stringSimilarity.findBestMatch(album + album, files).bestMatch.target;
  const relativeURL = bestMatch.replace('File:', '').replace(/ /g, '_');
  const hash = md5(relativeURL);

  return `https://upload.wikimedia.org/wikipedia/en/${hash.charAt(0)}/${hash.slice(0, 2)}/${relativeURL}`;
};

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
