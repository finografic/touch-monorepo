# Sistema de Gestión de Sonidos

Este documento explica el sistema de gestión de sonidos para eventos de temporizador en la aplicación Touch.

## Resumen

El sistema de sonidos soporta dos tipos de sonidos de temporizador:
- **Sonidos de Alarma**: Reproducidos durante intervalos del temporizador (cada 2 minutos por defecto)
- **Sonidos de Finalización**: Reproducidos cuando un temporizador se completa

## Estructura de Archivos

```plaintext
data/uploads/sounds/
├── _settings.json          # Archivo de configuración de sonidos
├── alarm/                  # Directorio de archivos de sonido de alarma
│   └── sound--alarm-*.mp3
└── finish/                 # Directorio de archivos de sonido de finalización
    └── sound--finish-*.mp3
```

## Configuración

El archivo `_settings.json` contiene los sonidos actualmente seleccionados:

```json
{
  "alarm": "sound--alarm-1760094208933-nm5t",
  "finish": "sound--finish-1760094183733-dkak"
}
```

- `alarm`: ID del archivo de sonido de alarma seleccionado (o `null` si no hay ninguno seleccionado)
- `finish`: ID del archivo de sonido de finalización seleccionado (o `null` si no hay ninguno seleccionado)

## Endpoints de API

### Archivos de Sonido

- `GET /api/sounds/alarm` - Listar archivos de sonido de alarma
- `GET /api/sounds/finish` - Listar archivos de sonido de finalización
- `GET /api/sounds/files/{filename}` - Servir archivo de sonido

### Configuración de Sonidos

- `GET /api/sounds/settings` - Obtener configuración actual de sonidos
- `PUT /api/sounds/settings` - Actualizar configuración de sonidos

### Gestión de Archivos

- `POST /api/sounds/alarm/upload` - Subir archivos de sonido de alarma
- `POST /api/sounds/finish/upload` - Subir archivos de sonido de finalización
- `DELETE /api/sounds/alarm/{id}` - Eliminar archivo de sonido de alarma
- `DELETE /api/sounds/finish/{id}` - Eliminar archivo de sonido de finalización

## Formatos Soportados

- **MP3**: Formato recomendado para compatibilidad web
- **WAV**: Soportado, convertido automáticamente a MP3
- **AIFF**: Soportado, convertido automáticamente a MP3

Los archivos se convierten automáticamente a MP3 para una compatibilidad web óptima y tamaños de archivo más pequeños.

## Política de Reproducción Automática del Navegador

Los navegadores modernos bloquean la reproducción de audio a menos que sea activada por un gesto directo del usuario (clic, toque, pulsación de tecla). Esto afecta los sonidos de temporizador que se reproducen automáticamente.

### Soluciones

1. **Permisos Específicos del Sitio** (Recomendado)
   - En Chrome: Clic en icono de candado → Configuración del sitio → Sonido: Permitir
   - Esto permite sonidos programáticos sin gestos del usuario
   - La configuración persiste después de recargar la página

2. **Preparación con Gesto del Usuario**
   - El usuario hace clic en un botón para "preparar" el sistema de audio
   - Los sonidos programáticos posteriores funcionan por tiempo limitado
   - No es 100% confiable, puede reiniciarse después de inactividad

3. **Wrappers Electron/Nativos**
   - Puede desactivar las restricciones de reproducción automática mediante flags de línea de comandos
   - Ejemplo: `--autoplay-policy=no-user-gesture-required`

## Uso en Código

### Integración con Temporizador

```typescript
import { playTickSound, playCompleteSound } from 'utils/sound.utils';

// Reproducir sonido de alarma durante intervalos del temporizador
// El volumen se aplica automáticamente desde la configuración global
await playTickSound();

// Reproducir sonido de finalización cuando el temporizador se completa
// El volumen se aplica automáticamente desde la configuración global
await playCompleteSound();
```

### Configuración de Sonidos

```typescript
import { makeUserSound } from 'utils/sound.utils';
import { playSoundByPath } from 'utils/soundCache.utils';

// Reproducir sonidos por tipo (volumen aplicado automáticamente)
makeUserSound('alarm');
makeUserSound('complete');

// Reproducir sonido por ruta de archivo (volumen aplicado automáticamente)
await playSoundByPath('sound--alarm-1234567890-xyz.mp3');
```

