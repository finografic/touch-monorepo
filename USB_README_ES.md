# Touch Client - Guía de Inicio Rápido (V2)

## Requisitos Previos (Solo una vez)

1. **Instalar Docker Desktop (Windows 10, arquitectura x86/amd64)**
   - Descargar desde: <https://www.docker.com/products/docker-desktop/>
   - O buscar "Docker Desktop" en Microsoft Store
   - Seguir el asistente de instalación
   - Reiniciar la computadora si se solicita

## Estructura de la Carpeta USB

```
TOUCH_CLIENT/
├── USB_README_ES.md           # Esta guía rápida
├── touch-client.tar           # Imagen Docker guardada (compatible x86/amd64)
├── docker-compose.yml         # Archivo de configuración Docker Compose
├── setup-windows.bat          # Script de inicio para Windows
├── data/                      # Base de datos SQLite
│   └── production.sqlite.db
├── docs/
│   └── DOCKER_WIN10_SETUP_ES.md
```

## Uso Diario

1. **Insertar la unidad USB**
2. **Hacer doble clic** en `setup-windows.bat`
   - **O** clic derecho → **"Ejecutar como administrador"** si hay problemas de permisos
3. **Esperar** a que la aplicación inicie
4. **Abrir el navegador** y acceder a: <http://localhost:3000>

## Solución de Problemas

- **Error sobre Docker no ejecutándose**: Iniciar Docker Desktop desde el menú Inicio
- **Error sobre Docker no instalado**: Seguir los pasos de "Requisitos Previos" arriba
- **Si el script no funciona**: Verifica que todos los archivos estén en la misma carpeta
- **Problemas de permisos**: Ejecuta el script como administrador
- **Problemas de arquitectura**: Esta versión está preparada para computadoras Windows x86/amd64 (no ARM/M1/M2)

## Detener la Aplicación

- Presionar `Ctrl+C` en la ventana de terminal
- O cerrar la ventana de terminal

## ¿Necesitas Ayuda?

- Revisar la carpeta `docs/` para instrucciones detalladas
- Contactar al administrador del sistema

---
*Touch Client - Aplicación Portátil (Versión x86/amd64)*
