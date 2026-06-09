import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseClient';

export default function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const checkAdmin = async () => {
      if (!user) {
        if (isMounted) setIsAdmin(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('perfiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (isMounted) setIsAdmin(data?.is_admin === true);
      } catch (err) {
        console.error(err);
        if (isMounted) setIsAdmin(false);
      }
    };
    if (!authLoading) checkAdmin();
    return () => { isMounted = false; };
  }, [user, authLoading]);

  // Mientras se verifica, no renderizamos nada (ni siquiera el children)
  if (authLoading || isAdmin === null) {
    return <div className="min-h-screen flex items-center justify-center">Verificando permisos...</div>;
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}