### Gestión de Volumen

```typescript
import { useGlobalVolume } from 'hooks/useGlobalVolume';
import { updatePlayingAudioVolume } from 'utils/soundCache.utils';

// En un componente React
const { volume, updateVolume, audioVolume } = useGlobalVolume();

// Actualizar volumen (0-100)
updateVolume(75); // Establece el deslizador en 75%, audio real en 15%

// Obtener volumen actual para elementos de audio (0-0.2)
const currentAudioVolume = audioVolume; // ej., 0.12 para deslizador al 60%

// Actualizar volumen del audio actualmente en reproducción
updatePlayingAudioVolume(50); // Cambia el audio en reproducción a 50% deslizador (10% real)
```

## Sistema de Control de Volumen

El sistema incluye un control de volumen global que afecta toda la reproducción de sonidos.

### Configuración de Volumen

- **Volumen Predeterminado**: 60% (en el deslizador)
- **Rango de Volumen**: 0-100% (deslizador visible al usuario)
- **Rango de Audio Real**: 0-20% (reducido para comodidad)
- **Escalado de Volumen**: Valor del deslizador × 0.2 = volumen de audio real

Ejemplo:
- 60% deslizador (predeterminado) = 12% volumen de audio real
- 100% deslizador (máximo) = 20% volumen de audio real
- 50% deslizador = 10% volumen de audio real

### Ajuste de Volumen en Tiempo Real

- Los cambios de volumen se aplican **inmediatamente** al audio que se está reproduciendo
- No es necesario reiniciar la reproducción para escuchar los cambios de volumen
- La configuración de volumen persiste en el almacenamiento de sesión del navegador

### Botón de Pánico

- El botón **Detener Todo el Audio** detiene inmediatamente todos los sonidos en reproducción
- Útil para detener sonidos de alarma durante las pruebas
- Ubicado junto al deslizador de volumen en la interfaz de administración

## Interfaz de Administración

### Página de Administración Completa (`/admin/sounds`)

- Interfaz con pestañas para gestionar sonidos de alarma y finalización
- Subir, configurar y gestionar archivos de sonido
- Probar reproducción de sonidos con control de volumen en tiempo real
- Ver biblioteca de sonidos
- Deslizador de volumen con botón de pánico

### Página de Administración Básica (`/admin/sounds-basic` - versión pública)

- Interfaz simplificada que muestra solo la selección de sonido de alarma
- Control deslizante de volumen global
- Botón de pánico para detener todo el audio
- Sin capacidades de subida o gestión de archivos
- Enfocada en la configuración esencial de sonidos

## Convención de Nombres de Archivos

Los archivos de sonido siguen este patrón de nombres:

```plaintext
sound--{type}-{timestamp}-{randomId}.mp3
```

Ejemplos:
- `sound--alarm-1760094208933-nm5t.mp3`
- `sound--finish-1760094183733-dkak.mp3`

El sistema extrae automáticamente nombres de visualización de los nombres de archivo para una selección amigable al usuario.

## Resolución de Problemas

### Problemas Comunes

1. **Los sonidos no se reproducen**
   - Verificar política de reproducción automática del navegador
   - Verificar permisos de sonido del sitio
   - Revisar consola para errores

2. **Los archivos no aparecen**
   - Asegurar que los archivos estén en el subdirectorio correcto (`alarm/` o `finish/`)
   - Verificar convención de nombres de archivos
   - Verificar escaneo de archivos del servidor

3. **Fallos de subida**
   - Verificar formato de archivo (MP3, WAV, AIFF)
   - Verificar límites de tamaño de archivo (máximo 10MB)
   - Verificar espacio en disco del servidor

### Información de Depuración

El sistema proporciona registro detallado:
- Escaneo y descubrimiento de archivos
- Intentos de reproducción de sonidos
- Gestión de caché
- Manejo de errores

Revisar consola del navegador y logs del servidor para información de resolución de problemas.
