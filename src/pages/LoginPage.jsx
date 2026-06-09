import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [redirectPath, setRedirectPath] = useState('/');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    if (redirect && redirect.startsWith('/edificio/')) {
      setRedirectPath(redirect);
      localStorage.setItem('redirectAfterLogin', redirect);
    } else {
      const saved = localStorage.getItem('redirectAfterLogin');
      if (saved) setRedirectPath(saved);
    }
  }, [location]);

  const handleGoogleLogin = async () => {
    const redirectTo = window.location.origin + redirectPath;
    console.log('Redirigiendo a Google con:', redirectTo);
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