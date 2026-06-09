import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('buildings');
  const [buildings, setBuildings] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', direccion: '' });
  const [memberFormData, setMemberFormData] = useState({
    nombre_completo: '',
    numero_whatsapp: '',
    edificio_id: '',
    is_admin: false,
  });
  const [qrBuilding, setQrBuilding] = useState(null);

  // Cargar edificios
  const loadBuildings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('edificios')
      .select('*')
      .order('nombre');
    if (!error) setBuildings(data);
    setLoading(false);
  };

  // Cargar miembros (perfiles) con nombre del edificio
  const loadMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('perfiles')
      .select('*, edificios(nombre)')
      .order('created_at', { ascending: false });
    if (!error) setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'buildings') loadBuildings();
    else loadMembers();
  }, [activeTab]);

  // CRUD Edificios
  const handleBuildingSubmit = async (e) => {
    e.preventDefault();
    if (editingBuilding) {
      await supabase
        .from('edificios')
        .update(formData)
        .eq('id', editingBuilding.id);
    } else {
      await supabase.from('edificios').insert([formData]);
    }
    resetBuildingForm();
    loadBuildings();
  };

  const deleteBuilding = async (id) => {
    if (confirm('¿Eliminar edificio? Se perderán las publicaciones asociadas.')) {
      await supabase.from('edificios').delete().eq('id', id);
      loadBuildings();
    }
  };

  const resetBuildingForm = () => {
    setEditingBuilding(null);
    setFormData({ nombre: '', direccion: '' });
  };

  // CRUD Miembros
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    if (editingMember) {
      await supabase
        .from('perfiles')
        .update({
          nombre_completo: memberFormData.nombre_completo,
          numero_whatsapp: memberFormData.numero_whatsapp,
          edificio_id: memberFormData.edificio_id || null,
          is_admin: memberFormData.is_admin,
        })
        .eq('id', editingMember.id);
      resetMemberForm();
      loadMembers();
    } else {
      alert('Para crear un nuevo miembro, primero debe registrarse con Google/email. Solo se puede editar existentes.');
    }
  };

  const deleteMember = async (id) => {
    if (confirm('¿Eliminar miembro? También se eliminarán sus publicaciones.')) {
      await supabase.from('perfiles').delete().eq('id', id);
      loadMembers();
    }
  };

  const resetMemberForm = () => {
    setEditingMember(null);
    setMemberFormData({
      nombre_completo: '',
      numero_whatsapp: '',
      edificio_id: '',
      is_admin: false,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral/5 to-white dark:from-darkBg dark:to-darkBg">
      <Navbar />
      <div className="pt-20 px-4 max-w-4xl mx-auto pb-10">
        <h1 className="text-2xl font-bold text-coral mb-6">🛠️ Panel de Administración</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('buildings')}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === 'buildings'
                ? 'bg-coral text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            🏢 Edificios
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2 rounded-full transition ${
              activeTab === 'members'
                ? 'bg-coral text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            👥 Miembros
          </button>
        </div>

        {/* Panel Edificios */}
        {activeTab === 'buildings' && (
          <div>
            <div className="glass-card p-4 mb-6">
              <h2 className="text-xl font-semibold mb-3">
                {editingBuilding ? '✏️ Editar edificio' : '➕ Nuevo edificio'}
              </h2>
              <form onSubmit={handleBuildingSubmit} className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="input-glass w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="input-glass w-full"
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-coral text-white px-4 py-2 rounded-lg">
                    {editingBuilding ? 'Actualizar' : 'Crear'}
                  </button>
                  {editingBuilding && (
                    <button type="button" onClick={resetBuildingForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="space-y-3">
              {buildings.map((b) => (
                <div key={b.id} className="glass-card p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{b.nombre}</h3>
                    <p className="text-sm text-gray-500">{b.direccion || 'Sin dirección'}</p>
                    <p className="text-xs text-gray-400">ID: {b.id}</p>
                  </div>
<div className="flex gap-2">
  <button onClick={() => setQrBuilding(b)} className="text-purple-500">📱</button>
  <button onClick={() => { setEditingBuilding(b); setFormData({ nombre: b.nombre, direccion: b.direccion || '' }); }} className="text-blue-500">✏️</button>
  <button onClick={() => deleteBuilding(b.id)} className="text-red-500">🗑️</button>
</div>
                </div>
              ))}
              {loading && <p className="text-center">Cargando...</p>}
            </div>
          </div>
        )}

        {/* Panel Miembros */}
        {activeTab === 'members' && (
          <div>
            <div className="glass-card p-4 mb-6">
              <h2 className="text-xl font-semibold mb-3">
                {editingMember ? '✏️ Editar miembro' : '📝 Nota: Los nuevos miembros se registran con Google/Email'}
              </h2>
              {editingMember && (
                <form onSubmit={handleMemberSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    value={memberFormData.nombre_completo}
                    onChange={(e) => setMemberFormData({ ...memberFormData, nombre_completo: e.target.value })}
                    className="input-glass w-full"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="WhatsApp"
                    value={memberFormData.numero_whatsapp}
                    onChange={(e) => setMemberFormData({ ...memberFormData, numero_whatsapp: e.target.value })}
                    className="input-glass w-full"
                  />
                  <select
                    value={memberFormData.edificio_id}
                    onChange={(e) => setMemberFormData({ ...memberFormData, edificio_id: e.target.value })}
                    className="input-glass w-full"
                  >
                    <option value="">Sin edificio</option>
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nombre}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={memberFormData.is_admin}
                      onChange={(e) => setMemberFormData({ ...memberFormData, is_admin: e.target.checked })}
                    />
                    Es administrador
                  </label>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-coral text-white px-4 py-2 rounded-lg">
                      Actualizar
                    </button>
                    <button type="button" onClick={resetMemberForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="space-y-3">
              {members.map((m) => (
                <div key={m.id} className="glass-card p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{m.nombre_completo || 'Sin nombre'}</h3>
                      <p className="text-sm">WhatsApp: {m.numero_whatsapp || 'No registrado'}</p>
                      <p className="text-sm">Edificio: {m.edificios?.nombre || 'Sin asignar'}</p>
                      <p className="text-xs text-gray-400">ID: {m.id}</p>
                      {m.is_admin && (
                        <span className="inline-block bg-coral/20 text-coral text-xs px-2 py-0.5 rounded-full mt-1">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingMember(m);
                          setMemberFormData({
                            nombre_completo: m.nombre_completo || '',
                            numero_whatsapp: m.numero_whatsapp || '',
                            edificio_id: m.edificio_id || '',
                            is_admin: m.is_admin || false,
                          });
                        }}
                        className="text-blue-500"
                      >
                        ✏️
                      </button>
                      <button onClick={() => deleteMember(m.id)} className="text-red-500">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {loading && <p className="text-center">Cargando...</p>}
            </div>
          </div>
        )}
      </div>

      {qrBuilding && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="glass-card p-6 text-center">
      <h3 className="text-xl font-bold mb-4">Código QR para {qrBuilding.nombre}</h3>
      <QRCode value={`${window.location.origin}/edificio/${qrBuilding.id}`} size={200} />
      <p className="text-sm text-gray-500 mt-4">Escanea para acceder al edificio</p>
      <button onClick={() => setQrBuilding(null)} className="mt-4 bg-coral text-white px-4 py-2 rounded-lg">Cerrar</button>
    </div>
  </div>
)}
    </div>
  );
}