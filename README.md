# Mi Control de Peso - PWA

Una aplicación progresiva (PWA) para monitorear tu peso y composición corporal con análisis y visualización de datos.

## Características

✅ **Registro de Mediciones**
- Ingresa peso, BMI, grasa corporal, músculo, RM y visceral
- Fecha y hora automáticas
- Notas opcionales para cada medición

✅ **Dashboard Interactivo**
- Gráficos de evolución del peso (últimos 30 días)
- Análisis de composición corporal
- Estadísticas de tendencias (7 y 30 días)
- Avatar dinámico que refleja tu composición corporal

✅ **Historial Completo**
- Tabla con todas tus mediciones
- Opción de eliminar registros
- Búsqueda y filtrado

✅ **Objetivos y Seguimiento**
- Establece un peso objetivo y fecha meta
- Visualiza tu progreso hacia el objetivo
- Cálculo automático de diferencia

✅ **Recordatorios**
- Configura recordatorios personalizados
- Selecciona frecuencia (diaria, cada 2 días, semanal)
- Elige la hora del recordatorio

✅ **Exportación de Datos**
- Descarga tus datos en formato CSV
- Compatible con Excel, Google Sheets, etc.
- Copia al portapapeles

✅ **PWA (Aplicación Web Progresiva)**
- Instala como aplicación nativa en tu móvil
- Funciona sin conexión
- Sincronización automática entre pestañas

## Instalación como PWA

### En Android (Chrome)
1. Abre la app en Chrome
2. Toca los 3 puntos (⋮) en la esquina superior derecha
3. Selecciona "Instalar aplicación"
4. Confirma la instalación

### En iOS (Safari)
1. Abre la app en Safari
2. Toca el botón Compartir (↑)
3. Selecciona "Agregar a Pantalla de Inicio"
4. Elige un nombre y confirma

### En Escritorio
- **Chrome**: Abre el menú (⋮) > "Instalar..."
- **Edge**: Abre el menú (⋯) > "Instalar esta aplicación"

## Uso

### 1. Agregar Medición
- Ve a la pestaña "Agregar"
- Completa los campos con tus datos
- Los datos se guardan automáticamente

### 2. Ver Dashboard
- Revisa tus gráficos y estadísticas
- Observa tu avatar dinámico
- Monitorea tu composición corporal

### 3. Establecer Objetivo
- Ve a "Objetivos"
- Establece tu peso objetivo y fecha meta
- El sistema calculará tu progreso

### 4. Exportar Datos
- Ve a "Exportar"
- Descarga como CSV o copia al portapapeles
- Analiza tus datos en Excel

## Datos y Privacidad

📱 **Tus datos se guardan localmente en tu dispositivo**
- No se envían a ningún servidor
- Control total sobre tus datos
- Puedes eliminar todo en cualquier momento

## Tipos de Composición Corporal

La app clasifica tu estado corporal automáticamente:

- 🔴 **Obesidad**: BMI > 30
- 🟠 **Sobrepeso**: BMI 25-30
- 🟡 **Normal**: BMI 18.5-25
- 🟢 **En Forma**: BMI 18.5-25 con baja grasa
- 🟢 **Atlético**: Bajo peso o normal con mucho músculo
- 🔵 **Musculoso**: Composición principalmente muscular

## Características Técnicas

- **Framework**: Next.js 16 + React 19
- **Almacenamiento**: localStorage (datos locales)
- **Gráficos**: Recharts
- **UI Components**: shadcn/ui
- **Estilos**: Tailwind CSS
- **Offline**: Service Worker

## Consideraciones

- Los datos se almacenan en el navegador local (localStorage)
- Si limpias el caché del navegador, perderás los datos
- Te recomendamos exportar tus datos regularmente como respaldo
- La app es completamente privada - tus datos nunca salen de tu dispositivo

## Tips de Uso

💡 **Mide con consistencia**
- Mide a la misma hora cada día
- Preferiblemente por la mañana
- Después de ir al baño

💡 **Registra notas**
- Anota cambios en tu dieta
- Registra entrenamientos
- Nota cómo te sientes

💡 **Revisa tendencias**
- Los cambios diarios son normales
- Observa la tendencia semanal
- Sé paciente con el progreso

💡 **Haz respaldo de datos**
- Exporta regularmente
- Guarda los CSV en un lugar seguro

## Soporte

Si tienes problemas:
1. Verifica que tienes espacio en tu almacenamiento
2. Intenta limpiar la caché del navegador
3. Reinstala la PWA
4. Exporta e importa tus datos si es necesario

---

Hecho con ❤️ para tu bienestar personal
