import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://tu-proyecto.supabase.co' &&
  !supabaseUrl.includes('YOUR_SUPABASE')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Storage Bucket Name
export const BUCKET_NAME = 'lesiones-fotos';

// --- MOCK INITIAL DATA FOR DEMO & LOCAL TESTING ---
const INITIAL_MOCK_SOLICITUDES = [
  {
    id: 'CALI-8F3A29',
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    nombre_paciente: 'Carlos Eduardo Ramírez',
    telefono: '3157894321',
    barrio: 'San Fernando',
    descripcion: 'Fractura en el hueso radio (antebrazo derecho) en proceso de consolidación. El ortopedista del HUV solicitó férula rígida para rehabilitación.',
    imagen_url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    estado: 'En Impresión 3D',
    tipo_ferula: 'Órtesis de Antebrazo Rígida (PETG)',
    notas: 'Escaneo 3D realizado en laboratorio de biomédica. Relleno al 40% para alta durabilidad.',
    ingeniero_asignado: 'Dra. María Alejandra (Ingeniería Biomédica)'
  },
  {
    id: 'CALI-9X42B7',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    nombre_paciente: 'Valeria Mosquera Trujillo',
    telefono: '3004561234',
    barrio: 'Siloé',
    descripcion: 'Esguince grado II en muñeca izquierda practicando baloncesto. Requiere inmovilización ligera transpirable.',
    imagen_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    estado: 'Pendiente',
    tipo_ferula: 'Por determinar',
    notas: 'Esperando confirmación telefónica para evaluación fotogramétrica.',
    ingeniero_asignado: 'Por asignar'
  },
  {
    id: 'CALI-3K91Z4',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    nombre_paciente: 'Jhoan Sebastián Caicedo',
    telefono: '3189012345',
    barrio: 'El Ingenio',
    descripcion: 'Tenosinovitis de De Quervain en pulgar derecho por esfuerzo repetitivo en manufactura.',
    imagen_url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80',
    estado: 'En Evaluación',
    tipo_ferula: 'Férula Spica para Pulgar',
    notas: 'Fisioterapeuta revisó imágenes. Se generará modelo 3D articulado.',
    ingeniero_asignado: 'Ing. Felipe Ospina'
  },
  {
    id: 'CALI-1M77D2',
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
    nombre_paciente: 'Esperanza Gómez de Quintero',
    telefono: '3113456789',
    barrio: 'Terrón Colorado',
    descripcion: 'Artritis severa en articulaciones interfalángicas. Necesita férula nocturna de alineación.',
    imagen_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    estado: 'Entregado',
    tipo_ferula: 'Férula Reposo Nocturna en PLA Bio',
    notas: 'Entregada en jornada comunitaria el 10 de Agosto. Adaptación 100% exitosa.',
    ingeniero_asignado: 'Dra. María Alejandra (Ingeniería Biomédica)'
  }
];

// Helper to get local storage requests
const getLocalSolicitudes = () => {
  const data = localStorage.getItem('bioortesis_solicitudes_3d');
  if (!data) {
    localStorage.setItem('bioortesis_solicitudes_3d', JSON.stringify(INITIAL_MOCK_SOLICITUDES));
    return INITIAL_MOCK_SOLICITUDES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_MOCK_SOLICITUDES;
  }
};

const saveLocalSolicitudes = (items) => {
  localStorage.setItem('bioortesis_solicitudes_3d', JSON.stringify(items));
};

// Generate unique Folio Code (e.g., CALI-A7B2X)
export const generateFolioId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'CALI-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// --- DATA ACCESS API ---

// 1. Fetch All Solicitudes
export const fetchSolicitudes = async () => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data || [], error: null, source: 'supabase' };
    } catch (err) {
      console.warn('Error fetching from Supabase, falling back to local store:', err.message);
      return { data: getLocalSolicitudes(), error: err.message, source: 'local' };
    }
  }

  return { data: getLocalSolicitudes(), error: null, source: 'local' };
};

// 2. Fetch Single Request by Folio ID
export const fetchSolicitudByFolio = async (folioId) => {
  const cleanFolio = folioId.trim().toUpperCase();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .eq('id', cleanFolio)
        .single();

      if (!error && data) return { data, error: null };
    } catch (e) {
      // Fall back to local check
    }
  }

  const items = getLocalSolicitudes();
  const found = items.find(i => i.id.toUpperCase() === cleanFolio);
  if (found) return { data: found, error: null };
  return { data: null, error: 'Solicitud no encontrada' };
};

// 3. Create New Patient Request
export const createSolicitud = async (payload) => {
  const folioId = generateFolioId();
  const newRecord = {
    id: folioId,
    created_at: new Date().toISOString(),
    nombre_paciente: payload.nombre_paciente,
    telefono: payload.telefono,
    barrio: payload.barrio,
    descripcion: payload.descripcion,
    imagen_url: payload.imagen_url || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    estado: 'Pendiente',
    tipo_ferula: payload.tipo_ferula || 'Por evaluar por Biomédico',
    notas: payload.notas || 'Solicitud recibida desde portal público.',
    ingeniero_asignado: 'Por asignar'
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .insert([newRecord])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null, folioId };
    } catch (err) {
      console.warn('Error inserting into Supabase, saving to local fallback:', err.message);
    }
  }

  // Fallback to local storage
  const current = getLocalSolicitudes();
  const updated = [newRecord, ...current];
  saveLocalSolicitudes(updated);
  return { data: newRecord, error: null, folioId };
};

// 4. Update Request Status / Details (Admin / Ingeniero)
export const updateSolicitudStatus = async (id, updates) => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      console.warn('Error updating Supabase record, fallback local:', err.message);
    }
  }

  // Fallback update
  const items = getLocalSolicitudes();
  const index = items.findIndex(i => i.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    saveLocalSolicitudes(items);
    return { data: items[index], error: null };
  }
  return { data: null, error: 'Registro no encontrado' };
};

// 5. Upload Image to Supabase Storage Bucket or return Data URL fallback
export const uploadImagenLesion = async (file) => {
  if (!file) return { url: null, error: 'No File selected' };

  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `lesiones/${fileName}`;

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      return { url: publicUrlData.publicUrl, error: null };
    } catch (err) {
      console.warn('Storage upload error, using Data URL fallback:', err.message);
    }
  }

  // Fallback Data URL generator
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result, error: null });
    };
    reader.onerror = () => {
      resolve({ url: null, error: 'Error al leer el archivo' });
    };
    reader.readAsDataURL(file);
  });
};

// 6. AUTHENTICATION HELPERS
export const loginSupabaseAuth = async (email, password) => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) {
      return { user: data.user, session: data.session, error: null };
    }
    return { user: null, session: null, error: error.message };
  }

  // Demo Auth Fallback
  if (password === 'uao123' || password === 'admin' || email.includes('@uao.edu.co')) {
    const mockUser = {
      id: 'usr_biomed_01',
      email: email || 'ingeniero@uao.edu.co',
      user_metadata: {
        full_name: email.includes('admin') ? 'Administrador UAO' : 'Ingeniero Biomédico UAO',
        role: email.includes('admin') ? 'admin' : 'ingeniero'
      }
    };
    localStorage.setItem('uao_auth_user', JSON.stringify(mockUser));
    return { user: mockUser, session: { token: 'mock_token' }, error: null };
  }

  return { user: null, session: null, error: 'Credenciales inválidas. En modo de demostración use la contraseña "uao123" o active Supabase Auth.' };
};

export const getStoredAuthUser = () => {
  const stored = localStorage.getItem('uao_auth_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const logoutSupabaseAuth = async () => {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem('uao_auth_user');
};
