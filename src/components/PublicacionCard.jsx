export default function PublicacionCard({ pub }) {
  const waLink = `https://wa.me/${pub.whatsapp_contacto.replace(/\D/g, '')}?text=Hola%2C%20vi%20tu%20publicación%20"${encodeURIComponent(pub.titulo)}"%20en%20Grab%20Me.`;

  return (
    <div className="glass-card p-4 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl animate-slide-up">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-1">{pub.titulo}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {pub.perfiles?.nombre_completo || 'Vecino'} • {new Date(pub.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className="text-coral font-bold bg-white/30 dark:bg-black/30 px-2 py-1 rounded-full text-sm">
          ${pub.precio}/día
        </span>
      </div>
      {pub.descripcion && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2">{pub.descripcion}</p>
      )}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>📦 {pub.tipo === 'ofrezco' ? 'Ofrece' : 'Busca'}</span>
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-sm flex items-center gap-1 transition shadow-sm"
        >
          <span>💬</span> WhatsApp
        </a>
      </div>
    </div>
  );
}