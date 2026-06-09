import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function PublicacionForm({ edificioId, usuarioId, onClose, onSuccess }) {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('ofrezco');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!whatsapp.trim()) return setError('WhatsApp es obligatorio');
    if (!precio || parseFloat(precio) <= 0) return setError('Precio válido requerido');
    setCargando(true);
    const { error: dbError } = await supabase.from('publicaciones').insert({
      titulo,
      tipo,
      precio: parseFloat(precio),
      descripcion,
      whatsapp_contacto: whatsapp,
      usuario_id: usuarioId,
      edificio_id: edificioId,
    });
    if (dbError) setError(dbError.message);
    else onSuccess();
    setCargando(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md p-6 relative shadow-2xl animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 text-2xl leading-none"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-coral mb-4">✨ Nueva publicación</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Título *"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input-glass"
            required
          />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="input-glass">
            <option value="ofrezco">🔨 Ofrezco</option>
            <option value="busco">🔍 Busco</option>
          </select>
          <input
            type="number"
            placeholder="Precio por día (CLP) *"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="input-glass"
            required
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="input-glass"
            rows="2"
          ></textarea>
          <input
            type="tel"
            placeholder="WhatsApp (ej: 56912345678) *"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="input-glass"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={cargando}
            className="w-full crab-gradient text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            {cargando ? 'Publicando...' : 'Publicar 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}