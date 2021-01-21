

import { key } from "../../keys/jimmy-translation.json";

export const translate = (text, target) => {
  const url = `https://translation.googleapis.com/language/translate/v2?q=${text}&target=${target}&key=${key}`;
  const getTranslateTextPromise = new Promise((resolve, reject) => {
    fetch(url, { method: 'POST' })
      .then(response => {
        if (response.status !== 200) {
          console.error(`Looks like there was a problem. Status Code: ${
            response.status}`);
          return;
        }
        response.json().then(data => {
          resolve(data.data.translations);
        });
      })
      .catch(err => reject(err));
  });
  return getTranslateTextPromise;
};