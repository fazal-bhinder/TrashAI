import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { BuilderPage } from './pages/BuilderPage';

function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      {location.pathname !== "/builder" && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
