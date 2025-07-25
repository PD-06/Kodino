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
  onNavigate: (id: string) => void;
}

function ExpandableItems({ modules, expandedItem, onExpand, onNavigate }: ExpandableItemsProps) {
  return (
    <div className="expandable-items">
      {modules.map((module, index) => (
        <div
          key={module.id}
          className={`expandable-item ${expandedItem === index ? 'expanded' : ''}`}
          onMouseEnter={() => {}}
          onClick={() => onExpand(index)}
        >
          <div className="expandable-header">
            <span className="expandable-title">
              {index + 1}. {module.title} <span>{module.location}</span>
            </span>
            <span className="expandable-icon">
              {expandedItem === index ? 'v' : '>'}
            </span>
          </div>
          {expandedItem === index && (
            <div className="expandable-content">
              <div className="content-image">
                <img src={module.image} alt={module.title} />
              </div>
              <div className="content-description">
                <p>{module.description}</p>
                <button
                  className="content-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(module.id);
                  }}
                >
                  Mulai Belajar
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExpandableItems;