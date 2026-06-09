import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      supabase.from('perfiles').select('is_admin').eq('id', user.id).single()
        .then(({ data }) => {
          console.log('is_admin desde Navbar:', data?.is_admin);
          setIsAdmin(data?.is_admin || false);
        });
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const goToAdmin = () => {
    console.log('Navegando a /admin');
    navigate('/admin');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-20 backdrop-blur-md bg-white/70 dark:bg-darkBg/80 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <img src="/crab-icon.svg" alt="Cangrejo" className="w-8 h-8" />
        <span className="text-xl font-bold text-coral">Grab Me</span>
      </div>
      <div className="flex items-center gap-3">
        {isAdmin && (
          <button onClick={goToAdmin} className="text-gray-700 dark:text-gray-200 text-sm bg-coral/10 px-2 py-1 rounded-full">
            Admin
          </button>
        )}
        <button onClick={() => navigate('/perfil')} className="text-gray-700 dark:text-gray-200 text-xl">👤</button>
        <button onClick={handleLogout} className="text-sm text-gray-500">Salir</button>
      </div>
    </nav>
  );
}