export default function Tabs({ tipoActivo, setTipoActivo }) {
  return (
    <div className="flex gap-2 p-1 glass-card rounded-full sticky top-16 z-10">
      <button
        onClick={() => setTipoActivo('ofrezco')}
        className={`flex-1 py-2 rounded-full text-center font-medium transition-all duration-200 ${
          tipoActivo === 'ofrezco'
            ? 'bg-coral text-white shadow-md'
            : 'text-gray-600 dark:text-gray-300 hover:bg-white/20'
        }`}
      >
        🔨 Ofrezco
      </button>
      <button
        onClick={() => setTipoActivo('busco')}
        className={`flex-1 py-2 rounded-full text-center font-medium transition-all duration-200 ${
          tipoActivo === 'busco'
            ? 'bg-coral text-white shadow-md'
            : 'text-gray-600 dark:text-gray-300 hover:bg-white/20'
        }`}
      >
        🔍 Busco
      </button>
    </div>
  );
}