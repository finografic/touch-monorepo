# Guía de Instalación de Touch Client para Windows

### Requisitos Previos

1. **Windows 10/11**
   - Procesador de 64 bits con SLAT (Second Level Address Translation)
   - Mínimo 4GB de RAM
   - Soporte de virtualización habilitado en la BIOS

2. **Docker Desktop para Windows**
   Para Windows 10/11 más reciente:
   - Descargar última versión de: <https://docs.docker.com/desktop/install/windows-install/>

   Para Windows 10 antiguo (anterior a build 19041):
   - Descargar Docker Desktop 4.15.0: [Docker Desktop 4.15.0](https://desktop.docker.com/win/main/amd64/82459/Docker%20Desktop%20Installer.exe)
   - Windows 10 64-bit: Pro, Enterprise o Education (Build 16299 o posterior)
   - Características Hyper-V y Containers de Windows deben estar habilitadas

   Para verificar tu versión de Windows:
   1. Presiona tecla Windows + R
   2. Escribe 'winver' y presiona Enter
   3. Busca el número de build en la información de Versión

3. **Características de Windows Requeridas**
   Para habilitar las características requeridas:
   1. Abre Panel de Control > Programas > Activar o desactivar las características de Windows
   2. Marca estas opciones:
      - Hyper-V
      - Subsistema de Windows para Linux
      - Plataforma de Máquina Virtual
   3. Reinicia tu computadora

### Pasos de Instalación

1. **Instalar Docker Desktop**
   - Ejecutar el instalador de Docker Desktop
   - Seguir el asistente de instalación
   - Asegurarse de que la instalación de WSL 2 esté seleccionada
   - Reiniciar la computadora al finalizar

2. **Verificar la Instalación**
   - Abrir PowerShell o Símbolo del Sistema
   - Ejecutar `docker --version` para verificar Docker
   - Ejecutar `docker-compose --version` para verificar Docker Compose

### Ejecutar Touch Client desde USB

1. **Preparar Unidad USB**
   - Insertar la unidad USB con los archivos de Touch Client
   - Anotar la letra asignada (ej., E:, F:, etc.)
   - Asegurarse de tener al menos 1GB de espacio libre para la base de datos e imágenes Docker

2. **Cargar Imagen Docker**
   - Abrir PowerShell o Símbolo del Sistema
   - Navegar a la unidad USB:

     ```powershell
     cd /d X:  # Reemplazar X con la letra de tu unidad USB
     ```

   - Cargar la imagen Docker:

     ```powershell
     docker load -i touch-client.tar
     ```

3. **Iniciar la Aplicación**
   - Navegar al directorio de la aplicación:

     ```powershell
     cd touch-monorepo
     ```

   - Iniciar los contenedores:

     ```powershell
     docker-compose up
     ```

4. **Acceder a la Aplicación**
   - Abrir el navegador web
   - Navegar a: `http://localhost:3000`
   - La aplicación debería estar funcionando
   - Los datos se almacenarán en una base de datos SQLite y persistirán entre sesiones

### Gestión de Datos

1. **Ubicación de la Base de Datos**
   - La base de datos SQLite se almacena en el directorio `data`
   - Los datos persisten entre reinicios de la aplicación
   - Hacer copias de seguridad del directorio `data` regularmente si es necesario

2. **Cambio a Otra Computadora**
   - El archivo de base de datos se mueve con la unidad USB
   - No se necesita configuración adicional - solo conectar y usar

### Solución de Problemas

1. **Problemas con Docker Desktop**
   - Verificar que Hyper-V y WSL 2 estén correctamente habilitados
   - Comprobar en el Administrador de Tareas que Docker Desktop esté ejecutándose
   - Reiniciar Docker Desktop si es necesario

2. **Conflictos de Puertos**
   - Si el puerto 3000 está en uso, modificar el archivo `docker-compose.yml`
   - Cambiar el mapeo de puertos a uno disponible (ej., 3001:3000)

3. **Problemas de Rendimiento**
   - Asegurarse de que la unidad USB sea USB 3.0 o superior
   - Considerar copiar los archivos al disco local para un rendimiento óptimo

### Apagado

1. Presionar `Ctrl+C` en la terminal donde se ejecuta docker-compose
2. Esperar a que los contenedores se detengan
3. Ejecutar `docker-compose down` para eliminar los contenedores
4. Expulsar la unidad USB de forma segura
