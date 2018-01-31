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
  const URL = `https://upload.wikimedia.org/wikipedia/en/${hash.charAt(0)}/${hash.slice(0, 2)}/${relativeURL}`;
  console.log(URL);

  return URL;
};
