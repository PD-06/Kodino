import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './page/LandingPage';
import TentangPage from './page/TentangPage';
import MateriPage from './page/MateriPage';
import Pendahuluan from './page/materi/Pendahuluan';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/materi" element={<MateriPage />} />
        <Route path="/materi/pendahuluan" element={<Pendahuluan />} />
      </Routes>
    </Router>
  );
}

export default App;