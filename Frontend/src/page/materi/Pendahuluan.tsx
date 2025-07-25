import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Materi.css';
import ExpandableItems from './ExpandableItems';

const Pendahuluan = () => {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const modules = [
    { id: 'pendahuluan1', title: 'Apa itu Ngoding?', location: "Aceh", description: 'Kodi saat ini terdampar di Banda Aceh. Ia terbangun dan tiba tiba menyaksikan para pemuda sedang mencoba memperbaiki alat pemutar video dokumenter budaya Aceh. Tapi alat itu rusak. Mereka bilang, "Ini bukan masalah kabel… ini masalah kode!"', image: '/images/modules/sumatra/1aceh.webp' },
    { id: 'pendahuluan2', title: 'Cara Kerja Komputer', location: "Padang",  description: 'Kodi membantu warga dalam Festival Nasi Padang yang sedang pakai sistem antrean otomatis. Warga menjelaskan: "Komputer itu seperti memasak rendang. Ada bahan masuk (masukan), proses masak (CPU), dan hasil keluar (keluaran)."', image: '/images/modules/sumatra/2padang.webp' },
    { id: 'pendahuluan3', title: 'Bahasa Pemrograman', location: "Palembang",  description: 'Saat perjalanannya, Kodi melewati Jembatan Ampera di Palembang, Kodi menemukan berbagai pemuda yang sedang berbincang. Mereka berdebat: "Pakai Python atau JavaScript?"\nKodi heran, ternyata komputer bisa diajak bicara… asal pakai bahasa khusus.', image: '/images/modules/sumatra/3palembang.webp' },
    { id: 'pendahuluan4', title: 'Ngoding itu Gimana Sih?', location: "Batak Toba",  description: 'Di pinggir Danau Toba, Kodi sempat membantu anak-anak memainkan alat musik tradisional Batak, tapi pakai aplikasi musik digital. Kata anak anak itu, kalau di alat musik ada urutan kode, di dalam komputer namanya syntax.', image: '/images/modules/sumatra/4bataktoba.webp' },
    { id: 'pendahuluan5', title: 'Siap Jadi Programmer!', location: "Lampung",  description: 'Di kaki Gunung Krakatau, Kodi bertemu komunitas anak muda yang sedang membuat aplikasi pertanian. Mereka berkata: “Kami bukan jenius. Kami cuma rajin mencoba dan nggak takut gagal.”', image: '/images/modules/sumatra/5lampung.webp' },
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
            <h2 className="module-subtitle">Sumatra Series</h2>
          </div>
        </div>

        <div className="module-content">
          <img 
            src="/images/modules/sumatra.webp"
            alt="Pendahuluan Content" 
            className="module-image"
          />
        </div>

        {/* Expandable Items Section */}
        <ExpandableItems
          modules={modules}
          expandedItem={expandedItem}
          onExpand={handleExpand}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
};

export default Pendahuluan;
