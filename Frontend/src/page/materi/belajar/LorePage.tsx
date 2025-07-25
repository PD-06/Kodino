import React from 'react';
import { type LorePage as LorePageType } from './types';
import Character from './components/Character';

interface LorePageProps {
  page: LorePageType;
  onNext: () => void;
  isLastPage: boolean;
}

const LorePage: React.FC<LorePageProps> = ({ page, onNext, isLastPage }) => {
  return (
    <div className="lore-page">
      {/* Heading - top left */}
      <h1 className="page-heading">{page.heading}</h1>

      {page.content.text.length > 0 && (
        <div className="lore-content">
          {/* Lore text - top part */}
          <div className="lore-text">
            {page.content.text.map((paragraph, index) => (
              <p key={index} className="lore-paragraph">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Next page button - middle right */}
          <div className="lore-navigation">
            {isLastPage ? (
              <button
                className="next-page-button finish-button"
                onClick={onNext}
                aria-label="Selesai"
              >
                Selesai <span className="caret">›</span>
              </button>
            ) : (
              <button
                className="next-page-button"
                onClick={onNext}
                aria-label="Next page"
              >
                Lanjut <span className="caret">›</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Page illustration - bottom half */}
      <PageIllustration illustration={page.content.illustration} />
    </div>
  );
};

// PageIllustration component
const PageIllustration: React.FC<{ illustration: { character: Array<{
  image: string;
  name?: string;
  dialog?: string;
  x: number;
  y: number;
}> } }> = ({ illustration }) => {
  return (
    <div className="page-illustration">
      {illustration.character.map((char, index) => (
        <Character key={index} character={char} />
      ))}
    </div>
  );
};

// Character component is now imported from './components/Character'

export default LorePage;
