import React, { useState } from 'react';
import { type QuizPage as QuizPageType } from './types';

interface QuizPageProps {
  page: QuizPageType;
  onPrevious: () => void;
  onNext: () => void;
  isLastPage: boolean;
}

const QuizPage: React.FC<QuizPageProps> = ({ page, onPrevious, onNext, isLastPage }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { character, question } = page.content;

  const handleAnswerClick = (answerId: string, isCorrectAnswer: boolean) => {
    if (hasAnswered && isCorrect) return; // Don't allow changing answer if already correct
    
    setSelectedAnswer(answerId);
    setIsCorrect(isCorrectAnswer);
    setHasAnswered(true);
  };

  const handleNext = () => {
    if (!hasAnswered || !isCorrect) return;
    onNext();
  };

  const getAnswerClass = (answerId: string) => {
    if (answerId === selectedAnswer) {
      return isCorrect ? 'correct-answer' : 'wrong-answer';
    }
    return '';
  };

  return (
    <div className="quiz-page">
      <h1 className="page-heading">{page.heading}</h1>

      <div className="quiz-content">
        <div className="character-image-wrapper">
          <img
            src={character.image}
            alt={character.name}
            className={`character-image ${character.direction === 'left' ? 'character-face-left' : ''}`}
          />
          <div className="character-name">
            {character.name}
          </div>
        </div>

        <div className="question-section">
          <div className="question-text">
            {hasAnswered 
              ? (isCorrect ? question.correctText : question.wrongText)
              : question.text}
          </div>
          
          <div className="answer-options">
            {question.answers.map((answer) => (
              <button
                key={answer.id}
                className={`answer-option ${getAnswerClass(answer.id)}`}
                onClick={() => handleAnswerClick(answer.id, answer.isCorrect)}
                disabled={hasAnswered && isCorrect && selectedAnswer !== answer.id}
              >
                {answer.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="quiz-navigation">
        <button 
          className="nav-button prev-button" 
          onClick={onPrevious}
          aria-label="Previous page"
        >
          <span className="caret">‹</span> Sebelumnya
        </button>
        
        <button 
          className={`nav-button next-button ${!isCorrect ? 'disabled' : ''} ${isLastPage ? 'finish-button' : ''}`} 
          onClick={handleNext}
          disabled={!isCorrect}
          aria-label={isLastPage ? 'Selesai' : 'Next page'}
        >
          {isLastPage ? 'Selesai' : 'Lanjut'} <span className="caret">›</span>
        </button>
      </div>
    </div>
  );
};

export default QuizPage;
