import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Swipeable } from 'react-swipeable';

import defaultTool from 'constants/defaultTool';
import Dropdown from 'components/Dropdown';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import { translate, supportedLanguagesMap } from "helpers/googleTranslate";

import i18next from 'i18next';

import './TranslationModal.scss';

const TranslationModal = () => {
  const [isDisabled, isOpen] = useSelector(state => [
    selectors.isElementDisabled(state, 'translationModal'),
    selectors.isElementOpen(state, 'translationModal'),
  ]);
  const dispatch = useDispatch();
  const selectedText = core.getSelectedText();
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('Loading...');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [inputChangeTimeoutId, setinputChangeTimeoutId] = useState();

  useEffect(() => {
    const onDocumentLoaded = () => {
      const currentLanguage = i18next.language;
      setTargetLanguage(Object.keys(supportedLanguagesMap).find(key => supportedLanguagesMap[key] === currentLanguage));
    };

    core.addEventListener('documentLoaded', onDocumentLoaded);
    return () => core.removeEventListener('documentLoaded', onDocumentLoaded);
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setSourceText(selectedText);
    getTranslation(selectedText, targetLanguage);
  }, [isOpen]);

  const handleInputChange = e => {
    const value = e.target.value;
    setSourceText(value);
    inputChangeTimeoutId && window.clearTimeout(inputChangeTimeoutId);
    const timeoutId = window.setTimeout(() => {
      getTranslation(value, targetLanguage);
    }, 500);
    setinputChangeTimeoutId(timeoutId);
  };

  const handleLanguageChange = language => {
    setTargetLanguage(language);
    getTranslation(sourceText, language);
  };

  const getTranslation = async(text, language) => {
    const translations = await translate(text, supportedLanguagesMap[language]);
    setTranslatedText(translations[0].translatedText);
    const { detectedSourceLanguage } = translations[0];
    setSourceLanguage(Object.keys(supportedLanguagesMap).find(key => supportedLanguagesMap[key] === detectedSourceLanguage));
  };

  const closeModal = () => {
    dispatch(actions.closeElement('translationModal'));
    setTranslatedText('');
    core.setToolMode(defaultTool);
  };

  const modalClass = classNames({
    Modal: true,
    TranslationModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <Swipeable
      onSwipedUp={closeModal}
      onSwipedDown={closeModal}
      preventDefaultTouchmoveEvent
    >
      <div
        className={modalClass}
        data-element="translationModal"
        onMouseDown={closeModal}
      >
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <div className="swipe-indicator" />
          <div className="language-container">
            <div className= "source-language-container">
              <h3 className="source-language">{sourceLanguage}</h3>
              <textarea
                rows="10"
                cols="35"
                className="translation-text-area"
                value={sourceText}
                wrap="hard"
                onChange={handleInputChange}
                aria-label="translation-text-area"
              />
            </div>
            <div className="target-language-container">
              <Dropdown
                className="translation-supported-languages-dropdown"
                dataElement="translationSupportedLanguagesDropdown"
                items={Object.keys(supportedLanguagesMap)}
                // translationPrefix="option.notesOrder"
                currentSelectionKey={targetLanguage}
                onClickItem={handleLanguageChange}
                width={180}
              />
              <textarea
                rows="10"
                cols="35"
                className="translation-text-area"
                defaultValue={translatedText}
                aria-label="translation-text-area"
              />
            </div>
          </div>
        </div>

      </div>
    </Swipeable>
  );
};

export default TranslationModal;
