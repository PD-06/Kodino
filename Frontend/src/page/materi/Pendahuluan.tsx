import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Pendahuluan.css';

const Pendahuluan = () => {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const modules = [
    { id: 'pendahuluan1', title: 'Apa itu Ngoding?', description: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', image: '/images/modules/pendahuluan/module1.webp' },
    { id: 'pendahuluan2', title: 'Cara Kerja Komputer', description: 'Description for Module 2', image: '/images/modules/pendahuluan/module2.webp' },
    { id: 'pendahuluan3', title: 'Bahasa Pemrograman', description: 'Description for Module 3', image: '/images/modules/pendahuluan/module3.webp' },
    { id: 'pendahuluan4', title: 'Ngoding itu Gimana Sih?', description: 'Description for Module 4', image: '/images/modules/pendahuluan/module4.webp' },
    { id: 'pendahuluan5', title: 'Siap Jadi Programmer!', description: 'Description for Module 5', image: '/images/modules/pendahuluan/module5.webp' },
  ];

  const handleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleNavigate = (moduleId: string) => {
    navigate(`/materi/belajar?id=${moduleId}`);
  };

  return (
    <div className="pendahuluan-page">
      <Header />
      <div className="module-container">
        <div className="module-header">
          <div className="module-icon">
            <img src="/images/pendahuluan.webp" alt="Pendahuluan" />
          </div>
          <div className="module-titles">
            <h1 className="module-title">Pendahuluan</h1>
            <h2 className="module-subtitle">Aceh</h2>
          </div>
        </div>

        <div className="module-content">
          <img 
            src="/images/modules/sulawesi.webp"
            alt="Pendahuluan Content" 
            className="module-image"
          />
        </div>

        {/* Expandable Items Section */}
        <div className="expandable-items">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className={`expandable-item ${expandedItem === index ? 'expanded' : ''}`}
              onMouseEnter={() => {}}
              onClick={() => handleExpand(index)}
            >
              <div className="expandable-header">
                <span className="expandable-title">{index + 1}. {module.title}</span>
                <span className="expandable-icon">{expandedItem === index ? 'v' : '>'}</span>
              </div>
              {expandedItem === index && (
                <div className="expandable-content">
                  <div className="content-image">
                    <img src={module.image} alt={module.title} />
                  </div>
                  <div className="content-description"><p>{module.description}</p></div>
                  <button
                    className="content-button"
                    onClick={() => handleNavigate(module.id)}
                  >
                    Belajar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pendahuluan;
