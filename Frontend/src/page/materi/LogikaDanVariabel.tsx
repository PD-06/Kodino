import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Materi.css';

const Pendahuluan = () => {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const modules = [
    { id: 'pendahuluan1', location: 'Pontianak', title: 'Pengenalan Python', image: '/images/modules/kalimantan/1pontianak.webp', description: 'Kodi baru saja mendapatkan kekuatan untuk menggerakkan objek dengan telekinesis melalui kode, merasa bingung tentang bagaimana cara memulai. Saat dia berkelana dalam dunia digital, Kodi dipandu oleh ular piton misterius dari Pontianak yang menunjukkan Python sebagai bahasa pemrograman pertama yang harus dipelajari. Tetapi, bedanya Python yang dibuat oleh ular piton dimodifikasi dalam bahasa Indonesia biar karena ular piton sangat nasionalis.' },
    { id: 'pendahuluan2', location: 'Tenggarong', title: 'Variabel & Tipe Data', image: '/images/modules/kalimantan/2tenggarong.webp', description: 'Sesampainya di Tenggarong, Kodi mengamati bahwa masyarakat sering menggunakan kantung adat untuk membawa barang-barang penting. \n' + 'Di petualangan Kodi di Tenggarong, warga desa meminta bantuan untuk memasukkan barang barang mereka kedalam kantung-kantung. Tapi barang-barang ini berantakan dan nggak dinamain!\n' + 'Kodi lalu bilang,\n' + '"Tenang! Aku akan simpan satu per satu ke dalam kantung sakti dengan nama yang jelas! Tapi kamu harus membantu juga!"\n' },
    { id: 'pendahuluan3', location: 'Banjarmasin', title: 'Operator Logika dan Percabangan', image: '/images/modules/kalimantan/3banjarmasin.webp', description: 'Setelah membantu masyarakat desa, Kodi sekarang haru melewati gerbang perbatasan Banjarmasin. Tapi, gerbang ini cuma bisa terbuka kalau beberapa syarat dipenuhi. Kata masyarakat Kalimantan, ada 2 syarat yang bisa dipakai untuk membuka gerbang, yaitu yang pertama cuaca cerah, kedua adalah ada peta. Tetapi Kodi bingung apakah kedua syarat harus ditepati atau hanya salah satu. Lalu, di depan gerbang, Kodi menemukan sebuah kamus, yaitu kamus operator logika.' },
    { id: 'pendahuluan4', location: 'Tanah Grogot', title: 'Input Output Interaktif', image: '/images/modules/kalimantan/4tanahgrogot.webp', description: 'Kodi tiba di Tanah Grogot, sebuah wilayah dengan hamparan sawah dan tradisi pertanian yang kuat.\n' + ' Di desa itu, ada festival panen dan warga ingin mencatat nama petani dan jumlah hasil panennya secara digital untuk pertama kalinya.\n' + 'Tapi warga bingung bagaimana cara komputer tahu siapa yang mengisi data dan apa yang dimasukkan.\n' + 'Kodi berkata: “Kita perlu alat untuk mendengar (masukan), dan berbicara kembali (keluaran)!”' },
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
        <div className="expandable-items">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className={`expandable-item ${expandedItem === index ? 'expanded' : ''}`}
              onMouseEnter={() => {}}
              onClick={() => handleExpand(index)}
            >
              <div className="expandable-header">
                <span className="expandable-title">{index + 1}. {module.title} <span>{module.location}</span></span>
                <span className="expandable-icon">{expandedItem === index ? 'v' : '>'}</span>
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
                        handleNavigate(module.id);
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
      </div>
    </div>
  );
};

export default Pendahuluan;
