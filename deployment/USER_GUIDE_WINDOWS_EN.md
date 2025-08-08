# Touch Monorepo - User Guide

## 🎯 Welcome!

This guide will help you set up and run the Touch Monorepo application on your computer. No technical knowledge required!

## 📋 What You Need

- **Windows 10/11**: Any recent Windows computer
- **Linux (Ubuntu/Debian)**: Any Linux computer
- **macOS**: Any Mac computer (Intel or Apple Silicon)
- **Internet connection**: For initial setup (one-time only)

## 🚀 Quick Start Guide

### Step 1: Extract the Files

1. **Find the downloaded file**: Look for a file ending in `.zip` (e.g., `touch-monorepo-windows-x64-2024-01-15.zip`)
2. **Right-click the file** and select "Extract All" or "Extract Here"
3. **Choose a location** (like your Desktop or Documents folder)
4. **Click "Extract"**

### Step 2: Run the Setup

#### For Windows Users

1. **Open the extracted folder** (double-click the folder)
2. **Find the file called `setup.bat`** (it has a gear icon)
3. **Double-click `setup.bat`**
4. **Wait for the setup to complete** (this may take a few minutes)
5. **Click "OK" when it says "Setup completed successfully!"**

**If you see an error about Node.js:**
- Go to https://nodejs.org/
- Click the big green "LTS" button to download
- Run the installer and follow the instructions
- Then try running `setup.bat` again





### Step 3: Start the Application

#### For Windows Users

1. **In the same folder**, find `start-server.bat`
2. **Double-click `start-server.bat`** (this starts the backend)
3. **Wait for it to say "Server is running"**
4. **In the same folder**, find `start-client.bat`
5. **Double-click `start-client.bat`** (this starts the frontend)
6. **Your web browser should open automatically** to the application

**Alternative**: Double-click `start-both.bat` to start both at once





## 🌐 Using the Application

1. **Open your web browser** (Chrome, Firefox, Safari, Edge)
2. **Go to**: http://localhost:3000
3. **The application should load** and be ready to use!

## 🔧 Troubleshooting

### Common Issues

**"Node.js is not installed"**
- Follow the installation instructions above
- Make sure to restart your computer after installing Node.js

**"Port is already in use"**
- Close any other applications that might be using ports 3000 or 4040
- Restart your computer and try again

**"Permission denied" (Linux/macOS)**
- Make sure you ran the setup script first
- Try running: `chmod +x *.sh`

**"Application won't start"**
- Make sure you ran the setup script first
- Check that you're in the correct folder
- Try restarting your computer

### Getting Help

If you're still having trouble:

1. **Check the README.md file** in this folder for technical details
2. **Look for error messages** in the terminal/command prompt
3. **Make sure your computer meets the requirements** listed above
4. **Try running the setup script again**

## 📞 Support

For technical support, please provide:
- Your operating system (Windows/Linux/macOS)
- Any error messages you see
- Steps you've already tried

## 🎉 You're Ready!

Once the application is running, you can:
- Access it at http://localhost:3000
- Use all the features of the Touch Monorepo application
- Close the terminal/command prompt windows when you're done

**Note**: Keep the terminal/command prompt windows open while using the application. Close them when you're finished.

---

*Generated on: August 9, 2025 at 12:07 AM*
