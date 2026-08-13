# BioÓrtesis UAO Cali — Red de Órtesis & Férulas 3D

Plataforma Web Responsiva (**Mobile-First**) desarrollada en **React + Vite + Tailwind CSS + Lucide Icons** y conectada a **Supabase** como backend para la **Universidad Autónoma de Occidente (UAO - Programa de Ingeniería Biomédica)** en Santiago de Cali, Colombia.

Permite a los pacientes en Cali solicitar órtesis/férulas anatómicamente personalizadas adjuntando una fotografía de su lesión (soporte para cámara móvil y galería) y a la red de ingenieros biomédicos administradores gestionar, evaluar, asignar férulas e imprimir en 3D cada caso.

---

## 🚀 Características Principales

### 1. Vista Pública (Portal del Paciente)
- **Formulario de Solicitud Mobile-First**: Nombre completo, teléfono WhatsApp (+57), selector inteligente con Barrios y Comunas de Cali, y descripción detallada de la lesión.
- **Captura de Fotografía con Cámara Móvil**: Input nativo para cámara y galería (`accept="image/*" capture="environment"`) con vista previa en tiempo real.
- **Folio de Seguimiento Único (Ej. `CALI-8F3A29`)**: Al enviar la solicitud se genera un código de folio con celebración interactiva (`canvas-confetti`) y botón de confirmación directa por **WhatsApp**.
- **Buscador de Estado del Paciente**: Los pacientes pueden consultar públicamente el avance de su órtesis en el laboratorio UAO introduciendo su Folio.

### 2. Autenticación de Ingenieros y Administradores
- **Login Seguro con Supabase Auth** (`email` / `password`).
- **Modo Demo Integrado**: Si la app aún no está conectada a Supabase, permite un botón de **Acceso Rápido Demo** con credenciales de prueba (`ingeniero@uao.edu.co` / `admin@uao.edu.co`).

### 3. Panel de Administración / Dashboard Biomédico
- **Indicadores Clave (Stats)**: Total de casos, pendientes por evaluar, en impresión 3D y entregados.
- **Filtros Avanzados**: Por estado (`Pendiente`, `En Evaluación`, `En Impresión 3D`, `Entregado`), por barrio de Cali y búsqueda de texto en tiempo real.
- **Detalle Clínico del Caso (Modal)**: Visualizador HD de la imagen de la lesión con zoom modal, selector de estado, selector de tipo de férula (`Cock-Up`, `Spica de Pulgar`, `AFO Tobillo-Pie`, etc.), notas técnicas de impresión 3D y enlace directo a WhatsApp del paciente.
- **Ficha Técnica Imprimible (PDF/Print)**: Generación de la orden de manufactura 3D para el laboratorio biomédico.
- **Exportación de Datos a CSV/Excel**.

---

## 🛠️ Arquitectura Técnica

- **Frontend**: React 19, Vite, Tailwind CSS 4, Lucide React, Canvas Confetti.
- **Backend / Base de Datos**: Supabase Database (`solicitudes` table) + Supabase Storage Bucket (`lesiones-fotos`).
- **Despliegue**: Preparado para Netlify con archivo `netlify.toml` configurado para redirecciones SPA.

---

## ⚙️ Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

*(Nota: Si no se configuran estas variables, la aplicación funcionará automáticamente en **Modo Demo Local** con sincronización en `localStorage` y datos iniciales de Cali).*

---

## 🗄️ Script SQL para Configurar Supabase

Ejecuta las siguientes sentencias en el **SQL Editor** de tu consola de Supabase:

```sql
-- 1. Crear tabla de solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nombre_paciente TEXT NOT NULL,
  telefono TEXT NOT NULL,
  barrio TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  imagen_url TEXT,
  estado TEXT DEFAULT 'Pendiente',
  tipo_ferula TEXT DEFAULT 'Por evaluar por Biomédico',
  notas TEXT,
  ingeniero_asignado TEXT
);

-- 2. Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso RLS:
CREATE POLICY "Permitir inserción pública" ON solicitudes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir lectura pública" ON solicitudes
  FOR SELECT USING (true);

CREATE POLICY "Permitir actualización" ON solicitudes
  FOR UPDATE USING (true);

-- 3. Crear Bucket de Almacenamiento de Imágenes de Lesiones
INSERT INTO storage.buckets (id, name, public) 
VALUES ('lesiones-fotos', 'lesiones-fotos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Acceso público de lectura a fotos" ON storage.objects
  FOR SELECT USING (bucket_id = 'lesiones-fotos');

CREATE POLICY "Permitir subida pública de imágenes de lesiones" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'lesiones-fotos');
```

---

## 📦 Despliegue en Netlify

1. Sube este repositorio a **GitHub** o tu proveedor Git.
2. En la consola de Netlify, crea un nuevo sitio apuntando a tu repositorio.
3. En **Build Settings**:
   - **Build Command**: `npm run build`
   - **Publish directory**: `dist`
4. En **Environment Variables** en Netlify, agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. ¡Listo! El archivo `netlify.toml` gestionará automáticamente el enrutamiento de React Router.

---

## 💻 Desarrollo Local

```bash
# Entrar al directorio
cd ortesis-3d-cali

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Probar la compilación de producción
npm run build
```
