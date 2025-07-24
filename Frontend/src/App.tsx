import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './page/LandingPage';
import TentangPage from './page/TentangPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang" element={<TentangPage />} />
      </Routes>
    </Router>
  );
}

export default App;