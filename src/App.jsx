import { Routes, Route, Navigate } from 'react-router-dom';
import EdificioPage from './pages/EdificioPage';
import LoginPage from './pages/LoginPage';
import PerfilPage from './pages/PerfilPage';
import AdminPage from './pages/AdminPage';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/edificio/:id" element={
        <PrivateRoute>
          <EdificioPage />
        </PrivateRoute>
      } />
      <Route path="/perfil" element={
        <PrivateRoute>
          <PerfilPage />
        </PrivateRoute>
      } />
      <Route path="/admin" element={
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      } />
      <Route path="/" element={<Navigate to="/edificio/e179d7a8-efde-4eaf-aa6d-411c5586bdc7" replace />} />
    </Routes>
  );
}

export default App;