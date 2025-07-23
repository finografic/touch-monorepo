# Touch Client - Guía de Inicio Rápido

## Configuración Inicial (Una sola vez)

1. **Instalar Docker Desktop**
   - Descargar desde: <https://www.docker.com/products/docker-desktop/>
   - O buscar "Docker Desktop" en Microsoft Store
   - Seguir el asistente de instalación
   - Reiniciar la computadora cuando se solicite

## Uso Diario

1. **Insertar unidad USB**
2. **Clic derecho** en `setup-windows.ps1` → **"Ejecutar con PowerShell"**
   - **O** hacer doble clic en `setup-windows.bat`
   - **O** abrir PowerShell y escribir: `.\setup-windows.ps1`
3. **Esperar** a que la aplicación inicie
4. **Abrir el navegador** e ir a: <http://localhost:3000>

## Solución de Problemas

- **Si aparece un error sobre Docker no ejecutándose**: Iniciar Docker Desktop desde el menú Inicio
- **Si aparece un error sobre Docker no instalado**: Seguir los pasos de "Configuración Inicial" arriba
- **Si el script no funciona**: Probar el archivo `.bat` en lugar del `.ps1`
- **Si PowerShell muestra un error de seguridad**: Escribir `.\setup-windows.ps1` (con el punto y la barra invertida)
- **Si PowerShell dice "la ejecución de scripts está deshabilitada"**:
  - **Más fácil**: Hacer doble clic en `setup-windows.bat` en su lugar
  - **Alternativa**:
  1. Presionar **Tecla Windows + X** → Seleccionar **"Windows PowerShell (Admin)"**
  2. Escribir: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
  3. Escribir **"Y"** cuando se solicite

## Detener la Aplicación

- Presionar `Ctrl+C` en la ventana de terminal
- O cerrar la ventana de terminal

## ¿Necesitas Ayuda?

- Revisar la carpeta `docs/` para instrucciones detalladas
- Contactar al administrador del sistema

---
*Touch Client - Aplicación Portátil*
