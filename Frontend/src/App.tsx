import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './page/LandingPage';
import TentangPage from './page/TentangPage';
import MateriPage from './page/MateriPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/materi" element={<MateriPage />} />
      </Routes>
    </Router>
  );
}

export default App;