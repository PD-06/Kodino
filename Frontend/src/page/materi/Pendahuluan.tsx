import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Materi.css';
import ExpandableItems from './ExpandableItems';

interface User {
  id: string;
  nama_panjang: string;
  username: string;
  email?: string;
  dikoin: number;
  progress?: {
    section: number;
    level: number;
  };
}

interface CourseProgress {
  course_id: string;
  course_title: string;
  is_completed: boolean;
  is_unlocked: boolean;
  order: number;
}

interface ModuleProgress {
  module_id: string;
  total_courses: number;
  completed_courses: number;
  progress_percentage: number;
  courses: CourseProgress[];
}

const Pendahuluan = () => {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const lessons = [
    { id: 'pendahuluan1', title: 'Apa itu Ngoding?', location: "Aceh", description: 'Kodi saat ini terdampar di Banda Aceh. Ia terbangun dan tiba tiba menyaksikan para pemuda sedang mencoba memperbaiki alat pemutar video dokumenter budaya Aceh. Tapi alat itu rusak. Mereka bilang, "Ini bukan masalah kabel… ini masalah kode!"', image: '/images/modules/sumatra/1aceh.webp' },
    { id: 'pendahuluan2', title: 'Cara Kerja Komputer', location: "Padang", description: 'Kodi membantu warga dalam Festival Nasi Padang yang sedang pakai sistem antrean otomatis. Warga menjelaskan: "Komputer itu seperti memasak rendang. Ada bahan masuk (masukan), proses masak (CPU), dan hasil keluar (keluaran)."', image: '/images/modules/sumatra/2padang.webp' },
    { id: 'pendahuluan3', title: 'Bahasa Pemrograman', location: "Palembang", description: 'Saat perjalanannya, Kodi melewati Jembatan Ampera di Palembang, Kodi menemukan berbagai pemuda yang sedang berbincang. Mereka berdebat: "Pakai Python atau JavaScript?"\nKodi heran, ternyata komputer bisa diajak bicara… asal pakai bahasa khusus.', image: '/images/modules/sumatra/3palembang.webp' },
    { id: 'pendahuluan4', title: 'Ngoding itu Gimana Sih?', location: "Batak Toba", description: 'Di pinggir Danau Toba, Kodi sempat membantu anak-anak memainkan alat musik tradisional Batak, tapi pakai aplikasi musik digital. Kata anak anak itu, kalau di alat musik ada urutan kode, di dalam komputer namanya syntax.', image: '/images/modules/sumatra/4bataktoba.webp' },
    { id: 'pendahuluan5', title: 'Siap Jadi Programmer!', location: "Lampung", description: 'Di kaki Gunung Krakatau, Kodi bertemu komunitas anak muda yang sedang membuat aplikasi pertanian. Mereka berkata: "Kami bukan jenius. Kami cuma rajin mencoba dan nggak takut gagal."', image: '/images/modules/sumatra/5lampung.webp' },
  ];

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('kodino_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        fetchModuleProgress(parsedUser.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchModuleProgress = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/course-completion/module/${userId}/pendahuluan`);
      if (response.ok) {
        const progressData: ModuleProgress = await response.json();
        setModuleProgress(progressData);
      }
    } catch (error) {
      console.error('Error fetching module progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpand = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleNavigate = (moduleId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const courseProgress = moduleProgress?.courses.find(c => c.course_id === moduleId);
    
    if (courseProgress && courseProgress.is_unlocked) {
      navigate(`/materi/belajar/${moduleId}`);
    } else {
      // Improved message for locked courses
      const courseIndex = modules.findIndex(m => m.id === moduleId);
      if (courseIndex === 0) { 
        // This should never happen since first course is always unlocked
        alert('Terjadi kesalahan. Silakan refresh halaman.');
      } else {
        alert('Kamu harus menyelesaikan course sebelumnya terlebih dahulu!');
      }
    }
  };

  const isCourseUnlocked = (courseId: string): boolean => {
    if (!moduleProgress) {
      // While loading, assume first course is unlocked
      const courseIndex = modules.findIndex(m => m.id === courseId);
      return courseIndex === 0;
    }
    const courseProgress = moduleProgress.courses.find(c => c.course_id === courseId);
    return courseProgress?.is_unlocked || false;
  };

  const isCourseCompleted = (courseId: string): boolean => {
    if (!moduleProgress) return false;
    const courseProgress = moduleProgress.courses.find(c => c.course_id === courseId);
    return courseProgress?.is_completed || false;
  };

  if (!user) {
    return (
      <div className="pendahuluan-page">
        <Header />
        <div className="module-container">
          <div className="login-prompt">
            <h2>Silakan login terlebih dahulu untuk mengakses materi</h2>
            <button onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Progress Summary */}
        {moduleProgress && (
          <div className="module-progress">
            <h3>Progress Modul</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${moduleProgress.progress_percentage}%` }}
              ></div>
            </div>
            <p>
              {moduleProgress.completed_courses} dari {moduleProgress.total_courses} course selesai 
              ({Math.round(moduleProgress.progress_percentage)}%)
            </p>
          </div>
        )}

        <div className="module-content">
          <img 
            src="/images/modules/sumatra.webp"
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
          isCourseUnlocked={isCourseUnlocked}
          isCourseCompleted={isCourseCompleted}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Pendahuluan;