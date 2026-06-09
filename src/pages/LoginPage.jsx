import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState('/');

  useEffect(() => {
    // Obtener la URL a redirigir después del login
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      setRedirectPath(redirect);
      // Guardar en localStorage por si acaso (para Google OAuth que pierde el query)
      localStorage.setItem('redirectAfterLogin', redirect);
    } else {
      // Si no hay redirect, usar el último guardado o el edificio por defecto
      const saved = localStorage.getItem('redirectAfterLogin');
      if (saved) setRedirectPath(saved);
    }
  }, [location]);

  const handleGoogleLogin = async () => {
    // Construir la URL completa a donde volver después del login
    const redirectUrl = window.location.origin + redirectPath;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl }
    });
    if (error) setError(error.message);
  };

  // También puedes mantener el login con email si quieres, pero ya está deshabilitado

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coral/20 to-white dark:from-darkBg dark:to-darkBg p-4">
      <div className="glass-card w-full max-w-md p-8 text-center animate-fade-in">
        <img src="/crab-icon.svg" alt="Cangrejo" className="w-20 h-20 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-coral">Grab Me</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Tu comunidad al alcance</p>
        <button
          onClick={handleGoogleLogin}
          className="mt-8 w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 py-3 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Continuar con Google
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
}