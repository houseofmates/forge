import React, { ReactNode, useEffect, useState, useCallback } from 'react'
import { SettingsContext, SettingsContextType } from './SettingsContext'

interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [downloadPath, setDownloadPathState] = useState<string>('')
  const [downloadSpeedLimit, setDownloadSpeedLimitState] = useState<number>(0)
  const [uploadSpeedLimit, setUploadSpeedLimitState] = useState<number>(0)
  const [colorScheme, setColorSchemeState] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial settings when component mounts
  useEffect(() => {
    let isMounted = true

    const loadSettings = async (): Promise<void> => {
      try {
        const [path, downloadLimit, uploadLimit, colorScheme] = await Promise.all([
          window.api.settings.getDownloadPath(),
          window.api.settings.getDownloadSpeedLimit(),
          window.api.settings.getUploadSpeedLimit(),
          window.api.settings.getColorScheme()
        ])

        if (isMounted) {
          setDownloadPathState(path)
          setDownloadSpeedLimitState(downloadLimit)
          setUploadSpeedLimitState(uploadLimit)
          setColorSchemeState(colorScheme)
        }
      } catch {
        if (isMounted) {
          setError('Failed to load settings')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      isMounted = false
    }
  }, [])

  // Function to update download path
  const setDownloadPath = useCallback(async (path: string): Promise<void> => {
    try {
      setIsLoading(true)
      await window.api.settings.setDownloadPath(path)
      setDownloadPathState(path)
      setError(null)
    } catch (err) {
      setError('Failed to update download path')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Function to update download speed limit
  const setDownloadSpeedLimit = useCallback(async (limit: number): Promise<void> => {
    try {
      setIsLoading(true)
      await window.api.settings.setDownloadSpeedLimit(limit)
      setDownloadSpeedLimitState(limit)
      setError(null)
    } catch (err) {
      setError('Failed to update download speed limit')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Function to update upload speed limit
  const setUploadSpeedLimit = useCallback(async (limit: number): Promise<void> => {
    try {
      setIsLoading(true)
      await window.api.settings.setUploadSpeedLimit(limit)
      setUploadSpeedLimitState(limit)
      setError(null)
    } catch (err) {
      setError('Failed to update upload speed limit')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const setColorScheme = useCallback(async (scheme: 'light' | 'dark'): Promise<void> => {
    try {
      setIsLoading(true)
      await window.api.settings.setColorScheme(scheme)
      setColorSchemeState(scheme)
      setError(null)
    } catch (err) {
      setError('Failed to update color scheme')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value: SettingsContextType = {
    downloadPath,
    downloadSpeedLimit,
    uploadSpeedLimit,
    colorScheme,
    isLoading,
    error,
    setDownloadPath,
    setDownloadSpeedLimit,
    setUploadSpeedLimit,
    setColorScheme
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
