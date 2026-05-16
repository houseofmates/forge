<h1 align="center">apprentice vr</h1>

apprentice vr is a modern, cross-platform desktop application built with electron, react, and typescript, designed for managing and sideloading content onto meta quest devices. it aims to provide a user-friendly and feature-rich alternative to existing sideloading tools. this is a fork of the original [project](https://github.com/houseofmates/apprentice-vr). i use this every day to manage my quest 2 library, so expect it to stay maintained and useful.

<h2 align="center">inspiration</h2>

this project is heavily inspired by the fantastic work done on [rookie sideloader](https://github.com/VRPirates/rookie). apprentice vr seeks to build upon that foundation by offering a contemporary interface and experience across windows, mac, and linux.

<h2 align="center">features</h2>

- **cross-platform:** works seamlessly on windows, macos, and linux.
- **modern user interface:** dark color scheme tailored for long-term desktop use — low eye strain, high contrast.
- **device management:**
  - automatically detect and list connected quest 2 devices.
  - connect to and disconnect from devices.
  - view device details such as model, id, battery level, and storage information.
  - handles unauthorized and offline device states.
- **game library management:**
  - browse a comprehensive list of available games and applications.
  - view game details including thumbnails, descriptions, versions, popularity, size, and last update date.
  - search and filter games by name, package id, installation status, or available updates.
- **installation & sideloading:**
  - download game files and obbs.
  - install, uninstall, and update applications on your quest 2 device.
  - reinstall existing applications.
  - handle updates for installed applications.
- **download management:**
  - view and manage a queue of ongoing and completed downloads.
  - track download progress, extraction progress, and installation status.
  - cancel, retry, and delete downloaded files.
- **automatic dependency handling:** manages required tools like adb and rclone.
- **light & dark mode:** adapts to your system preferred theme.

<h2 align="center">screenshots</h2>

here are some glimpses of apprentice vr in action:

**device list (dark mode)**
![device list - dark mode](screenshots/01_devices_dark.png)

**game library (light mode)**
![game library - light mode](screenshots/02_library_light.png)

**game details (light mode)**
![game details - light mode](screenshots/03_detail_light.png)

**downloads manager (dark mode)**
![downloads manager - dark mode](screenshots/04_download_dark.png)

<h2 align="center">macos specifics</h2>

important: since the application is not signed by an apple developer id, when you first try to open apprenticevr.app on macos after building or downloading it, you might encounter an error message stating: "apprenticevr is damaged and can\'t be opened. you should move it to the trash."

this error occurs because macos gatekeeper flags applications downloaded from the internet or built by unidentified developers as potentially unsafe. the com.apple.quarantine extended attribute is added to the application bundle by the system.

to resolve this, you can remove this extended attribute by running the following command in your terminal:

```bash
xattr -c /Applications/apprenticevr.app
```

note:

- you might need to adjust the path /applications/apprenticevr.app if you have placed the application in a different location.
- the -c flag in the xattr command stands for "clear," and it removes all extended attributes from the specified file or application bundle. by removing the quarantine attribute, you are essentially telling macos that you trust this application.

after running this command, you should be able to open apprentice vr without any issues.

<h2 align="center">logs</h2>

by default, it writes logs to the following locations:

- **on linux:** ~/.config/apprenticevr/logs/main.log
- **on macos:** ~/library/logs/apprenticevr/main.log
- **on windows:** %userprofile%\appdata\roaming\apprenticevr\logs\main.log

note: when opening an issue, please include the latest log output from the appropriate log file above to help with debugging and troubleshooting.

you can also upload the current log file in the settings menu and share the url.

<h2 align="center">troubleshooting</h2>

if apprentice vr is unable to connect, follow the steps below to identify and resolve the issue:

---

<h2 align="center">use the latest version</h2>

make sure you are using the latest version of apprentice vr:
https://github.com/houseofmates/apprentice-vr

---

<h2 align="center">check network access</h2>

ensure you can access the following urls from your browser:

- https://raw.githubusercontent.com/ (should redirect to the github homepage)
- https://downloads.rclone.org/
- https://go.vrpyourself.online/
  getting a message like "sorry, you have been blocked" means it is working!

---

<h2 align="center">change dns settings</h2>

some isps block specific domains. switch to a public, non-censoring dns provider:

- [cloudflare dns (1.1.1.1)](https://developers.cloudflare.com/1.1.1.1/setup/windows/)
- [google public dns (8.8.8.8)](https://developers.google.com/speed/public-dns/docs/using)
- [opendns](https://www.opendns.com/setupguide/)

---

<h2 align="center">try a vpn</h2>

if dns changes do not help, your isp might be blocking access. use a vpn to bypass restrictions:

- [protonvpn (free)](https://protonvpn.com/)
- [1.1.1.1 vpn (free)](https://one.one.one.one/)
- [alternate vpn example](https://gprivate.com/5yxo8)

---

<h2 align="center">router or firewall blocking</h2>

if a vpn works, but a direct connection does not, your router or antivirus/firewall may be blocking access.
check out this guide for help:

https://rentry.co/asusrouterblock

you can either:

- continue using a vpn
- or identify and whitelist the following domains in your router/firewall settings:
  - raw.githubusercontent.com
  - downloads.rclone.org
  - go.vrpyourself.online

---

if you are still stuck, feel free to open an issue or ask for help in the community. happy vr-ing!

<h2 align="center">recommended ide setup</h2>

- [vscode](https://code.visualstudio.com/) + [eslint](https://marketplace.visualstudio.com/items?itemname=dbaeumer.vscode-eslint) + [prettier](https://marketplace.visualstudio.com/items?itemname=esbenp.prettier-vscode)

<h2 align="center">project setup</h2>

<h3 align="center">prerequisites</h3>

- [node.js](https://nodejs.org/) (which includes npm)
- [pnpm](https://pnpm.io/installation) (recommended package manager)

<h3 align="center">install dependencies</h3>

```bash
pnpm install
```

<h2 align="center">development</h2>

to run the application in development mode with hot-reloading:

```bash
pnpm dev
```

this will start the electron application and open a development server for the react frontend.

<h2 align="center">building the application</h2>

you can build the application for different platforms using the following commands:

```bash
# for windows
pnpm build:win

# for macos
pnpm build:mac

# for linux
pnpm build:linux
```

builds will be located in the `dist` or a platform-specific output directory.

<h2 align="center">linting and formatting</h2>

to lint the codebase:

```bash
pnpm lint
```

to format the codebase with prettier:

```bash
pnpm format
```
