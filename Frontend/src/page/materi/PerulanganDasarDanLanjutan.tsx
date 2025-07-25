import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Materi.css';
import ExpandableItems from './ExpandableItems';

const PerulanganDasarDanLanjutan = () => {
  const modules = [
    { id: 'perulangan1', title: 'Perulangan Penghitung dan Perulangan Kondisi', location: "Wamena", description: 'Kodi saat ini terdampar di Banda Aceh. Ia terbangun dan tiba tiba menyaksikan para pemuda sedang mencoba memperbaiki alat pemutar video dokumenter budaya Aceh. Tapi alat itu rusak. Mereka bilang, "Ini bukan masalah kabel… ini masalah kode!"', image: '/images/modules/papua/1wamena.webp' },
    { id: 'perulangan2', title: 'Berhenti, lalu Lanjutkan', location: "Asmat", description: 'Kodi membantu warga dalam Festival Nasi Padang yang sedang pakai sistem antrean otomatis. Warga menjelaskan: "Komputer itu seperti memasak rendang. Ada bahan masuk (masukan), proses masak (CPU), dan hasil keluar (keluaran)."', image: '/images/modules/papua/2asmat.webp' },
    { id: 'perulangan3', title: 'Perulangan Bertingkat', location: "Sentani", description: 'Saat perjalanannya, Kodi melewati Jembatan Ampera di Palembang, Kodi menemukan berbagai pemuda yang sedang berbincang. Mereka berdebat: "Pakai Python atau JavaScript?"\nKodi heran, ternyata komputer bisa diajak bicara… asal pakai bahasa khusus.', image: '/images/modules/papua/3sentani.webp' },
    { id: 'perulangan4', title: 'Simulasi Perulangan', location: "Nabire", description: 'Di pinggir Danau Toba, Kodi sempat membantu anak-anak memainkan alat musik tradisional Batak, tapi pakai aplikasi musik digital. Kata anak anak itu, kalau di alat musik ada urutan kode, di dalam komputer namanya syntax.', image: '/images/modules/papua/4nabire.webp' },
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
            <img src="/images/struktur-program-pengulangan-kompleks.webp" alt="Pendahuluan" />
          </div>
          <div className="module-titles">
            <h1 className="module-title">Perulangan Dasar dan Lanjutan</h1>
            <h2 className="module-subtitle">Papua Series</h2>
          </div>
        </div>

        <div className="module-content">
          <img 
            src="/images/modules/papua.webp"
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

export default PerulanganDasarDanLanjutan;
