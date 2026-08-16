import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, MapPin, Phone, User, FileText, Send, Sparkles, CheckCircle2, AlertCircle, Info, Shield, Layers } from 'lucide-react';
import { BARRIOS_POPULARES } from '../lib/caliBarrios';
import { uploadImagenLesion, createSolicitud } from '../lib/supabase';
import confetti from 'canvas-confetti';

export function PatientForm({ onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    nombre_paciente: '',
    telefono: '',
    barrio: '',
    descripcion: '',
    zona_cuerpo: 'Muñeca / Mano'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage('La imagen es demasiado grande. Selecciona una foto menor a 15MB.');
        return;
      }
      setErrorMessage('');
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.nombre_paciente.trim()) {
      setErrorMessage('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!formData.telefono.trim() || formData.telefono.length < 7) {
      setErrorMessage('Ingresa un número de teléfono / WhatsApp válido.');
      return;
    }
    if (!formData.barrio.trim()) {
      setErrorMessage('Por favor selecciona tu barrio o comuna en Cali.');
      return;
    }
    if (!formData.descripcion.trim()) {
      setErrorMessage('Cuéntanos brevemente sobre tu lesión o afectación.');
      return;
    }
    if (!selectedFile) {
      setErrorMessage('Es obligatorio adjuntar una fotografía clara de la extremidad o lesión.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload photo to bucket
      const { url: uploadedUrl, error: uploadErr } = await uploadImagenLesion(selectedFile);

      if (uploadErr) {
        console.warn('Upload warning:', uploadErr);
      }

      // 2. Save Request
      const payload = {
        nombre_paciente: formData.nombre_paciente.trim(),
        telefono: formData.telefono.trim(),
        barrio: formData.barrio.trim(),
        descripcion: `[Zona: ${formData.zona_cuerpo}] ${formData.descripcion.trim()}`,
        imagen_url: uploadedUrl,
      };

      const { data, error, folioId } = await createSolicitud(payload);

      if (error) throw new Error(error);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (c) {}

      // Reset form
      setFormData({
        nombre_paciente: '',
        telefono: '',
        barrio: '',
        descripcion: '',
        zona_cuerpo: 'Muñeca / Mano'
      });
      setSelectedFile(null);
      setImagePreview(null);

      // Notify parent modal
      onSubmitSuccess({
        folioId,
        nombre: payload.nombre_paciente,
        telefono: payload.telefono,
        barrio: payload.barrio
      });

    } catch (err) {
      setErrorMessage(`Ocurrió un error al procesar tu solicitud: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-4">
      
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 border border-teal-500/20 p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center space-x-3 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Iniciativa Social Cali 3D
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Sin Costo • Impresión 3D
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Solicitud de Órtesis & Férula Anatómicamente Personalizada
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
          La <strong className="text-teal-300 font-semibold">Red Comunitaria de Ingeniería Biomédica en Cali</strong> pone a disposición su laboratorio especializado para diseñar e imprimir en 3D órtesis personalizadas para pacientes con lesiones musculares o esqueléticas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Diseño Ergonómico a Medida</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Materiales Biomédicos PETG/PLA</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Supervisión de Especialistas</span>
          </div>
        </div>
      </div>

      {/* Main Request Form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800">
        
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-teal-400" />
            1. Datos del Paciente
          </h2>
          <p className="text-xs text-slate-400">Ingresa tus datos personales para contactarte en Cali.</p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 text-sm flex items-start space-x-3 animate-shake">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Atención</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Nombre Completo */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Nombre Completo *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.nombre_paciente}
                onChange={(e) => setFormData({ ...formData, nombre_paciente: e.target.value })}
                placeholder="Ej. María Fernanda Osorio"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
          </div>

          {/* Teléfono WhatsApp */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Teléfono de Contacto (WhatsApp) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm font-medium">
                +57
              </div>
              <input
                type="tel"
                required
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value.replace(/\D/g, '') })}
                placeholder="315 123 4567"
                maxLength={10}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
          </div>

        </div>

        {/* Barrio / Comuna en Cali */}
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Barrio o Comuna en Cali *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-teal-400 pointer-events-none" />
            <input
              type="text"
              required
              value={formData.barrio}
              onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
              placeholder="Escribe tu barrio o comuna (Ej. San Fernando, Siloé, El Ingenio)..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
            />
          </div>

          {/* Quick Barrio Chips */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400 self-center mr-1">Frecuentes:</span>
            {BARRIOS_POPULARES.slice(0, 6).map((barrioName) => (
              <button
                key={barrioName}
                type="button"
                onClick={() => setFormData({ ...formData, barrio: barrioName })}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  formData.barrio === barrioName
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 font-semibold'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                {barrioName}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Detalle de la Lesión */}
        <div className="border-b border-slate-800 pb-4 pt-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            2. Detalle de la Lesión
          </h2>
          <p className="text-xs text-slate-400">Selecciona la zona afectada y describe tu diagnóstico.</p>
        </div>

        {/* Selector Zona del Cuerpo */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Zona del Cuerpo / Extremidad *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              'Muñeca / Mano',
              'Dedo (Mano)',
              'Antebrazo / Codo',
              'Tobillo / Pie'
            ].map((zona) => (
              <button
                key={zona}
                type="button"
                onClick={() => setFormData({ ...formData, zona_cuerpo: zona })}
                className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  formData.zona_cuerpo === zona
                    ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500 shadow-md shadow-teal-500/10'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {zona}
              </button>
            ))}
          </div>
        </div>

        {/* Descripción de la Afectación */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Descripción de la Afectación / Lesión *
          </label>
          <textarea
            required
            rows={4}
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            placeholder="Describe qué sientes (dolor, inmovilización requerida, inflamación, recomendación del médico u ortopedista, etc.)."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
          />
        </div>

        {/* Section 3: Fotografía de la Lesión */}
        <div className="border-b border-slate-800 pb-4 pt-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-400" />
            3. Fotografía de la Lesión
          </h2>
          <p className="text-xs text-slate-400">Sube una foto clara de la zona afectada para que nuestros ingenieros biomédicos evalúen la geometría 3D.</p>
        </div>

        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
          className="hidden"
        />
        <input
          type="file"
          ref={galleryInputRef}
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {!imagePreview ? (
          <div className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-2xl p-6 text-center bg-slate-900/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-3">
              <Camera className="w-6 h-6" />
            </div>
            
            <h3 className="text-sm font-semibold text-white mb-1">
              Adjuntar Foto de la Extremidad
            </h3>
            <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
              Toma una foto con buena iluminación enfocando la articulación o extremidad afectada.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-transform active:scale-95"
              >
                <Camera className="w-4 h-4" />
                <span>Usar Cámara Móvil</span>
              </button>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <ImageIcon className="w-4 h-4 text-teal-400" />
                <span>Elegir de Galería</span>
              </button>
            </div>

            <div className="mt-4 text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Formatos soportados: JPG, PNG, WEBP (Máx. 15MB)</span>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-teal-500/40 bg-slate-900 p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative group">
                <img
                  src={imagePreview}
                  alt="Vista previa lesión"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  Imagen cargada correctamente
                </span>
                <p className="text-xs text-slate-300 font-mono truncate">
                  {selectedFile ? selectedFile.name : 'Imagen seleccionada'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Nuestros biomédicos inspeccionarán las dimensiones y anatomía de la lesión a través de esta captura.
                </p>
                
                <div className="flex items-center gap-2 pt-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="text-xs text-teal-400 hover:underline font-medium flex items-center gap-1"
                  >
                    <Camera className="w-3.5 h-3.5" /> Cambiar foto
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="text-xs text-red-400 hover:underline font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            Los datos e imágenes suministradas son confidenciales y gestionados exclusivamente por el equipo de Ingeniería Biomédica para fines clínicos y de manufactura médica.
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-base shadow-xl shadow-teal-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>Procesando Solicitud e Imagen...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Enviar Solicitud a Ingeniería Biomédica</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
