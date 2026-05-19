# Forge VR

A modern, feature-rich Quest VR game manager with a focus on organization, efficiency, and a premium user experience.

<div align="center">
  <img src="./build/icon.png" alt="Forge VR logo" width="120">

  **organize, download, and install quest vr games with style**
</div>

---

## Features

### 📚 Game Library Management
- **Collections & Favorites** — Organize games into custom collections with colors (Horror, Puzzle, Must Play, etc.) and mark favorites with a single click
- **Smart Filtering** — Filter by All, Favorites, Installed, Updates Available, or any custom collection
- **Batch Operations** — Select multiple games with checkboxes, then download, install, or uninstall them all at once
- **Virtual Scrolling** — Smooth performance even with thousands of games

### ⌨️ Keyboard-First Experience
| Shortcut | Action |
|----------|--------|
| `Ctrl+F` | Focus search |
| `Ctrl+D` | Toggle downloads drawer |
| `Ctrl+U` | Toggle uploads drawer |
| `Ctrl+,` | Open settings |
| `Ctrl+1` | Switch to games view |
| `Ctrl+R` | Refresh game list |
| `Escape` | Close drawers/dialogs |

### 📱 Device Integration
- **Wireless ADB** — Connect to your Quest over WiFi
- **WiFi Bookmarks** — Save frequently-used device connections
- **Real-time Status** — See battery level, storage usage, and connection status at a glance

### 📥 Downloads & Uploads
- **Slide-out Drawers** — Quick access to download/upload queues without leaving the games view
- **Progress Tracking** — Live download speed, ETA, and extraction progress
- **Queue Management** — Pause, resume, retry, or cancel downloads

### 🪞 Mirror System
- **Custom Mirrors** — Add your own rclone-based mirrors
- **Mirror Testing** — Test connectivity and latency before use
- **Automatic Failover** — Falls back to working mirrors if one fails

### 🎨 Premium Dark Theme
- **Solid dark backgrounds** — `#050505` base for comfortable extended use
- **Warm color palette** — Yellow (`#f6b012`) accents with blue (`#3c9fdd`) info colors
- **Smooth animations** — Polished micro-interactions throughout
- **Collapsible settings** — Clean, organized UI with expandable sections

---

## Comparison

| Feature | Forge VR | SideQuest | Rookie |
|---------|:--------:|:---------:|:------:|
| Game Collections | ✅ | ❌ | ❌ |
| Batch Operations | ✅ | ❌ | ❌ |
| Keyboard Shortcuts | ✅ | ❌ | ❌ |
| Custom Mirrors | ✅ | ❌ | ✅ |
| Wireless ADB | ✅ | ✅ | ✅ |
| Modern Dark UI | ✅ | ✅ | ❌ |
| Open Source | ✅ | ❌ | ❌ |

---

## Installation

### Requirements
- Windows 10/11, macOS, or Linux
- Meta Quest headset (Quest 1, 2, 3, or Pro)
- USB cable or WiFi connectivity (Quest must have developer mode enabled)

### Download

Download the latest release for your platform from [Releases](https://github.com/houseofmates/forge-vr/releases):

| Platform | File |
|----------|------|
| Windows | `forge-vr-x.x.x-setup-x64.exe` |
| macOS (Apple Silicon) | `forge-vr-x.x.x-arm64.dmg` |
| macOS (Intel) | `forge-vr-x.x.x-x64.dmg` |
| Linux | `forge-vr-x.x.x-x64.AppImage` |

### Quick Start

1. **Connect** your Quest via USB (enable developer mode first)
2. **Launch** Forge VR — your device will be detected automatically
3. **Browse** games, use collections to organize, download, and install!

---

## macOS Notes

Since the application is not signed by an Apple Developer ID, you may see: "Forge VR is damaged and can't be opened."

To resolve this, run in Terminal:

```bash
xattr -c /Applications/Forge\ VR.app
```

---

## Logs

Log files are stored at:

- **Linux:** `~/.config/forge-vr/logs/main.log`
- **macOS:** `~/Library/Logs/forge-vr/main.log`
- **Windows:** `%USERPROFILE%\AppData\Roaming\forge-vr\logs\main.log`

You can also upload logs directly from Settings for support.

---

## Troubleshooting

### Device Not Detected
1. Enable Developer Mode on your Quest (Settings → System → Developer)
2. Allow USB debugging when prompted on headset
3. Try a different USB port/cable
4. Restart ADB: `adb kill-server && adb start-server`

### WiFi Connection Issues
1. Ensure Quest and PC are on the same network
2. Check that port 5555 is not blocked by firewall
3. Try connecting via USB first, then switch to WiFi

### Network/DNS Issues
If you see connectivity errors:

1. **Change DNS** — Try Cloudflare (1.1.1.1) or Google (8.8.8.8)
2. **Use a VPN** — ProtonVPN or 1.1.1.1 VPN (both free)
3. **Check firewall** — Whitelist required domains

---

## Development

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/houseofmates/forge-vr.git
cd forge-vr

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:win
npm run build:mac
npm run build:linux
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot reload |
| `npm run build` | Build for current platform |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

---

## Technology

Built with:
- **Electron** — Cross-platform desktop framework
- **React 19** — UI library
- **Fluent UI v9** — Microsoft's design system (customized with PKM theme)
- **TanStack Table** — Performant virtualized data tables
- **ADB** — Android Debug Bridge for device communication
- **rclone** — Cloud storage downloads

---

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Credits

- Based on [Apprentice VR](https://github.com/houseofmates/apprentice-vr) by House of Mates
- Inspired by [Rookie Sideloader](https://github.com/VRPirates/rookie)
- Icons from Fluent UI Icons
- Theme design based on PKM (Personal Knowledge Management) aesthetic principles

---

## License

This project is provided as-is for personal use. Please respect the original project's licensing terms.

---

<div align="center">
  <strong>Forge VR</strong> — Craft your perfect VR library.

  <sub>made with care for the Quest community</sub>
</div>
