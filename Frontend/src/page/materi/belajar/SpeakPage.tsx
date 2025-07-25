import React from 'react';
import { type SpeakPage as SpeakPageType } from './types';

interface SpeakPageProps {
  page: SpeakPageType;
  onPrevious: () => void;
  onNext: () => void;
  isLastPage: boolean;
}

const SpeakPage: React.FC<SpeakPageProps> = ({ page, onPrevious, onNext, isLastPage }) => {
  const { character, dialog } = page.content;
  
  return (
    <div className="speak-page">
      {/* Heading - same as LorePage */}
      <h1 className="page-heading">{page.heading}</h1>

      <div className={`speak-content ${character ? 
        character.position === 'left' ? 'has-character-left' : 'has-character-right' 
        : 'no-character'}`}>
        {character && (
          <div className={character.position === 'left' ? "character-image-wrapper" : "character-image-wrapper right"}>
            <img
              src={character.character.image}
              alt={character.character.name || 'Character'}
              className={`character-image ${character.character.direction === 'left' ? 'character-face-left' : ''}`}
            />
            {character.character.name && (
              <div className="character-name">
                {character.character.name}
              </div>
            )}
          </div>
        )}
        <div className="dialog-content">
          {dialog.name && (
            <div className="dialog-name">{dialog.name}</div>
          )}
          <div className={`dialog-text ${dialog.name ? 'has-name' : ''}`}>
            {dialog.text}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="speak-navigation">
        {!page.isFirstPage && (
          <button className="nav-button prev-button" onClick={onPrevious}>
            <span className="caret">‹</span> Sebelumnya
          </button>
        )}
        <button 
          className={`nav-button next-button ${isLastPage ? 'finish-button' : ''}`} 
          onClick={onNext}
        >
          {isLastPage ? 'Selesai' : 'Lanjut'} <span className="caret">›</span>
        </button>
      </div>
    </div>
  );
};

export default SpeakPage;
