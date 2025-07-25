import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './page/LandingPage';
import TentangPage from './page/TentangPage';
import MateriPage from './page/MateriPage';
import LoginPage from './page/LoginPage';
import RegisterPage from './page/RegisterPage';
import Pendahuluan from "./page/materi/Pendahuluan.tsx";
import LogikaDanVariabel from "./page/materi/LogikaDanVariabel.tsx";
import PerulanganDasarDanLanjutan from "./page/materi/PerulanganDasarDanLanjutan.tsx";
import ApaItuNgoding from "./page/materi/ApaItuNgoding.tsx"; // Placeholder for ApaItuNgoding
import Dashboard from "./page/Dashboard.tsx"; // Placeholder for Dashboard
import CaraKerjaKomputer from './page/materi/CaraKerjaKomputer.tsx';
import BahasaPemrograman from './page/materi/BahasaPemrograman.tsx';
import NgodingItuGimana from './page/materi/NgodingItuGimanaSih.tsx';
import SiapJadiProgrammer from './page/materi/SiapJadiProgrammer.tsx';
import AIQuizPendahuluan from './page/materi/AIQuizPendahuluan.tsx';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/materi" element={<MateriPage />} />
        <Route path="/materi/pendahuluan" element={<Pendahuluan />} />
        <Route path="/materi/logika-dan-variabel" element={<LogikaDanVariabel />} />
        <Route path="/materi/perulangan" element={<PerulanganDasarDanLanjutan />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />}/> {/* Placeholder for RegisterPage */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Placeholder for Dashboard */}
        <Route path="/materi/belajar/pendahuluan1" element={<ApaItuNgoding />} /> {/* Placeholder for ApaItuNgoding */}
        <Route path='/materi/belajar/pendahuluan2' element={<CaraKerjaKomputer />} /> {/* Placeholder for CaraKerjaKomputer */}
        <Route path='/materi/belajar/pendahuluan3' element={<BahasaPemrograman />} /> {/* Placeholder for BahasaPemrograman */}
        <Route path='/materi/belajar/pendahuluan4' element={<NgodingItuGimana />} /> {/* Placeholder for NgodingItuGimana */}
        <Route path='/materi/belajar/pendahuluan5' element={<SiapJadiProgrammer />} /> {/* Placeholder for SiapJadiProgrammer */}
        <Route path="/materi/ai-quiz/pendahuluan" element={<AIQuizPendahuluan />} /> {/* Placeholder for AIQuizPendahuluan */}
        {/* Add more routes as needed */}
        <Route path="*" element={<LandingPage />} /> {/* Fallback route */}
        <Route path="/404" element={<h1>Page Not Found</h1>} />
        <Route path="/500" element={<h1>Internal Server Error</h1>} />
        <Route path="/maintenance" element={<h1>Site Under Maintenance</h1>} />
        <Route path="/coming-soon" element={<h1>Coming Soon</h1>} />
        <Route path="/privacy-policy" element={<h1>Privacy Policy</h1>} />
        <Route path="/terms-of-service" element={<h1>Terms of Service</h1>} />
      </Routes>
    </Router>
  );
}

export default App;