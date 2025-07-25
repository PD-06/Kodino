import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Materi.css';
import ExpandableItems from './ExpandableItems';

const PerulanganDasarDanLanjutan = () => {
  const lessons = [
    { id: 'perulangan1', title: 'Perulangan Penghitung dan Perulangan Kondisi', location: "Wamena", description: 'Kodi sampai di Lembah Baliem dan ikut serta dalam persiapan Festival Perang Suku Dani. Mereka membuat barisan tarian dan menyusun ikonik tombak bambu secara berulang. Lalu, Kodi diajak untuk melempar tombak-tombak tersebut secara berulang.', image: '/images/modules/papua/1wamena.webp' },
    { id: 'perulangan2', title: 'Berhenti, lalu Lanjutkan', location: "Asmat", description: 'Di tengah kampung pengrajin kayu, Kodi melihat para seniman Asmat mengukir batu tradisional. Namun, jika ada bagian batu yang hancur di tengah, mereka akan langsung berhenti. Kalau ada kesalahan kecil saja, mereka lewatkan saja bagian itu dan lanjut ke bagian berikutnya.' + 'Seorang pengrajin berkata:\n' + '“Dalam coding dan seni, ada satu hal yang serupa, yaitu kita perlu tahu kapan harus lanjut, dan kapan harus berhenti.”\n', image: '/images/modules/papua/2asmat.webp' },
    { id: 'perulangan3', title: 'Perulangan Bertingkat', location: "Sentani", description: 'Kodi mengunjungi para nelayan di Danau Sentani. Nelayan tersebut memiliki 10 buah kolam, dan di dalam setiap kolam terhadap 5 ikan. Kemudian, kami dipanggil nelayan untuk mengambil seluruh ikan di dalam semua kolam, tetapi Kodi harus mengambilnya satu per satu. ', image: '/images/modules/papua/3sentani.webp' },
    { id: 'perulangan4', title: 'Simulasi Perulangan', location: "Nabire", description: 'Di Nabire, Kodi diajak ke pusat simulasi cuaca dan tsunami lokal. Anak-anak menggunakan komputer untuk memprediksi hujan berdasarkan pola yang berulang setiap hari. Ternyata, perulangan juga bisa digabungkan dengan masukan/keluaran interaktif, operasi logika, dan percabangan.', image: '/images/modules/papua/4nabire.webp' },
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
