import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { type LessonPages, getLessonById, type SpeakPage as SpeakPageType, type QuizPage as QuizPageType } from './types';
import LorePage from './LorePage';
import SpeakPage from './SpeakPage';
import QuizPage from './QuizPage';
import Header from '../../../components/Header';
import './Belajar.css';

const Belajar: React.FC = () => {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('id');
  const [lesson, setLesson] = useState<LessonPages | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLesson = async () => {
      if (!lessonId) {
        setError('No lesson ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const loadedLesson = await getLessonById(lessonId);
        if (loadedLesson) {
          setLesson(loadedLesson);
        } else {
          setError('Lesson not found');
        }
      } catch (err) {
        setError('Failed to load lesson');
        console.error('Error loading lesson:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadLesson();
  }, [lessonId]);

  const handleNextPage = () => {
    if (lesson && currentPageIndex < lesson.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const renderCurrentPage = () => {
    if (!lesson) return null;
    
    const currentPage = lesson.pages[currentPageIndex];
    const isFirstPage = currentPageIndex === 0;
    const isLastPage = currentPageIndex === lesson.pages.length - 1;
    
    switch (currentPage.type) {
      case 'lore':
        return (
          <LorePage 
            page={currentPage} 
            onNext={handleNextPage} 
            isLastPage={isLastPage}
          />
        );
      case 'speak':
        // Add isFirstPage to the page object for the SpeakPage
        const speakPage = {
          ...currentPage,
          isFirstPage
        } as SpeakPageType;
        
        return (
          <SpeakPage 
            page={speakPage}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            isLastPage={isLastPage}
          />
        );
      case 'quiz':
        return (
          <QuizPage 
            page={currentPage as QuizPageType}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
            isLastPage={isLastPage}
          />
        );
      default:
        return <div>Unknown page type</div>;
    }
  };
  
  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!lesson) {
    return <div className="error-container">Lesson not found</div>;
  }

  return (
    <div className="belajar-page">
      <Header />
      <div className="lesson-container">
        {renderCurrentPage()}
      </div>
    </div>
  );
};

export default Belajar;
