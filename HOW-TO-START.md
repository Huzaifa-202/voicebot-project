# How to Start Your Azure Voice Agent

## Development Mode (Recommended for Testing)

### Option 1: Using PowerShell Script

1. **Open PowerShell** in the project root folder
2. **Run this command:**
   ```powershell
   .\scripts\start-dev.ps1
   ```

3. **You'll see:**
   - Two new PowerShell windows will open (Backend & Frontend)
   - URLs will be displayed:
     - **Backend**: http://localhost:8765
     - **Frontend**: http://127.0.0.1:5173

4. **Open your browser and go to:** http://127.0.0.1:5173

### Option 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd app\backend
python app.py
```

**Terminal 2 - Frontend:**
```powershell
cd app\frontend
npm run dev
```

## Production Mode

To build and run in production mode:

```powershell
.\scripts\start.ps1
```

## Testing Language Selection

1. Open http://127.0.0.1:5173 in your browser
2. Click a language button (Urdu, English, or Auto)
3. Click "CONNECT TO AZURE REALTIME"
4. Click the microphone button and speak
5. The AI will respond in your selected language!

## Stopping the Servers

- **Development Mode**: Close the PowerShell windows
- **Production Mode**: Press `Ctrl + C` in the terminal

## URLs Quick Reference

- **Frontend (Dev)**: http://127.0.0.1:5173
- **Backend**: http://localhost:8765
- **Frontend (Production)**: http://localhost:8765

## Troubleshooting

**Port already in use?**
- Close all PowerShell/terminal windows running the servers
- Or restart your computer

**Dependencies missing?**
```powershell
# Install backend dependencies
cd app\backend
pip install -r requirements.txt

# Install frontend dependencies
cd app\frontend
npm install
```
