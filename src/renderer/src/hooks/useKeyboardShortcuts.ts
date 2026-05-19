import { useEffect, useCallback, useRef } from 'react'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  action: () => void
  description: string
  category: 'navigation' | 'actions' | 'general'
  enabled?: boolean
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

// Registry of all shortcuts for display purposes
export const SHORTCUT_REGISTRY = {
  focusSearch: {
    key: 'f',
    ctrl: true,
    description: 'Focus search input',
    category: 'navigation' as const
  },
  toggleDownloads: {
    key: 'd',
    ctrl: true,
    description: 'Toggle downloads drawer',
    category: 'navigation' as const
  },
  toggleUploads: {
    key: 'u',
    ctrl: true,
    description: 'Toggle uploads drawer',
    category: 'navigation' as const
  },
  openSettings: {
    key: ',',
    ctrl: true,
    description: 'Open settings',
    category: 'navigation' as const
  },
  gamesView: {
    key: '1',
    ctrl: true,
    description: 'Go to games view',
    category: 'navigation' as const
  },
  refreshGames: {
    key: 'r',
    ctrl: true,
    description: 'Refresh game list',
    category: 'actions' as const
  },
  escape: {
    key: 'Escape',
    description: 'Close drawer/dialog',
    category: 'general' as const
  },
  selectAll: {
    key: 'a',
    ctrl: true,
    description: 'Select all games',
    category: 'actions' as const
  }
}

export function useKeyboardShortcuts({
  shortcuts,
  enabled = true
}: UseKeyboardShortcutsOptions): void {
  const shortcutsRef = useRef(shortcuts)
  shortcutsRef.current = shortcuts

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        // Allow Escape even in inputs
        if (event.key !== 'Escape') return
      }

      for (const shortcut of shortcutsRef.current) {
        if (shortcut.enabled === false) continue

        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : true
        const altMatch = shortcut.alt ? event.altKey : !event.altKey
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          // Prevent browser defaults for our shortcuts
          event.preventDefault()
          shortcut.action()
          return
        }
      }
    },
    [enabled]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

// Helper to format shortcut for display
export function formatShortcut(shortcut: {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
}): string {
  const parts: string[] = []

  // Use ⌘ on Mac, Ctrl on Windows/Linux
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0

  if (shortcut.ctrl) {
    parts.push(isMac ? '⌘' : 'Ctrl')
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt')
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift')
  }

  // Format key name
  let keyName = shortcut.key.toUpperCase()
  if (keyName === 'ESCAPE') keyName = 'Esc'
  if (keyName === ',') keyName = ','

  parts.push(keyName)

  return parts.join(isMac ? '' : '+')
}
