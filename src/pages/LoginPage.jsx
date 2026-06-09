// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [edificioId, setEdificioId] = useState('');

  useEffect(() => {
    // Obtener el edificio de la URL si existe (ej: ?redirect=/edificio/123)
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect && redirect.startsWith('/edificio/')) {
      const id = redirect.split('/')[2];
      setEdificioId(id);
    } else {
      // Si no hay redirect, usar un edificio por defecto (opcional)
      setEdificioId('e179d7a8-efde-4eaf-aa6d-411c5586bdc7'); // Cambia por un ID real
    }
  }, []);

  const handleGoogleLogin = async () => {
    if (!edificioId) return;
    // Usa la URL actual (origen) y añade la ruta del edificio
    const redirectTo = `${window.location.origin}/edificio/${edificioId}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo }
    });
    if (error) setError(error.message);
  };

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