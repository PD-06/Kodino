import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Materi.css';
import ExpandableItems from './ExpandableItems';

const Pendahuluan = () => {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const lessons = [
    { id: 'logikavariabel1', location: 'Pontianak', title: 'Pengenalan Python', image: '/images/modules/kalimantan/1pontianak.webp', description: 'Kodi baru saja mendapatkan kekuatan untuk menggerakkan objek dengan telekinesis melalui kode, merasa bingung tentang bagaimana cara memulai. Saat dia berkelana dalam dunia digital, Kodi dipandu oleh ular piton misterius dari Pontianak yang menunjukkan Python sebagai bahasa pemrograman pertama yang harus dipelajari. Tetapi, bedanya Python yang dibuat oleh ular piton dimodifikasi dalam bahasa Indonesia biar karena ular piton sangat nasionalis.' },
    { id: 'logikavariabel2', location: 'Tenggarong', title: 'Variabel & Tipe Data', image: '/images/modules/kalimantan/2tenggarong.webp', description: 'Di petualangan Kodi di Tenggarong, warga desa meminta bantuan untuk memasukkan barang barang mereka kedalam kantung-kantung. Tapi barang-barang ini berantakan dan nggak dinamain!' },
    { id: 'logikavariabel3', location: 'Banjarmasin', title: 'Operator Logika dan Percabangan', image: '/images/modules/kalimantan/3banjarmasin.webp', description: 'Setelah membantu masyarakat desa, Kodi sekarang haru melewati gerbang perbatasan Banjarmasin. Tapi, gerbang ini cuma bisa terbuka kalau beberapa syarat dipenuhi. Kata masyarakat Kalimantan, ada 2 syarat yang bisa dipakai untuk membuka gerbang, yaitu yang pertama cuaca cerah, kedua adalah ada peta. Tetapi Kodi bingung apakah kedua syarat harus ditepati atau hanya salah satu. Lalu, di depan gerbang, Kodi menemukan sebuah kamus, yaitu kamus operator logika.' },
    { id: 'logikavariabel4', location: 'Tanah Grogot', title: 'Input Output Interaktif', image: '/images/modules/kalimantan/4tanahgrogot.webp', description: 'Kodi tiba di Tanah Grogot, sebuah wilayah dengan hamparan sawah dan tradisi pertanian yang kuat. Di desa itu, ada festival panen dan warga ingin mencatat nama petani dan jumlah hasil panennya secara digital untuk pertama kalinya. Tapi warga bingung bagaimana cara komputer tahu siapa yang mengisi data dan apa yang dimasukkan.' },
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
            <img src="/images/logika-dan-variabel.webp" alt="Pendahuluan" />
          </div>
          <div className="module-titles">
            <h1 className="module-title">Logika Dan Variabel</h1>
            <h2 className="module-subtitle">Kalimantan Series</h2>
          </div>
        </div>

        <div className="module-content">
          <img 
            src="/images/modules/kalimantan.webp"
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

export default Pendahuluan;
