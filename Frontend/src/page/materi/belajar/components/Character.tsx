import React from 'react';
import { type Character as CharacterType } from '../types';

interface CharacterProps {
  character: CharacterType;
  showDialog?: boolean;
}

const Character: React.FC<CharacterProps> = ({ character, showDialog = true }) => {
  const characterStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${character.x}%`,
    top: `${character.y}%`,
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
    transition: 'all 0.3s ease',
  };

  // Apply direction class if specified
  const directionClass = character.direction === 'left' ? 'character-face-left' : '';

  return (
    <div className="character-container" style={characterStyle}>
      {showDialog && character.dialog && (
        <div className="character-dialog">
          <div className="speech-bubble">
            <p>{character.dialog}</p>
          </div>
        </div>
      )}
      <div className={`character-image-container ${directionClass}`}>
        <img 
          src={character.image} 
          alt={character.name || 'Character'} 
          className="character-image"
        />
      </div>
      {character.name && (
        <div className="character-name">
          {character.name}
        </div>
      )}
    </div>
  );
};

export default Character;
