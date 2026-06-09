import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../hooks/useAuth';
import Tabs from '../components/Tabs';
import PublicacionCard from '../components/PublicacionCard';
import PublicacionForm from '../components/PublicacionForm';
import Navbar from '../components/Navbar';

export default function EdificioPage() {
  const { id: edificioId } = useParams();
  const { user } = useAuth();
  const [publicaciones, setPublicaciones] = useState([]);
  const [tipoActivo, setTipoActivo] = useState('ofrezco');
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

const cargarPublicaciones = async () => {
  const { data } = await supabase
    .from('publicaciones')
    .select('*, perfiles(nombre_completo)')
    .eq('edificio_id', edificioId) // 👈 Filtro clave
    .eq('activo', true)
    .order('created_at', { ascending: false });
  setPublicaciones(data);
};

useEffect(() => {
  // Una vez que estamos en el edificio, borramos el redirect guardado
  localStorage.removeItem('redirectAfterLogin');
}, []);

  useEffect(() => {
    cargarPublicaciones();
  }, [edificioId, tipoActivo]);

  if (!edificioId) return <div className="p-4">Edificio no especificado</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral/5 via-white to-white dark:from-darkBg dark:to-darkBg pb-20">
      <Navbar />
      <div className="pt-20 px-3">
        <Tabs tipoActivo={tipoActivo} setTipoActivo={setTipoActivo} />
        
        <div className="mt-4 space-y-4 animate-fade-in">
          {cargando ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-coral border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : publicaciones.length === 0 ? (
            <div className="glass-card text-center py-10 text-gray-500 dark:text-gray-400">
              🦀 No hay publicaciones. ¡Sé el primero!
            </div>
          ) : (
            publicaciones.map(pub => <PublicacionCard key={pub.id} pub={pub} />)
          )}
        </div>
      </div>

      {/* Botón flotante mejorado */}
      <button
        onClick={() => setMostrarForm(true)}
        className="fixed bottom-6 right-6 bg-coral text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-coral/50 z-30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {mostrarForm && (
        <PublicacionForm
          edificioId={edificioId}
          usuarioId={user.id}
          onClose={() => setMostrarForm(false)}
          onSuccess={() => {
            cargarPublicaciones();
            setMostrarForm(false);
          }}
        />
      )}
    </div>
  );
}