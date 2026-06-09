import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

export default function PerfilPage() {
  const { user } = useAuth();
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [edificioId, setEdificioId] = useState('');
  const [edificios, setEdificios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase.from('perfiles').select('*').eq('id', user.id).single().then(({ data }) => {
      if (data) {
        setNombre(data.nombre_completo || '');
        setWhatsapp(data.numero_whatsapp || '');
        setEdificioId(data.edificio_id || '');
      }
    });
    supabase.from('edificios').select('id, nombre').then(({ data }) => setEdificios(data || []));
  }, [user]);

  const actualizarPerfil = async () => {
    const { error } = await supabase.from('perfiles').upsert({
      id: user.id,
      nombre_completo: nombre,
      numero_whatsapp: whatsapp,
      edificio_id: edificioId || null,
    });
    if (error) setMensaje('Error: ' + error.message);
    else setMensaje('✅ Perfil actualizado');
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral/5 to-white dark:from-darkBg dark:to-darkBg">
      <Navbar />
      <div className="pt-20 px-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-coral mb-6">🦀 Mi Perfil</h1>
        <div className="glass-card p-5 space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="input-glass"
          />
          <input
            type="tel"
            placeholder="WhatsApp (ej: 56912345678)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="input-glass"
          />
          <select value={edificioId} onChange={(e) => setEdificioId(e.target.value)} className="input-glass">
            <option value="">Selecciona tu edificio</option>
            {edificios.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
          </select>
          <button
            onClick={actualizarPerfil}
            className="w-full crab-gradient text-white py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
          >
            Guardar cambios
          </button>
          {mensaje && <p className="text-green-600 text-sm text-center animate-fade-in">{mensaje}</p>}
        </div>
      </div>
    </div>
  );
}