import axios from 'axios';
import { getValidLanugages } from '../util';

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
