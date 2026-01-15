# NFC Scanner - Real-time Card Reader

A real-time NFC/RFID card scanner with live web interface using ACR122U reader, Node.js, and WebSockets.

## Features

- 🔄 Real-time card scanning with live updates
- 🌐 Web-based interface with WebSocket communication
- 🎨 Terminal-style UI with connection status
- 🔌 Auto-reconnect on connection loss
- 📊 Displays card UID and timestamp for each scan

## Prerequisites

- **Node.js** (v14 or higher)
- **ACR122U NFC Reader** (or compatible PC/SC reader)
- **PC/SC drivers** installed on your system

### Installing PC/SC Drivers

#### Windows
- Download and install the [ACR122U driver](https://www.acs.com.hk/en/driver/3/acr122u-usb-nfc-reader/)

#### macOS
- PC/SC is built-in (no installation needed)

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install pcscd pcsc-tools libpcsclite1 libpcsclite-dev
```

#### Linux (Fedora/RHEL)
```bash
sudo dnf install pcsc-lite pcsc-tools
```

## Installation

1. **Install dependencies**
```bash
npm install
```

2. **Connect your ACR122U reader** to a USB port

3. **Verify the reader is detected**
```bash
# On Linux/macOS
pcsc_scan

# On Windows, check Device Manager
```

## Usage

1. **Start the server**
```bash
npm start
```

You should see:
```
WebSocket server running on ws://localhost:8080
Reader connected: ACS ACR122U PICC Interface
```

2. **Open the web interface**

Simply open `index.html` in your browser, or serve it via:
```bash
# Using Python
python -m http.server 3000

# Using Node.js http-server (npm install -g http-server)
http-server -p 3000
```

Then navigate to `http://localhost:3000`

3. **Scan NFC cards**

Place an NFC/RFID card on the reader. The card UID will appear in the web interface immediately.

## Project Structure

```
.
├── server.js       # Node.js WebSocket server & NFC reader handler
├── index.html      # Web interface
├── package.json    # Node dependencies
└── README.md       # This file
```

## How It Works

1. **Server** (`server.js`) connects to the ACR122U reader using `nfc-pcsc`
2. When a card is detected, the UID is broadcast via WebSocket
3. **Frontend** (`index.html`) connects via WebSocket and displays scans in real-time
4. Each scan shows timestamp and card UID

## Troubleshooting

### Reader not detected

**Check if reader is connected:**
```bash
# Linux/macOS
lsusb | grep ACS

# Windows - Device Manager
# Look for "ACS ACR122U PICC Interface"
```

**Restart PC/SC service (Linux):**
```bash
sudo systemctl restart pcscd
sudo systemctl status pcscd
```

### No scans appearing

1. **Check server logs** - Should show "Reader connected"
2. **Check browser console** - Should show "WebSocket connected"
3. **Verify card compatibility** - ACR122U supports ISO14443A/B cards (Mifare, NTAG, etc.)
4. **Try restarting the server** - Some readers need a fresh connection

### "Reader already registered" warning

This is normal and prevents duplicate reader instances. The reader will still work correctly.

### WebSocket connection fails

- Ensure the server is running on port 8080
- Check if another application is using port 8080
- Check firewall settings

## Supported Cards

The ACR122U supports:
- ✅ Mifare Classic
- ✅ Mifare Ultralight
- ✅ NTAG (213, 215, 216)
- ✅ ISO14443A cards
- ✅ FeliCa cards

## Configuration

### Change WebSocket port

In `server.js`:
```javascript
const wss = new WebSocket.Server({ port: 8080 }); // Change port here
```

In `index.html`:
```javascript
const ws = new WebSocket('ws://localhost:8080'); // Match server port
```

### Customize UI

Edit the `<style>` section in `index.html` to change colors, fonts, and layout.

## Dependencies

- [nfc-pcsc](https://www.npmjs.com/package/nfc-pcsc) - NFC reader interface
- [ws](https://www.npmjs.com/package/ws) - WebSocket server

## License

MIT

## Contributing

Feel free to open issues or submit pull requests for improvements!

## Resources

- [nfc-pcsc documentation](https://github.com/pokusew/nfc-pcsc)
- [ACR122U specifications](https://www.acs.com.hk/en/products/3/acr122u-usb-nfc-reader/)
- [PC/SC documentation](https://pcsclite.apdu.fr/)
