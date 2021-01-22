

import { key } from "../../keys/jimmy-translation.json";

const fetchData = (url, method, fieldName) => {
  return new Promise((resolve, reject) => {
    fetch(url, { method })
      .then(response => {
        if (response.status !== 200) {
          console.error(`Looks like there was a problem. Status Code: ${
            response.status}`);
          return;
        }
        response.json().then(data => {
          resolve(data.data[fieldName]);
        });
      })
      .catch(err => reject(err));
  });
};


export const translate = (text, target) => {
  const url = `https://translation.googleapis.com/language/translate/v2?q=${text}&target=${target}&key=${key}`;
  return fetchData(url, 'POST', 'translations');
};

export const detectLanguage = text => {
  const url = `https://translation.googleapis.com/language/translate/v2/detect?q=${text}&key=${key}`;
  return fetchData(url, 'GET', 'detections');
};

export const getSupportedLanguages = target => {
  const url = `https://translation.googleapis.com/language/translate/v2/languages?target=${target}&key=${key}`;
  return fetchData(url, 'POST', 'languages');
};

export const supportedLanguagesMap = {
  'German': 'de',
  'English': 'en',
  'Spanish': 'es',
  'French': 'fr',
  'Italian': 'it',
  'Japanese': 'ja',
  'Korean': 'ko',
  'Dutch': 'nl',
  'Portuguese': 'pt',
  'Russian': 'ru',
  'Chinese (Simplified)': 'zh_cn',
  'Chinese (Traditional)': 'zh_tw'
};