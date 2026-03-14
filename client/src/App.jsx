import { Routes, Route } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SpookyPopups from './components/SpookyPopups';

function App() {
  return (
    <>
      <SpookyPopups />
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
