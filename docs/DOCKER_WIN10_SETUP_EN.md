# Touch Client Setup Guide for Windows

### Prerequisites

1. **Windows 10/11**
   - 64-bit processor with Second Level Address Translation (SLAT)
   - 4GB system RAM minimum
   - BIOS-level hardware virtualization support must be enabled

2. **Docker Desktop for Windows**
   For newer Windows 10/11:
   - Download latest version from: <https://docs.docker.com/desktop/install/windows-install/>

   For older Windows 10 (pre-build 19041):
   - Download Docker Desktop 4.15.0: [Docker Desktop 4.15.0](https://desktop.docker.com/win/main/amd64/82459/Docker%20Desktop%20Installer.exe)
   - Windows 10 64-bit: Pro, Enterprise, or Education (Build 16299 or later)
   - Hyper-V and Containers Windows features must be enabled

   To check your Windows version:
   1. Press Windows key + R
   2. Type 'winver' and press Enter
   3. Look for the build number in the Version info

3. **Required Windows Features**
   To enable required features:
   1. Open Control Panel > Programs > Turn Windows Features on or off
   2. Check these options:
      - Hyper-V
      - Windows Subsystem for Linux
      - Virtual Machine Platform
   3. Restart your computer

### Installation Steps

1. **Install Docker Desktop**
   - Run the Docker Desktop Installer
   - Follow the installation wizard
   - When prompted, ensure WSL 2 installation is selected
   - Restart your computer when installation completes

2. **Verify Installation**
   - Open PowerShell or Command Prompt
   - Run `docker --version` to verify Docker installation
   - Run `docker-compose --version` to verify Docker Compose installation

### Running Touch Client from USB Drive

1. **Prepare USB Drive**
   - Insert the USB drive containing the Touch Client files
   - Note the drive letter assigned (e.g., E:, F:, etc.)
   - Ensure you have at least 1GB of free space for the database and Docker images

2. **Load Docker Image**
   - Open PowerShell or Command Prompt
   - Navigate to the USB drive:

     ```powershell
     cd /d X:  # Replace X with your USB drive letter
     ```

   - Load the Docker image:

     ```powershell
     docker load -i touch-client.tar
     ```

3. **Start the Application**
   - Navigate to the application directory:

     ```powershell
     cd touch-monorepo
     ```

   - Start the containers:

     ```powershell
     docker-compose up
     ```

4. **Access the Application**
   - Open your web browser
   - Navigate to: `http://localhost:3000`
   - The application should now be running
   - Your data will be stored in a SQLite database and persisted between sessions

### Data Management

1. **Database Location**
   - The SQLite database is stored in the `data` directory
   - Data persists between application restarts
   - Back up the `data` directory regularly if needed

2. **Moving to Another Computer**
   - The database file moves with the USB drive
   - No additional setup needed - just plug and play

### Troubleshooting

1. **Docker Desktop Issues**
   - Ensure Hyper-V and WSL 2 are properly enabled
   - Check Task Manager to verify Docker Desktop is running
   - Restart Docker Desktop if needed

2. **Port Conflicts**
   - If port 3000 is in use, modify the `docker-compose.yml` file
   - Change the port mapping to an available port (e.g., 3001:3000)

3. **Performance Issues**
   - Ensure your USB drive is USB 3.0 or higher for better performance
   - Consider copying the files to your local drive for optimal performance

### Shutting Down

1. Press `Ctrl+C` in the terminal where docker-compose is running
2. Wait for containers to stop gracefully
3. Run `docker-compose down` to remove containers
4. Safely eject the USB drive
