# Touch Monorepo - Guía de Usuario

## 🎯 ¡Bienvenido!

Esta guía te ayudará a configurar y ejecutar la aplicación Touch Monorepo en tu computadora. ¡No se requieren conocimientos técnicos!

## 📋 Lo Que Necesitas

- **Windows 10/11**: Cualquier computadora Windows reciente
- **Linux (Ubuntu/Debian)**: Cualquier computadora Linux
- **macOS**: Cualquier Mac (Intel o Apple Silicon)
- **Conexión a internet**: Para la configuración inicial (solo una vez)

## 🚀 Guía de Inicio Rápido

### Paso 1: Extraer los Archivos

1. **Encuentra el archivo descargado**: Busca un archivo que termine en `.zip` (ej., `touch-monorepo-windows-x64-2024-01-15.zip`)
2. **Haz clic derecho en el archivo** y selecciona "Extraer Todo" o "Extraer Aquí"
3. **Elige una ubicación** (como tu Escritorio o carpeta Documentos)
4. **Haz clic en "Extraer"**

### Paso 2: Ejecutar la Configuración





#### Para Usuarios de macOS

1. **Abre Terminal** (presiona Cmd+Espacio, escribe "Terminal", presiona Enter)
2. **Navega a la carpeta extraída**:
   ```bash
   cd /ruta/a/tu/carpeta/extraída
   ```
3. **Haz ejecutable el script de configuración**:
   ```bash
   chmod +x setup-macos.sh
   ```
4. **Ejecuta la configuración**:
   ```bash
   ./setup-macos.sh
   ```
5. **Espera a que se complete la configuración**

**Si ves un error sobre Node.js:**
- Ve a https://nodejs.org/
- Haz clic en el botón verde grande "LTS" para descargar
- Ejecuta el instalador y sigue las instrucciones
- Luego intenta ejecutar `./setup-macos.sh` nuevamente

### Paso 3: Iniciar la Aplicación





#### Para Usuarios de macOS

1. **En Terminal**, ejecuta el servidor:
   ```bash
   ./start-server-macos.sh
   ```
2. **Abre una nueva ventana de Terminal** y ejecuta el cliente:
   ```bash
   ./start-client-macos.sh
   ```
3. **Tu navegador web debería abrirse automáticamente** a la aplicación

**Alternativa**: Ejecuta `npm start` para iniciar ambos a la vez

## 🌐 Usando la Aplicación

1. **Abre tu navegador web** (Chrome, Firefox, Safari, Edge)
2. **Ve a**: http://localhost:3000
3. **La aplicación debería cargar** y estar lista para usar!

## 🔧 Solución de Problemas

### Problemas Comunes

**"Node.js no está instalado"**
- Sigue las instrucciones de instalación arriba
- Asegúrate de reiniciar tu computadora después de instalar Node.js

**"Puerto ya está en uso"**
- Cierra cualquier otra aplicación que pueda estar usando los puertos 3000 o 4040
- Reinicia tu computadora e intenta nuevamente

**"Permiso denegado" (Linux/macOS)**
- Asegúrate de haber ejecutado el script de configuración primero
- Intenta ejecutar: `chmod +x *.sh`

**"La aplicación no inicia"**
- Asegúrate de haber ejecutado el script de configuración primero
- Verifica que estés en la carpeta correcta
- Intenta reiniciar tu computadora

### Obtener Ayuda

Si aún tienes problemas:

1. **Revisa el archivo README.md** en esta carpeta para detalles técnicos
2. **Busca mensajes de error** en la terminal/línea de comandos
3. **Asegúrate de que tu computadora cumpla con los requisitos** listados arriba
4. **Intenta ejecutar el script de configuración nuevamente**

## 📞 Soporte

Para soporte técnico, por favor proporciona:
- Tu sistema operativo (Windows/Linux/macOS)
- Cualquier mensaje de error que veas
- Pasos que ya has intentado

## 🎉 ¡Estás Listo!

Una vez que la aplicación esté ejecutándose, puedes:
- Acceder a ella en http://localhost:3000
- Usar todas las funciones de la aplicación Touch Monorepo
- Cerrar las ventanas de terminal/línea de comandos cuando hayas terminado

**Nota**: Mantén las ventanas de terminal/línea de comandos abiertas mientras uses la aplicación. Ciérralas cuando hayas terminado.

---

*Generado el: 31 de agosto de 2025, 14:28*
