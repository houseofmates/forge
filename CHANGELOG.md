# Changelog

All notable changes to Forge VR will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-05-19

### 🎉 Major Release — Rebrand & Feature Expansion

This release marks the transformation from Apprentice VR to **Forge VR**, introducing significant new features and a distinctive identity.

### Added

#### Collections & Favorites
- Star/favorite button on each game row and in game details dialog
- "Favorites" filter alongside All/Installed/Update filters
- Custom named collections (e.g., "Horror", "Puzzle", "To Play") with color coding
- Collections drawer for managing and organizing games
- Collection filter chips in the toolbar

#### Batch Operations
- Checkboxes on game rows with "Select All" header checkbox
- Floating batch action bar with: Download All, Install All, Uninstall All, Add to Collection
- Selected game count and total size display
- Auto-clear selection on filter change

#### Keyboard Shortcuts
- `Ctrl+F` — Focus search input
- `Ctrl+D` — Toggle downloads drawer
- `Ctrl+U` — Toggle uploads drawer
- `Ctrl+,` — Open settings
- `Ctrl+1` — Switch to games view
- `Ctrl+R` — Refresh game list
- `Escape` — Close drawers/dialogs
- Keyboard shortcuts section in Settings

### Changed

#### Branding
- Renamed from "Apprentice VR" to "Forge VR"
- New app ID: `com.forgevr`
- Updated all references, URLs, and documentation
- Version bump to 2.0.0

#### Theme & Design (PKM Aesthetic)
- Solid dark backgrounds (`#050505` base, no gradients)
- Varela Round typography, lowercase UI text
- Warm color palette: yellow (`#f6b012`) primary, blue (`#3c9fdd`) info
- Consistent button styling with subtle hover effects
- Smooth 200ms cubic-bezier transitions

#### UI/UX Improvements
- Collapsible settings sections (Download, Speed Limits, Log Upload, Keyboard Shortcuts, Blacklist)
- Slide-out drawers for Downloads and Uploads
- Better visual hierarchy and spacing
- Fixed height calculation for new 64px header

### Fixed

- Replaced hardcoded `tokens.color*` with PKM palette values throughout
- Fixed BrandVariants color ramp configuration
- Removed debug console.log statements from renderer
- Fixed TypeScript strict mode compliance

### Technical

- Added `CollectionsProvider` context for favorites/collections state
- Added `collectionsService` in main process with IPC handlers
- Created `useKeyboardShortcuts` hook with registry pattern
- Created `CollapsibleSection` reusable component
- Created `BatchActionBar` component

---

## [1.3.4] - Previous Release

See the original [Apprentice VR changelog](https://github.com/houseofmates/apprentice-vr) for earlier history.
