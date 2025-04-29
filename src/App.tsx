import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import CanvasPage from './components/CanvasPage';

function App() {
  const isAuthenticated = !!localStorage.getItem('uid');

  return (
    
      <Routes>
        {/* Ruta raíz */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Registro */}
        <Route path="/register" element={<Register />} />

        {/* Dashboard solo si estás logueado */}
        <Route path="/dashboard" element={
          isAuthenticated ? <CanvasPage /> : <Navigate to="/login" />
        } />

        {/* Cualquier ruta desconocida manda al inicio */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;
