import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Materi.css';
import ExpandableItems from './ExpandableItems';

const PerulanganDasarDanLanjutan = () => {
  const lessons = [
    { id: 'strukturdata1', title: 'Fungsi Dasar Def', location: 'Makassar', description: 'Setelah mendarat di pelabuhan Makassar, Kodi disambut ombak tenang namun udara panas yang tak biasa. Para pelaut setempat gelisah. "Kami tak bisa berlayar, angin seperti enggan datang..."', image: '/images/modules/sulawesi/1makassar.webp' },
    { id: 'strukturdata2', title: 'Pengantar Array', location: 'Manado', description: '', image: '/images/modules/sulawesi/2manado.webp' },
    { id: 'strukturdata3', title: 'Daftar dan Kamus', location: 'Rantepao (Toraja)', description: '', image: '/images/modules/sulawesi/3ratenpao.webp' },
    { id: 'strukturdata4', title: 'Modularisasi', location: 'Parepare', description: '', image: '/images/modules/sulawesi/4parepare.webp' },
  ];

  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const handleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const navigate = useNavigate();
  const handleNavigate = (moduleId: string) => {
    navigate(`/materi/belajar?id=${moduleId}`);
  };

  return (
    <div className="pendahuluan-page">
      <Header />
      <div className="module-container">
        <div className="module-header">
          <div className="module-icon">
            <img src="/images/struktur-data-dan-interaksi.webp" alt="Pendahuluan" />
          </div>
          <div className="module-titles">
            <h1 className="module-title">Struktur Data</h1>
            <h2 className="module-subtitle">Sulawesi Series</h2>
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
        <ExpandableItems
          lessons={lessons}
          expandedItem={expandedItem}
          onExpand={handleExpand}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
};

export default PerulanganDasarDanLanjutan;
