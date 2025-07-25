import React from 'react';

interface Module {
  id: string;
  title: string;
  location: string;
  description: string;
  image: string;
}

interface ExpandableItemsProps {
  modules: Module[];
  expandedItem: number | null;
  onExpand: (index: number) => void;
  onNavigate: (moduleId: string) => void;
  isCourseUnlocked: (courseId: string) => boolean;
  isCourseCompleted: (courseId: string) => boolean;
  isLoading: boolean;
}

const ExpandableItems: React.FC<ExpandableItemsProps> = ({
  modules,
  expandedItem,
  onExpand,
  onNavigate,
  isCourseUnlocked,
  isCourseCompleted,
  isLoading
}) => {
  const getStatusIcon = (moduleId: string) => {
    if (isLoading) return '⏳';
    if (isCourseCompleted(moduleId)) return '✅';
    if (isCourseUnlocked(moduleId)) return '🔓';
    return '🔒';
  };

  const getStatusText = (moduleId: string) => {
    if (isLoading) return 'Memuat...';
    if (isCourseCompleted(moduleId)) return 'Selesai';
    if (isCourseUnlocked(moduleId)) return 'Tersedia';
    return 'Terkunci';
  };

  const getButtonText = (moduleId: string) => {
    if (isLoading) return 'Memuat...';
    if (isCourseCompleted(moduleId)) return 'Review Materi';
    if (isCourseUnlocked(moduleId)) return 'Mulai Belajar';
    return 'Terkunci';
  };

  const isButtonDisabled = (moduleId: string) => {
    return isLoading || !isCourseUnlocked(moduleId);
  };

  return (
    <div className="expandable-items">
      {modules.map((module, index) => (
        <div 
          key={module.id} 
          className={`expandable-item ${expandedItem === index ? 'expanded' : ''} ${
            isCourseCompleted(module.id) ? 'completed' : ''
          } ${
            !isCourseUnlocked(module.id) ? 'locked' : ''
          }`}
        >
          <div className="expandable-header" onClick={() => onExpand(index)}>
            <div className="expandable-title">
              <span className="status-icon">{getStatusIcon(module.id)}</span>
              <span className="title-text">{module.title}</span>
              <span className="location-text">• {module.location}</span>
              <span className="status-text">({getStatusText(module.id)})</span>
            </div>
            <div className="expandable-icon">
              {expandedItem === index ? '-' : '+'}
            </div>
          </div>
          
          <div className="expandable-content">
            <div className="content-layout">
              <div className="content-image">
                <img src={module.image} alt={module.title} />
              </div>
              
              <div className="content-info">
                <div className="content-description">
                  <p>{module.description}</p>
                </div>
                
                <div className="content-action">
                  <button 
                    className={`content-button ${isCourseCompleted(module.id) ? 'success' : ''}`}
                    onClick={() => onNavigate(module.id)}
                    disabled={isButtonDisabled(module.id)}
                  >
                    {getButtonText(module.id)}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpandableItems;