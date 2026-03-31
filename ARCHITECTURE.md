# Arquitectura de Mi Control de Peso

## Estructura del Proyecto

```
/app
  /layout.tsx          # Layout raíz con PWA setup y Toaster
  /page.tsx            # Página principal con tabs y componentes
  /globals.css         # Estilos globales y tema de colores

/components
  /body-avatar.tsx     # Avatar dinámico de composición corporal
  /entry-form.tsx      # Formulario para agregar mediciones
  /dashboard.tsx       # Gráficos y estadísticas
  /history.tsx         # Tabla de historial de mediciones
  /goals-settings.tsx  # Objetivos y configuración de recordatorios
  /export-data.tsx     # Exportación de datos a CSV

/lib
  /types.ts            # Tipos TypeScript
  /storage.ts          # Funciones de localStorage
  /composition.ts      # Lógica de composición corporal

/hooks
  /use-weight-data.ts  # Hook personalizado para datos

/public
  /manifest.json       # Manifest de PWA
  /sw.js              # Service Worker
```

## Flujo de Datos

```
App (page.tsx)
├── Carga datos de localStorage
├── Muestra tabs:
│   ├── Dashboard
│   │   ├── Avatar dinámico (body-avatar)
│   │   └── Gráficos (dashboard)
│   ├── Agregar Medición (entry-form)
│   ├── Historial (history)
│   ├── Objetivos (goals-settings)
│   └── Exportar (export-data)
└── Al interactuar, actualiza localStorage
```

## Componentes Principales

### 1. **EntryForm**
- Captura datos de peso y composición
- Valida campos
- Guarda en localStorage con timestamp automático
- Muestra confirmación con toast

### 2. **Dashboard**
- Renderiza gráficos de tendencias
- Muestra estadísticas (promedio, máximo, mínimo)
- Calcula cambios de peso (7d, 30d)
- Usa Recharts para visualización

### 3. **BodyAvatar**
- Componente visual que cambia según composición
- 6 estados: obese, overweight, normal, fit, athletic, muscular
- Colores dinámicos según estado
- Tamaños: sm, md, lg

### 4. **History**
- Tabla de todas las mediciones
- Botones para editar/eliminar
- Ordenadas por fecha (más reciente primero)
- Dialog de confirmación antes de eliminar

### 5. **GoalsSettings**
- Interfaz para establecer objetivo de peso
- Calcula progreso automáticamente
- Configuración de recordatorios
- Visualiza meta con progress bar

### 6. **ExportData**
- Descarga datos en CSV
- Copia al portapapeles
- Información sobre disponibilidad de datos

## Sistema de Almacenamiento

### localStorage Structure
```javascript
{
  entries: [
    {
      id: "1234567890",
      date: "2024-01-15",
      time: "08:30",
      weight: 99.6,
      bmi: 28.1,
      bodyFat: 26.8,
      muscle: 34.4,
      rm: 1992,
      visceral: 11,
      notes: "Comí saludable"
    }
    // ... más entradas
  ],
  goal: {
    targetWeight: 85,
    targetDate: "2024-06-01",
    createdAt: "2024-01-01T10:00:00Z"
  },
  reminder: {
    enabled: true,
    time: "08:00",
    frequency: "daily"
  },
  lastUpdated: "2024-01-15T14:30:00Z"
}
```

## Tipos de Composición

La lógica en `composition.ts` determina el tipo corporal basado en:
- BMI
- % de grasa corporal
- % de músculo

Salidas:
- Label: Texto descriptivo
- Color: Color para visualización
- Emoji: Representación visual
- Transform: Escala del avatar

## PWA Features

### Manifest (public/manifest.json)
- Nombre y descripción de app
- Iconos para diferentes tamaños
- Configuración de display (standalone)
- Tema de colores

### Service Worker (public/sw.js)
- Cache de archivos estáticos
- Funcionamiento offline
- Sincronización entre pestañas
- Actualización de cache

### Layout PWA
```tsx
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
  }
</script>
```

## Flujo de Agregar Medición

1. Usuario completa formulario
2. `onSubmit` valida datos
3. Llama `addWeightEntry()` de storage.ts
4. Storage crea ID único (timestamp)
5. Inserta al inicio del array (más reciente primero)
6. Guarda en localStorage
7. Toast de éxito
8. `onSuccess` callback recarga datos

## Flujo de Gráficos

1. Dashboard recibe array de entries
2. Procesa datos con `useMemo`:
   - Reverse para orden cronológico
   - Slice para últimos 30 días
   - Estructura para Recharts
3. LineChart para peso
4. BarChart para composición
5. Cards para métricas

## Flujo de Objetivo

1. Usuario establece peso objetivo y fecha
2. `setGoal()` guarda en localStorage
3. Dashboard calcula progreso:
   - Diferencia de peso
   - % completado
   - Mostrar en progress bar
4. Al eliminar: `deleteGoal()` remueve del storage

## Tipos TypeScript

### WeightEntry
```typescript
{
  id: string;
  date: string;
  time: string;
  weight: number;
  bmi: number;
  bodyFat: number;
  muscle: number;
  rm: number;
  visceral: number;
  notes?: string;
}
```

### CompositionType
Union type: 'obese' | 'overweight' | 'normal' | 'fit' | 'athletic' | 'muscular'

## Hooks

### useWeightData()
Hook personalizado que:
- Carga datos de localStorage
- Sincroniza entre tabs
- Proporciona función `reload()`
- Maneja estado de carga

## Estilos y Tema

El tema utiliza tokens de diseño OKLCH:
- Primary: Azul-cyan para acciones principales
- Secondary: Verde para cosas positivas
- Accent: Verde-lima para acentos
- Muted: Grises para textos secundarios

Los colores adaptan automáticamente en modo oscuro.

## Instalación PWA por Navegador

- **Chrome Android**: Menu → Instalar
- **Safari iOS**: Compartir → Agregar a Pantalla
- **Chrome Desktop**: Menu → Instalar
- **Edge**: Menu → Instalar

## Consideraciones de Mantenimiento

- Datos locales: Limpiar localStorage elimina todo
- Backups: Siempre exportar CSV regularmente
- Updates: Manifest versioning importante
- Storage: localStorage tiene límite (~5-10MB)

---

Estructura diseñada para máxima privacidad y facilidad de uso
