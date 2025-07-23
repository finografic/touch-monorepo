# Guía de Instalación Rápida de Touch Client para Windows (V2)

## Requisitos Previos

1. **Windows 10/11 (64 bits, x86/amd64)**
   - Mínimo 4GB de RAM
   - Virtualización habilitada en la BIOS

2. **Docker Desktop para Windows**
   - Descargar desde: <https://www.docker.com/products/docker-desktop/>
   - Instalar y reiniciar la computadora si se solicita

## Estructura Recomendada de la USB

```
TOUCH_CLIENT/
├── USB_README_ES.md
├── touch-client.tar
├── docker-compose.yml
├── setup-windows.bat
├── data/
│   └── production.sqlite.db
├── docs/
│   └── DOCKER_WIN10_SETUP_ES.md
```

## Pasos para Ejecutar Touch Client

1. **Insertar la unidad USB**
2. **Hacer doble clic** en `setup-windows.bat`
   - Si hay problemas de permisos, clic derecho → "Ejecutar como administrador"
3. **Esperar** a que la aplicación inicie
4. **Abrir el navegador** y acceder a: <http://localhost:3000>

## Solución de Problemas

- **Docker no ejecutándose**: Iniciar Docker Desktop desde el menú Inicio
- **Docker no instalado**: Instalar Docker Desktop siguiendo los pasos previos
- **El script no funciona**: Verifica que todos los archivos estén en la misma carpeta
- **Problemas de permisos**: Ejecuta el script como administrador
- **Problemas de arquitectura**: Esta versión solo funciona en computadoras Windows x86/amd64

## Gestión de Datos

- La base de datos SQLite se encuentra en la carpeta `data`
- Los datos persisten entre reinicios y pueden moverse junto con la USB

## Apagado

- Presiona `Ctrl+C` en la terminal para detener la aplicación
- Cierra la ventana de terminal
- Expulsa la USB de forma segura

## ¿Necesitas Ayuda?

- Consulta la carpeta `docs/` para instrucciones detalladas
- Contacta al administrador del sistema si tienes dudas

---
*Touch Client - Aplicación Portátil (Versión x86/amd64)*
