<h1 align="center">apprentice vr is a modern, cross-platform desktop application built with electron, react, and typescript, designed for managing and sideloading content onto meta quest devices. It aims to provide a user-friendly and feature-rich alternative to existing sideloading tools.</h1>

<h2 align="center">features</h2>

*   **cross-platform:** works seamlessly on windows, mac, and linux.
*   **modern user interface:** Built with Fluent UI and React for a clean and responsive experience.
*   **device management:**
    *   automatically detect and list connected Meta Quest devices.
    *   connect to and disconnect from devices.
    *   view device details such as model, ID, battery level, and storage information.
    *   handles unauthorized and offline device states.
*   **game library management:**
    *   browse a comprehensive list of available games and applications.
    *   vew game details including thumbnails, descriptions, versions, popularity, size, and last update date.
    *   search and filter games by name, package ID, installation status, or available updates.
*   **installation & sideloading:**
    *   download game files and OBBs.
    *   install, uninstall, and update applications on your Quest device.
    *   reinstall existing applications.
    *   handle updates for installed applications.
*   **download management:**
    *   view and manage a queue of ongoing and completed downloads.
    *   track download progress, extraction progress, and installation status.
    *   cancel, retry, and delete downloaded files.
*   **automatic Dependency Handling:** Manages required tools like ADB and rclone.
=======
<h2 align="center">apprentice vr</h2>

apprentice vr is a modern, cross-platform desktop application built with electron, react, and typescript, designed for managing and sideloading content onto quest 2 devices. it aims to provide a user-friendly and feature-rich alternative to existing sideloading tools, featuring a pkm aesthetic with varela round font, lowercase text, and a dark color scheme with yellow/blue accents. this is a fork of the original [project](https://github.com/jimzrt/apprenticeVr)

<h2 align="center">features</h2>

*   **cross-platform:** works seamlessly on windows, macos, and linux.
*   **modern user interface:** pkm aesthetic with varela round font, lowercase text, and a dark color scheme with yellow/blue accents.
*   **device management:**
    *   automatically detect and list connected quest 2 devices.
    *   connect to and disconnect from devices.
    *   view device details such as model, id, battery level, and storage information.
    *   handles unauthorized and offline device states.
*   **game library management:**
    *   browse a comprehensive list of available games and applications.
    *   view game details including thumbnails, descriptions, versions, popularity, size, and last update date.
    *   search and filter games by name, package id, installation status, or available updates.
*   **installation & sideloading:**
    *   download game files and obbs.
    *   install, uninstall, and update applications on your quest 2 device.
    *   reinstall existing applications.
    *   handle updates for installed applications.
*   **download management:**
    *   view and manage a queue of ongoing and completed downloads.
    *   track download progress, extraction progress, and installation status.
    *   cancel, retry, and delete downloaded files.
*   **automatic dependency handling:** manages required tools like adb and rclone.
*   **light & dark mode:** adapts to your system's preferred theme.

<h2 align="center">logs</h2>

by default, it writes logs to the following locations:

 - **on linux:** `~/.config/apprenticevr/logs/main.log`
 - **on macos:** `~/library/logs/apprenticevr/main.log`
 - **on windows:** `%userprofile%\appdata\roaming\apprenticevr\logs\main.log`

**note:** when opening an issue, please include the latest log output from the appropriate log file above to help with debugging and troubleshooting.

you can also upload the current log file in the settings menu and share the url.

# troubleshooting guide

if apprentice vr is unable to connect, follow the steps below to identify and resolve the issue:

---

<h2 align="center">🌐 check network access</h2>

ensure you can access the following urls from your browser:

- [https://raw.githubusercontent.com/](https://raw.githubusercontent.com/)  
  (should redirect to the github homepage)

- [https://downloads.rclone.org/](https://downloads.rclone.org/)

- [https://go.vrpyourself.online/](https://go.vrpyourself.online/)  
  ⛔ getting a message like **\"sorry, you have been blocked\"** means it's working!

---

<h2 align="center">change dns settings</h2>

some isps block specific domains. switch to a public, non-censoring dns provider:

- [cloudflare dns (1.1.1.1)](https://developers.cloudflare.com/1.1.1.1/setup/windows/)
- [google public dns (8.8.8.8)](https://developers.google.com/speed/public-dns/docs/using)
- [opendns](https://www.opendns.com/setupguide/)

---

<h2 align="center">try a vpn</h2>

if dns changes don't help, your isp might be blocking access. use a vpn to bypass restrictions:

- [protonvpn (free)](https://protonvpn.com/)
- [1.1.1.1 vpn (free)](https://one.one.one.one/)
- [alternate vpn example](https://gprivate.com/5yxo8)

---

<h2 align="center">router or firewall blocking?</h2>

if a vpn works, but a direct connection doesn't, your router or antivirus/firewall may be blocking access.  
check out this guide for help:

➡️ [https://rentry.co/asusrouterblock](https://rentry.co/asusrouterblock)

you can either:
  - continue using a vpn
  - or identify and whitelist the following domains in your router/firewall settings:
    - `raw.githubusercontent.com`
    - `downloads.rclone.org`
    - `go.vrpyourself.online`

---

if you're still stuck, feel free to open an issue or ask for help in the community. happy vr-ing!

<h2 align="center">recommended ide setup</h2>

- [vscode](https://code.visualstudio.com/) + [eslint](https://marketplace.visualstudio.com/items?itemname=dbaeumer.vscode-eslint) + [prettier](https://marketplace.visualstudio.com/items?itemname=esbenp.prettier-vscode)

<h2 align="center">project setup</h2>

### prerequisites

*   [node.js](https://nodejs.org/) (which includes npm)
*   [pnpm](https://pnpm.io/installation) (recommended package manager)

### install dependencies

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
# For Windows
pnpm build:win

# For macOS
pnpm build:mac

# For Linux
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

to perform type checking:
```bash
pnpm typecheck
```
