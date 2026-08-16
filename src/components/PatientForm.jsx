import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, MapPin, Phone, User, FileText, Send, Sparkles, CheckCircle2, AlertCircle, Info, Shield } from 'lucide-react';
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
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) { setErrorMessage('La imagen es demasiado grande. Selecciona una foto menor a 15MB.'); return; }
    setErrorMessage('');
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
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
    if (!formData.nombre_paciente.trim()) { setErrorMessage('Por favor ingresa tu nombre completo.'); return; }
    if (!formData.telefono.trim() || formData.telefono.length < 7) { setErrorMessage('Ingresa un número de teléfono / WhatsApp válido.'); return; }
    if (!formData.barrio.trim()) { setErrorMessage('Por favor escribe tu barrio o comuna en Cali.'); return; }
    if (!formData.descripcion.trim()) { setErrorMessage('Cuéntanos brevemente sobre tu lesión o afectación.'); return; }
    if (!selectedFile) { setErrorMessage('Es obligatorio adjuntar una fotografía clara de la extremidad o lesión.'); return; }

    setIsSubmitting(true);
    try {
      const { url: uploadedUrl, error: uploadErr } = await uploadImagenLesion(selectedFile);
      if (uploadErr) console.warn('Upload warning:', uploadErr);

      const payload = {
        nombre_paciente: formData.nombre_paciente.trim(),
        telefono: formData.telefono.trim(),
        barrio: formData.barrio.trim(),
        descripcion: `[Zona: ${formData.zona_cuerpo}] ${formData.descripcion.trim()}`,
        imagen_url: uploadedUrl,
      };

      const { data, error, folioId } = await createSolicitud(payload);
      if (error) throw new Error(error);

      // Notificación Web3Forms
      try {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: "94eadaf0-278b-4a9f-ad83-2bb8ddd6f764",
            subject: `Nueva Solicitud de Órtesis 3D: ${payload.nombre_paciente}`,
            from_name: "BioÓrtesis Cali",
            message: `¡Hola Ingeniera! Tienes una nueva solicitud en la plataforma.\n\nFolio: ${folioId}\nPaciente: ${payload.nombre_paciente}\nTeléfono: ${payload.telefono}\nBarrio: ${payload.barrio}\nDescripción: ${payload.descripcion}\n\nIngresa al panel de administración para ver la foto de la lesión y procesar el caso.`
          })
        });
      } catch (err) { console.warn('Error enviando notificación', err); }

      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (_) {}

      setFormData({ nombre_paciente: '', telefono: '', barrio: '', descripcion: '', zona_cuerpo: 'Muñeca / Mano' });
      setSelectedFile(null);
      setImagePreview(null);
      onSubmitSuccess({ folioId, nombre: payload.nombre_paciente, telefono: payload.telefono, barrio: payload.barrio });

    } catch (err) {
      setErrorMessage(`Ocurrió un error al procesar tu solicitud: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-4">

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-8 shadow-lg"
        style={{background: 'var(--bg-hero)', border: '1px solid var(--border-primary)'}}>
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{backgroundColor: 'var(--accent-bg)'}} />

        <div className="flex items-center space-x-3 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
            style={{backgroundColor: 'var(--accent-bg)', color: 'var(--tag-sky-text)', border: '1px solid var(--border-primary)'}}>
            <Sparkles className="w-3.5 h-3.5" style={{color: 'var(--accent)'}} />
            Iniciativa Social Cali 3D
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{backgroundColor: 'var(--bg-tag-green)', color: 'var(--tag-green-text)', border: '1px solid var(--border-tag-green)'}}>
            Sin Costo • Impresión 3D
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{color: 'var(--text-heading)'}}>
          Solicitud de Órtesis &amp; Férula Anatómicamente Personalizada
        </h1>
        <p className="text-sm sm:text-base leading-relaxed mb-4" style={{color: 'var(--text-body)'}}>
          La <strong style={{color: 'var(--accent-dark)', fontWeight: 600}}>Red Comunitaria de Ingeniería Biomédica en Cali</strong> pone a disposición su laboratorio especializado para diseñar e imprimir en 3D órtesis personalizadas para pacientes con lesiones musculares o esqueléticas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2" style={{borderTop: '1px solid var(--border-primary)'}}>
          {['Diseño Ergonómico a Medida', 'Materiales Biomédicos PETG/PLA', 'Supervisión de Especialistas'].map(t => (
            <div key={t} className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{color: '#22c55e'}} />
              <span className="text-xs" style={{color: 'var(--text-body)'}}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl p-6 sm:p-8 space-y-6"
        style={{backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-secondary)', boxShadow: 'var(--card-shadow)'}}>

        {/* Section 1 */}
        <div className="pb-4" style={{borderBottom: '1px solid var(--border-divider)'}}>
          <h2 className="text-lg font-bold flex items-center gap-2" style={{color: 'var(--text-heading)'}}>
            <User className="w-5 h-5" style={{color: 'var(--accent)'}} />
            1. Datos del Paciente
          </h2>
          <p className="text-xs" style={{color: 'var(--text-muted)'}}>Ingresa tus datos personales para contactarte en Cali.</p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl text-sm flex items-start space-x-3"
            style={{backgroundColor: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error-text)'}}>
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" style={{color: 'var(--error-icon)'}} />
            <div>
              <p className="font-semibold">Atención</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="t-label">Nombre Completo *</label>
            <input type="text" required value={formData.nombre_paciente}
              onChange={e => setFormData({...formData, nombre_paciente: e.target.value})}
              placeholder="Ej. María Fernanda Osorio"
              className="t-input" />
          </div>

          <div>
            <label className="t-label">Teléfono de Contacto (WhatsApp) *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-medium pointer-events-none"
                style={{color: 'var(--text-placeholder)'}}>+57</span>
              <input type="tel" required value={formData.telefono}
                onChange={e => setFormData({...formData, telefono: e.target.value.replace(/\D/g, '')})}
                placeholder="315 123 4567" maxLength={10}
                className="t-input pl-12" />
            </div>
          </div>
        </div>

        {/* Barrio */}
        <div>
          <label className="t-label">Barrio o Comuna en Cali *</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 pointer-events-none" style={{color: 'var(--accent)'}} />
            <input type="text" required value={formData.barrio}
              onChange={e => setFormData({...formData, barrio: e.target.value})}
              placeholder="Escribe tu barrio o comuna (Ej. San Fernando, Siloé, El Ingenio)..."
              className="t-input pl-10" />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] self-center mr-1" style={{color: 'var(--text-muted)'}}>Frecuentes:</span>
            {BARRIOS_POPULARES.slice(0, 6).map(b => (
              <button key={b} type="button"
                onClick={() => setFormData({...formData, barrio: b})}
                className="text-[11px] px-2.5 py-1 rounded-full border transition-all font-medium"
                style={formData.barrio === b
                  ? {backgroundColor: 'var(--chip-active-bg)', color: 'var(--chip-active-text)', borderColor: 'var(--chip-active-border)'}
                  : {backgroundColor: 'var(--chip-bg)', color: 'var(--chip-text)', borderColor: 'var(--chip-border)'}
                }
              >{b}</button>
            ))}
          </div>
        </div>

        {/* Section 2 */}
        <div className="pb-4 pt-2" style={{borderBottom: '1px solid var(--border-divider)'}}>
          <h2 className="text-lg font-bold flex items-center gap-2" style={{color: 'var(--text-heading)'}}>
            <FileText className="w-5 h-5" style={{color: 'var(--accent)'}} />
            2. Detalle de la Lesión
          </h2>
          <p className="text-xs" style={{color: 'var(--text-muted)'}}>Selecciona la zona afectada y describe tu diagnóstico.</p>
        </div>

        {/* Zona del cuerpo */}
        <div>
          <label className="t-label">Zona del Cuerpo / Extremidad *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Muñeca / Mano', 'Dedo (Mano)', 'Antebrazo / Codo', 'Tobillo / Pie'].map(zona => (
              <button key={zona} type="button"
                onClick={() => setFormData({...formData, zona_cuerpo: zona})}
                className="p-3 rounded-xl border text-xs font-semibold text-center transition-all"
                style={formData.zona_cuerpo === zona
                  ? {background: 'var(--zone-active-bg)', color: 'var(--zone-active-text)', borderColor: 'var(--zone-active-border)', boxShadow: '0 2px 8px var(--accent-bg)'}
                  : {backgroundColor: 'var(--zone-bg)', color: 'var(--zone-text)', borderColor: 'var(--zone-border)'}
                }
              >{zona}</button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="t-label">Descripción de la Afectación / Lesión *</label>
          <textarea required rows={4} value={formData.descripcion}
            onChange={e => setFormData({...formData, descripcion: e.target.value})}
            placeholder="Describe qué sientes (dolor, inmovilización requerida, inflamación, recomendación del médico u ortopedista, etc.)."
            className="t-input resize-none" style={{height: 'auto'}}
          />
        </div>

        {/* Section 3 */}
        <div className="pb-4 pt-2" style={{borderBottom: '1px solid var(--border-divider)'}}>
          <h2 className="text-lg font-bold flex items-center gap-2" style={{color: 'var(--text-heading)'}}>
            <Camera className="w-5 h-5" style={{color: 'var(--accent)'}} />
            3. Fotografía de la Lesión
          </h2>
          <p className="text-xs" style={{color: 'var(--text-muted)'}}>Sube una foto clara de la zona afectada para que nuestros ingenieros biomédicos evalúen la geometría 3D.</p>
        </div>

        <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
        <input type="file" ref={galleryInputRef} accept="image/*" onChange={handleImageChange} className="hidden" />

        {!imagePreview ? (
          <div className="border-2 border-dashed rounded-2xl p-6 text-center transition-colors"
            style={{borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-photo-zone)'}}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{backgroundColor: 'var(--accent-bg)', color: 'var(--accent)'}}>
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold mb-1" style={{color: 'var(--text-heading)'}}>Adjuntar Foto de la Extremidad</h3>
            <p className="text-xs mb-4 max-w-sm mx-auto" style={{color: 'var(--text-muted)'}}>
              Toma una foto con buena iluminación enfocando la articulación o extremidad afectada.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button type="button" onClick={() => cameraInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 t-btn-primary">
                <Camera className="w-4 h-4" />
                <span>Usar Cámara Móvil</span>
              </button>
              <button type="button" onClick={() => galleryInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 t-btn-secondary"
                style={{borderRadius: '0.75rem'}}>
                <ImageIcon className="w-4 h-4" style={{color: 'var(--accent)'}} />
                <span>Elegir de Galería</span>
              </button>
            </div>
            <div className="mt-4 text-[11px] flex items-center justify-center gap-1" style={{color: 'var(--text-placeholder)'}}>
              <Info className="w-3.5 h-3.5" />
              <span>Formatos soportados: JPG, PNG, WEBP (Máx. 15MB)</span>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden p-4"
            style={{backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)'}}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden"
                style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)'}}>
                <img src={imagePreview} alt="Vista previa lesión" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{backgroundColor: 'rgba(34,197,94,0.12)', color: 'var(--tag-green-text)', border: '1px solid var(--border-tag-green)'}}>
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" style={{color:'#22c55e'}} />
                  Imagen cargada correctamente
                </span>
                <p className="text-xs font-mono truncate" style={{color: 'var(--text-body)'}}>
                  {selectedFile ? selectedFile.name : 'Imagen seleccionada'}
                </p>
                <p className="text-[11px]" style={{color: 'var(--text-muted)'}}>
                  Nuestros biomédicos inspeccionarán las dimensiones y anatomía de la lesión.
                </p>
                <div className="flex items-center gap-2 pt-2 justify-center sm:justify-start">
                  <button type="button" onClick={() => cameraInputRef.current?.click()}
                    className="text-xs font-medium flex items-center gap-1 hover:underline"
                    style={{color: 'var(--accent)'}}>
                    <Camera className="w-3.5 h-3.5" /> Cambiar foto
                  </button>
                  <span style={{color: 'var(--text-muted)'}}>•</span>
                  <button type="button" onClick={handleClearImage}
                    className="text-xs font-medium hover:underline" style={{color: '#ef4444'}}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy */}
        <div className="p-3.5 rounded-xl text-[11px] flex items-center gap-2.5"
          style={{backgroundColor: 'var(--privacy-bg)', border: '1px solid var(--privacy-border)', color: 'var(--privacy-text)'}}>
          <Shield className="w-4 h-4 shrink-0" style={{color: 'var(--accent)'}} />
          <span>Los datos e imágenes suministradas son confidenciales y gestionados exclusivamente por el equipo de Ingeniería Biomédica para fines clínicos y de manufactura médica.</span>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl font-extrabold text-base shadow-xl transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 t-btn-primary">
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                style={{borderColor: 'var(--btn-primary-text)', borderTopColor: 'transparent'}} />
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
