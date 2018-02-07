import axios from 'axios';
import { getValidLanugages, getBestSearchResult } from '../util';

const sendWikiRequest = (params, lang) => {
  const validLang = getValidLanugages().includes(lang) ? lang : 'en';

  const request = axios.get(`https://${validLang}.wikipedia.org/w/api.php`, {
    headers: { 'Api-User-Agent': 'Prosjekt-platesamling-dev' },
    params,
  });
  return request;
};

export const sendWikiSearchRequest = (lang, query) => {
  const params = {
    action: 'opensearch',
    search: `${query}`,
    format: 'json',
    limit: 1,
    origin: '*',
    redirects: 'resolve',
  };
  return sendWikiRequest(params, lang);
};

export const sendWikiImageRequest = (query) => {
  const params = {
    action: 'query',
    titles: query,
    prop: 'images',
    format: 'json',
    formatversion: 2,
    origin: '*',
  };
  return sendWikiRequest(params);
};

export const sendDoubleWikiSearchRequest = (lang, query, extraTerm) => {
  const term = extraTerm || '(album)';
  const wikiRequest1 = sendWikiSearchRequest(lang, query);
  const wikiRequest2 = sendWikiSearchRequest(lang, `${query} ${term}`);

  return new Promise((resolve, reject) => {
    let bestResult;
    Promise.all([wikiRequest1, wikiRequest2])
      .then((res) => {
        bestResult = getBestSearchResult(res[0].data, res[1].data);
        resolve(bestResult);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
