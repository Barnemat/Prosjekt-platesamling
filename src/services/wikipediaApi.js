import axios from 'axios';
import jQuery from 'jquery';
import { getValidLanugages, getBestSearchResult, generateRandIndex } from '../util';

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

const sendWikiDiscographyRequest = (query) => new Promise((resolve, reject) => {
  sendWikiSearchRequest('en', query)
    .then((artistRes) => {
      const splittedLink = artistRes.data[3][0].split('/');
      const page = splittedLink[splittedLink.length - 1];

      const params = {
        action: 'parse',
        prop: 'sections',
        format: 'json',
        formatversion: 2,
        origin: '*',
        page,
      };

      sendWikiRequest(params)
        .then((sectionRes) => {
          const { sections } = sectionRes.data.parse;
          const discographyIndex = Object.keys(sections).reduce((res, section) => (
            sections[section].line.toLowerCase() === 'discography' ? sections[section].index : res
          ), 0);

          const queryParams = {
            action: 'parse',
            prop: 'text',
            format: 'json',
            formatversion: 2,
            origin: '*',
            section: discographyIndex,
            page,
          };

          sendWikiRequest(queryParams)
            .then((queryRes) => {
              const res = queryRes.data.parse.text
                .split('<li>')
                .filter((item) => item.startsWith('<i>'))
                .map((item) => {
                  const sanitized = jQuery(item)
                    .text()
                    .replace(/(\r\n|\n|\r)+.*$/g, '')
                    .replace(/(\()+.*$/g, '')
                    .trim();

                  return { [artistRes.data[1][0]]: sanitized };
                });
              resolve(res);
            })
            .catch((queryErr) => {
              reject(queryErr);
            });
        })
        .catch((sectionErr) => {
          reject(sectionErr);
        });
    })
    .catch((err) => {
      reject(err);
    });
});

export const requestAlbumSuggestions = (records, wishlist) => {
  const distinctArtists = records ? records.reduce((res, record) => {
    const artist = record.artist.toLowerCase().trim();
    return res.includes(artist) || artist === '' ? res : [...res, artist];
  }, []) : [];

  const length = distinctArtists.length >= 3 ? 3 : distinctArtists.length;
  const randomIndexes = [];
  for (let i = 0; i < length; i += 1) {
    randomIndexes.push(generateRandIndex(distinctArtists.length, randomIndexes));
  }

  const requests = randomIndexes.map((index) => sendWikiDiscographyRequest(distinctArtists[index]));

  return new Promise((resolve, reject) => {
    Promise.all(requests)
      .then((res) => {
        const albumsInCollection = records.reduce((acc, record) => [...acc, record.title.toLowerCase()], []);
        const albumsInWishlist = wishlist.reduce((acc, record) => [...acc, record.title.toLowerCase()], []);

        const albums = res
          .reduce((acc, album) => [...acc, ...album], [])
          .filter((album) => {
            const key = Object.keys(album)[0];
            return albumsInCollection.includes(
              album[key].toLowerCase(),
            ) || albumsInWishlist.includes(album[key].toLowerCase());
          });
        resolve(albums);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
