import React, { useState, useEffect } from 'react';
import { 
  Users, Clock, Cpu, CheckCircle2, Search, Filter, RefreshCw, 
  Download, Eye, Phone, MapPin, ExternalLink, Calendar, MessageSquare, 
  ChevronRight, AlertCircle, Sparkles, SlidersHorizontal 
} from 'lucide-react';
import { fetchSolicitudes, updateSolicitudStatus } from '../lib/supabase';
import { CaseDetailModal } from './CaseDetailModal';

export function AdminDashboard({ authUser }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [dataSource, setDataSource] = useState('');

  const loadData = async () => {
    setLoading(true);
    const { data, source } = await fetchSolicitudes();
    setSolicitudes(data || []);
    setDataSource(source);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter Logic
  const filteredSolicitudes = solicitudes.filter(item => {
    // Status tab filter
    if (activeTab !== 'Todas' && item.estado !== activeTab) {
      return false;
    }
    // Barrio filter
    if (selectedBarrio !== 'Todos' && !item.barrio.toLowerCase().includes(selectedBarrio.toLowerCase())) {
      return false;
    }
    // Text search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.nombre_paciente?.toLowerCase().includes(q);
      const matchFolio = item.id?.toLowerCase().includes(q);
      const matchTel = item.telefono?.includes(q);
      const matchBarrio = item.barrio?.toLowerCase().includes(q);
      return matchName || matchFolio || matchTel || matchBarrio;
    }
    return true;
  });

  // Calculate Stat Counts
  const totalCount = solicitudes.length;
  const pendientesCount = solicitudes.filter(s => s.estado === 'Pendiente').length;
  const evaluacionCount = solicitudes.filter(s => s.estado === 'En Evaluación').length;
  const impresionCount = solicitudes.filter(s => s.estado === 'En Impresión 3D').length;
  const entregadosCount = solicitudes.filter(s => s.estado === 'Entregado').length;

  // Extract unique barrios for filter
  const uniqueBarrios = Array.from(new Set(solicitudes.map(s => s.barrio))).filter(Boolean);

  // CSV Export
  const exportToCSV = () => {
    if (solicitudes.length === 0) return;
    
    const headers = ['Folio', 'Fecha', 'Paciente', 'Telefono', 'Barrio', 'Estado', 'Tipo Ferula', 'Notas'];
    const rows = solicitudes.map(s => [
      `"${s.id}"`,
      `"${new Date(s.created_at).toLocaleDateString('es-CO')}"`,
      `"${s.nombre_paciente.replace(/"/g, '""')}"`,
      `"${s.telefono}"`,
      `"${s.barrio.replace(/"/g, '""')}"`,
      `"${s.estado}"`,
      `"${(s.tipo_ferula || '').replace(/"/g, '""')}"`,
      `"${(s.notas || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `solicitudes_ortesis_uao_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickStatusChange = async (item, newStatus) => {
    await updateSolicitudStatus(item.id, { estado: newStatus });
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Panel de Administración UAO
            </span>
            <span className="text-xs text-slate-400">
              Biomédica • Cali
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Gestión de Solicitudes de Órtesis 3D
          </h1>
          <p className="text-xs text-slate-300">
            Conectado como: <strong className="text-teal-300">{authUser?.user_metadata?.full_name || authUser?.email || 'Ingeniero Biomédico'}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Recargar solicitudes"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold text-xs border border-slate-700 flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Card */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Casos</span>
            <Users className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-mono">
            {totalCount}
          </div>
          <span className="text-[10px] text-slate-400">Solicitudes registradas en Cali</span>
        </div>

        {/* Pendientes Card */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Pendientes</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-2 font-mono">
            {pendientesCount}
          </div>
          <span className="text-[10px] text-amber-400/80">Requieren evaluación inicial</span>
        </div>

        {/* Impresión 3D Card */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">En Impresión 3D</span>
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 mt-2 font-mono">
            {impresionCount}
          </div>
          <span className="text-[10px] text-cyan-400/80">En proceso de laboratorio UAO</span>
        </div>

        {/* Entregados Card */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Entregados</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 mt-2 font-mono">
            {entregadosCount}
          </div>
          <span className="text-[10px] text-emerald-400/80">Casos finalizados con éxito</span>
        </div>

      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'Todas', label: 'Todas', count: totalCount },
              { id: 'Pendiente', label: 'Pendientes', count: pendientesCount },
              { id: 'En Evaluación', label: 'En Evaluación', count: evaluacionCount },
              { id: 'En Impresión 3D', label: 'Impresión 3D', count: impresionCount },
              { id: 'Entregado', label: 'Entregadas', count: entregadosCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                  activeTab === tab.id
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeTab === tab.id ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Barrio Selector */}
          <div className="flex flex-col sm:flex-row gap-2">
            
            {/* Barrio Filter */}
            <div className="relative">
              <select
                value={selectedBarrio}
                onChange={(e) => setSelectedBarrio(e.target.value)}
                className="w-full sm:w-44 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Todos">Todos los barrios</option>
                {uniqueBarrios.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Text Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por paciente, folio o barrio..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

          </div>

        </div>

      </div>

      {/* REQUESTS LIST / TABLE */}
      {loading ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Cargando registros desde la base de datos...</p>
        </div>
      ) : filteredSolicitudes.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No se encontraron solicitudes</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No hay registros que coincidan con los filtros seleccionados. Intenta cambiar los criterios de búsqueda.
          </p>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Folio / Fecha</th>
                  <th className="py-3.5 px-4">Paciente & Contacto</th>
                  <th className="py-3.5 px-4">Barrio (Cali)</th>
                  <th className="py-3.5 px-4">Foto Lesión</th>
                  <th className="py-3.5 px-4">Estado Actual</th>
                  <th className="py-3.5 px-4">Férula Prescrita</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredSolicitudes.map((item) => {
                  const whatsappUrl = `https://wa.me/57${item.telefono.replace(/\D/g, '')}`;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      {/* Folio & Date */}
                      <td className="py-4 px-4 font-mono">
                        <span className="font-bold text-teal-300 text-sm block">
                          {item.id}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString('es-CO')}
                        </span>
                      </td>

                      {/* Paciente */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-white text-sm block">
                          {item.nombre_paciente}
                        </span>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 hover:underline font-medium mt-0.5"
                        >
                          <Phone className="w-3 h-3" />
                          <span>+57 {item.telefono}</span>
                        </a>
                      </td>

                      {/* Barrio */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center space-x-1 text-slate-300 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
                          <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                          <span>{item.barrio}</span>
                        </span>
                      </td>

                      {/* Photo Thumbnail */}
                      <td className="py-4 px-4">
                        <div
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDetailOpen(true);
                          }}
                          className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 cursor-pointer relative group"
                        >
                          <img
                            src={item.imagen_url}
                            alt="Lesión"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                      </td>

                      {/* Estado */}
                      <td className="py-4 px-4">
                        <select
                          value={item.estado}
                          onChange={(e) => handleQuickStatusChange(item, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-900 focus:outline-none cursor-pointer ${
                            item.estado === 'Entregado' ? 'border-emerald-500/50 text-emerald-300' :
                            item.estado === 'En Impresión 3D' ? 'border-cyan-500/50 text-cyan-300' :
                            item.estado === 'En Evaluación' ? 'border-amber-500/50 text-amber-300' :
                            'border-slate-600 text-slate-300'
                          }`}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En Evaluación">En Evaluación</option>
                          <option value="En Impresión 3D">En Impresión 3D</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                      </td>

                      {/* Tipo Férula */}
                      <td className="py-4 px-4 max-w-xs truncate text-slate-300">
                        {item.tipo_ferula || 'Por determinar'}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsDetailOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center space-x-1 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detalle</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedItem && (
        <CaseDetailModal
          item={selectedItem}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onRecordUpdated={() => {
            loadData();
          }}
        />
      )}

    </div>
  );
}
