import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { BuildConfig } from '../build-deployment.types.js';

/**
 * Create user documentation files
 */
export async function createUserDocumentation(config: BuildConfig): Promise<void> {
  console.log('📝 Creating user documentation...');

  // English User Guide - Simplified Universal Version
  const englishGuide = `# Touch Monorepo - User Guide

## 🎯 Welcome!

This guide will help you set up and run the Touch Monorepo application on your computer. **Super simple - just two steps!**

## 📋 What You Need

- **Any Computer**: Windows, Linux, or macOS
- **Internet connection**: For initial setup (one-time only)

## 🚀 Quick Start Guide (2 Steps!)

### Step 1: Extract the Files

1. **Find the downloaded file**: Look for a file ending in \`.zip\`
2. **Right-click the file** and select "Extract All" or "Extract Here"
3. **Choose a location** (like your Desktop or Documents folder)
4. **Open the extracted folder**

### Step 2: Run Setup & Start

**On Windows:**
1. **Open PowerShell or Command Prompt** in the folder
2. **Run setup**: \`bash setup.sh\` (installs Node.js if needed)
3. **Start app**: \`bash start\`

**On Mac/Linux:**
1. **Open Terminal** in the folder
2. **Run setup**: \`./setup.sh\` (installs Node.js if needed)
3. **Start app**: \`./start\`

**That's it!** 🎉

## 🌐 Using the Application

1. **Your web browser should open automatically** to: http://localhost:3000
2. **If it doesn't open**, manually go to: http://localhost:3000
3. **The application is ready to use!**

## 🔧 Troubleshooting

### Common Issues

**"Command not found" or "Permission denied"**
- **Windows**: Make sure you're using PowerShell or Command Prompt, not File Explorer
- **Mac/Linux**: Make sure you're using Terminal

**"Node.js is not installed"**
- The setup script will try to install it automatically
- If it fails, go to https://nodejs.org/ and install manually
- Then run \`./setup.sh\` again

**"Port is already in use"**
- Close any other applications using ports 3000 or 4040
- Restart your computer and try again

**Application won't start**
- Make sure you ran \`./setup.sh\` first
- Check that you're in the correct folder
- Try restarting your computer

### Still Having Trouble?

1. **Make sure you're in the right folder** (the extracted folder)
2. **Try running setup again**: \`./setup.sh\`
3. **Check for error messages** and note them down
4. **Restart your computer** and try again

## 📞 Support

For technical support, please provide:
- Your operating system (Windows/Mac/Linux)
- Any error messages you see
- What step you're stuck on

## 🎉 You're Ready!

Once the application is running:
- **Access it**: http://localhost:3000
- **To stop**: Press Ctrl+C in the terminal
- **To start again**: Run \`./start\`

**Note**: Keep the terminal window open while using the application.

---

*Generated on: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}*
`;

  // Spanish User Guide - Simplified Universal Version
  const spanishGuide = `# Touch Monorepo - Guía de Usuario

## 🎯 ¡Bienvenido!

Esta guía te ayudará a configurar y ejecutar la aplicación Touch Monorepo en tu computadora. **¡Súper simple - solo dos pasos!**

## 📋 Lo Que Necesitas

- **Cualquier Computadora**: Windows, Linux, o macOS
- **Conexión a internet**: Para la configuración inicial (solo una vez)

## 🚀 Guía de Inicio Rápido (¡2 Pasos!)

### Paso 1: Extraer los Archivos

1. **Encuentra el archivo descargado**: Busca un archivo que termine en \`.zip\`
2. **Haz clic derecho en el archivo** y selecciona "Extraer todo" o "Extraer aquí"
3. **Elige una ubicación** (como tu Escritorio o carpeta Documentos)
4. **Abre la carpeta extraída**

### Paso 2: Ejecutar Configuración e Iniciar

**En Windows:**
1. **Abre PowerShell o Símbolo del Sistema** en la carpeta
2. **Ejecuta configuración**: \`bash setup.sh\` (instala Node.js si es necesario)
3. **Inicia la app**: \`bash start\`

**En Mac/Linux:**
1. **Abre Terminal** en la carpeta
2. **Ejecuta configuración**: \`./setup.sh\` (instala Node.js si es necesario)
3. **Inicia la app**: \`./start\`

**¡Eso es todo!** 🎉

## 🌐 Usando la Aplicación

1. **Tu navegador web debería abrirse automáticamente** a: http://localhost:3000
2. **Si no se abre**, ve manualmente a: http://localhost:3000
3. **¡La aplicación está lista para usar!**

## 🔧 Solución de Problemas

### Problemas Comunes

**"Comando no encontrado" o "Permiso denegado"**
- **Windows**: Asegúrate de usar PowerShell o Símbolo del Sistema, no el Explorador de Archivos
- **Mac/Linux**: Asegúrate de usar Terminal

**"Node.js no está instalado"**
- El script de configuración intentará instalarlo automáticamente
- Si falla, ve a https://nodejs.org/ e instala manualmente
- Luego ejecuta \`./setup.sh\` nuevamente

**"El puerto ya está en uso"**
- Cierra cualquier otra aplicación usando los puertos 3000 o 4040
- Reinicia tu computadora e inténtalo de nuevo

**La aplicación no se inicia**
- Asegúrate de haber ejecutado \`./setup.sh\` primero
- Verifica que estés en la carpeta correcta
- Intenta reiniciar tu computadora

### ¿Sigues Teniendo Problemas?

1. **Asegúrate de estar en la carpeta correcta** (la carpeta extraída)
2. **Intenta ejecutar la configuración nuevamente**: \`./setup.sh\`
3. **Revisa los mensajes de error** y anótalos
4. **Reinicia tu computadora** e inténtalo de nuevo

## 📞 Soporte

Para soporte técnico, por favor proporciona:
- Tu sistema operativo (Windows/Mac/Linux)
- Cualquier mensaje de error que veas
- En qué paso estás atascado

## 🎉 ¡Estás Listo!

Una vez que la aplicación esté ejecutándose:
- **Accede a ella**: http://localhost:3000
- **Para detener**: Presiona Ctrl+C en la terminal
- **Para iniciar de nuevo**: Ejecuta \`./start\`

**Nota**: Mantén la ventana de terminal abierta mientras usas la aplicación.

---

*Generado el: ${new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}*
`;

  // Write the documentation files with simple names
  await writeFile(join(config.distDir, 'USER_GUIDE_EN.md'), englishGuide);
  await writeFile(join(config.distDir, 'GUIA_USUARIO_ES.md'), spanishGuide);

  console.log('✅ User documentation created (USER_GUIDE_EN.md, GUIA_USUARIO_ES.md)');
}
