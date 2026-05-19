import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { makeStyles, tokens, Text, Button } from '@fluentui/react-components'
import {
  CheckmarkCircleRegular,
  ErrorCircleRegular,
  InfoRegular,
  WarningRegular,
  DismissRegular
} from '@fluentui/react-icons'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number // ms, 0 = persistent
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => string
  dismissToast: (id: string) => void
  dismissAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const useStyles = makeStyles({
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    zIndex: 10000,
    maxWidth: '400px',
    pointerEvents: 'none'
  },
  toast: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    backgroundColor: '#1a1a1a',
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    animation: 'slideIn 0.2s ease-out',
    pointerEvents: 'auto',
    minWidth: '300px'
  },
  toastSuccess: {
    borderLeftColor: '#22c55e'
  },
  toastError: {
    borderLeftColor: '#ef4444'
  },
  toastInfo: {
    borderLeftColor: '#3c9fdd'
  },
  toastWarning: {
    borderLeftColor: '#f6b012'
  },
  toastExiting: {
    animation: 'slideOut 0.2s ease-in forwards'
  },
  icon: {
    flexShrink: 0,
    marginTop: '2px'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS
  },
  title: {
    fontWeight: 600,
    color: '#ffffff'
  },
  message: {
    color: '#aaaaaa',
    fontSize: '13px'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalXS
  },
  dismissButton: {
    minWidth: 'auto',
    padding: '4px'
  }
})

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckmarkCircleRegular fontSize={20} color="#22c55e" />,
  error: <ErrorCircleRegular fontSize={20} color="#ef4444" />,
  info: <InfoRegular fontSize={20} color="#3c9fdd" />,
  warning: <WarningRegular fontSize={20} color="#f6b012" />
}

const ToastItem: React.FC<{
  toast: Toast
  onDismiss: (id: string) => void
}> = ({ toast, onDismiss }) => {
  const styles = useStyles()
  const [isExiting, setIsExiting] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => onDismiss(toast.id), 200)
  }, [onDismiss, toast.id])

  useEffect(() => {
    if (toast.duration !== 0) {
      timerRef.current = setTimeout(handleDismiss, toast.duration || 5000)
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [handleDismiss, toast.duration])

  const typeClass = {
    success: styles.toastSuccess,
    error: styles.toastError,
    info: styles.toastInfo,
    warning: styles.toastWarning
  }[toast.type]

  return (
    <div className={`${styles.toast} ${typeClass} ${isExiting ? styles.toastExiting : ''}`}>
      <div className={styles.icon}>{ICONS[toast.type]}</div>
      <div className={styles.content}>
        <Text className={styles.title}>{toast.title}</Text>
        {toast.message && <Text className={styles.message}>{toast.message}</Text>}
        {toast.action && (
          <div className={styles.actions}>
            <Button
              size="small"
              appearance="primary"
              onClick={() => {
                toast.action?.onClick()
                handleDismiss()
              }}
            >
              {toast.action.label}
            </Button>
          </div>
        )}
      </div>
      <Button
        appearance="subtle"
        icon={<DismissRegular />}
        className={styles.dismissButton}
        onClick={handleDismiss}
        aria-label="Dismiss"
      />
    </div>
  )
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const styles = useStyles()
  const [toasts, setToasts] = useState<Toast[]>([])
  const idCounter = useRef(0)

  const showToast = useCallback((toast: Omit<Toast, 'id'>): string => {
    const id = `toast-${++idCounter.current}`
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, dismissToast, dismissAll }}>
      {children}
      <div className={styles.container}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export default ToastProvider
