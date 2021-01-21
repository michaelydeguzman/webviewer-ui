import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Swipeable } from 'react-swipeable';

import defaultTool from 'constants/defaultTool';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import { translate } from "helpers/googleTranslate";


import './TranslationModal.scss';

const TranslationModal = () => {
  const [isDisabled, isOpen] = useSelector(state => [
    selectors.isElementDisabled(state, 'translationModal'),
    selectors.isElementOpen(state, 'translationModal'),
  ]);
  const dispatch = useDispatch();

  const selectedText = core.getSelectedText();
  console.log('selectedText', selectedText);

  const [translatedText, setTranslatedText] = useState('');
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const go = async() => {
      const translations = await translate(selectedText, 'zh');
      setTranslatedText(translations[0].translatedText);
    };
    go();
  }, [isOpen]);

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
        data-element="linkModal"
        onMouseDown={closeModal}
      >
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <div className="swipe-indicator" />
          {selectedText} --{'>'} {translatedText}
        </div>

      </div>
    </Swipeable>
  );
};

export default TranslationModal;
