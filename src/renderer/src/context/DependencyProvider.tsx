import React, { ReactNode, useEffect, useState } from 'react'
import { DependencyContext, DependencyContextType } from './DependencyContext'
import { DependencyStatus } from '@shared/types'

interface DependencyProviderProps {
  children: ReactNode
}

export const DependencyProvider: React.FC<DependencyProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState<boolean>(false)
  const [status, setStatus] = useState<DependencyStatus | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ name: string; percentage: number } | null>(null)

  useEffect(() => {
    window.api.dependency.getStatus().then((status) => {
      setStatus(status)
      const allReady =
        status.sevenZip.ready &&
        status.rclone.ready &&
        status.adb.ready &&
        status.services === 'INITIALIZED'
      setIsReady(allReady)
    })

    // Setup listeners
    const removeProgressListener = window.api.onDependencyProgress((status, progressData) => {
      setStatus(status)
      setProgress(progressData)
      setError(null)
    })

    const removeCompleteListener = window.api.onDependencySetupComplete((finalStatus) => {
      setStatus(finalStatus)
      // Determine overall readiness based on ALL dependencies
      const allReady =
        finalStatus.sevenZip.ready &&
        finalStatus.rclone.ready &&
        finalStatus.adb.ready &&
        finalStatus.services === 'INITIALIZED'
      setIsReady(allReady)

      let combinedError: string | null = null
      if (!allReady) {
        const errors: string[] = []
        if (!finalStatus.sevenZip.ready)
          errors.push(`7zip (${finalStatus.sevenZip.error || 'unknown error'})`)
        if (!finalStatus.rclone.ready)
          errors.push(`rclone (${finalStatus.rclone.error || 'unknown error'})`)
        if (!finalStatus.adb.ready) errors.push(`adb (${finalStatus.adb.error || 'unknown error'})`)
        if (finalStatus.services === 'ERROR')
          errors.push(`Services (${finalStatus.services || 'unknown error'})`)
        combinedError = `Required dependencies failed: ${errors.join('; ')}`
      }
      setError(combinedError)

      setProgress(null)
    })

    const removeErrorListener = window.api.onDependencySetupError((errorInfo) => {
      setStatus(errorInfo.status)
      setIsReady(false)
      setError(errorInfo.message || 'Unknown dependency setup error')
      setProgress(null)
    })

    //window.api.initializeDependencies() // No await needed, fire-and-forget request

    return () => {
      removeProgressListener()
      removeCompleteListener()
      removeErrorListener()
    }
  }, [])

  const value: DependencyContextType = {
    isReady,
    status,
    error,
    progress
  }

  return <DependencyContext.Provider value={value}>{children}</DependencyContext.Provider>
}
