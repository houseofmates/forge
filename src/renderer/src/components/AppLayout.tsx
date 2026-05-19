import React, { useMemo, useRef, useState, useCallback } from 'react'
import { AdbProvider } from '../context/AdbProvider'
import { GamesProvider } from '../context/GamesProvider'
import DeviceList from './DeviceList'
import GamesView from './GamesView'
import DownloadsView from './DownloadsView'
import UploadsView from './UploadsView'
import Settings from './Settings'
import { UpdateNotification } from './UpdateNotification'
import UploadGamesDialog from './UploadGamesDialog'
import {
  FluentProvider,
  makeStyles,
  tokens,
  Spinner,
  Text,
  Button,
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  Tooltip,
  Badge,
  Divider
} from '@fluentui/react-components'
import electronLogo from '../assets/icon.svg'
import { useDependency } from '../hooks/useDependency'
import { DependencyProvider } from '../context/DependencyProvider'
import { DownloadProvider } from '../context/DownloadProvider'
import { SettingsProvider } from '../context/SettingsProvider'
import { useDownload } from '../hooks/useDownload'
import {
  ArrowDownloadRegular as DownloadIcon,
  DismissRegular as CloseIcon,
  AppsListRegular as GamesIcon,
  SettingsRegular,
  ArrowUploadRegular as UploadIcon,
  InfoRegular
} from '@fluentui/react-icons'
import { UploadProvider } from '@renderer/context/UploadProvider'
import { useUpload } from '@renderer/hooks/useUpload'
import { GameDialogProvider } from '@renderer/context/GameDialogProvider'
import { CollectionsProvider } from '@renderer/context/CollectionsProvider'
import pkmTheme from '../theme/pkmTheme'
import { useKeyboardShortcuts, SHORTCUT_REGISTRY } from '@renderer/hooks/useKeyboardShortcuts'

enum AppView {
  DEVICE_LIST,
  GAMES
}

type ActiveTab = 'games' | 'settings'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#050505'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    borderBottom: '1px solid #252525',
    backgroundColor: '#0a0a0a',
    gap: tokens.spacingHorizontalM,
    justifyContent: 'space-between',
    height: '64px',
    flexShrink: 0
  },
  logo: {
    height: '36px',
    width: '36px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM
  },
  appTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#f6b012',
    letterSpacing: '0.5px'
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: 'calc(100dvh - 64px)',
    position: 'relative',
    backgroundColor: '#050505'
  },
  loadingOrErrorContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalL,
    backgroundColor: '#050505',
    color: '#ffffff'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  navButton: {
    transition: 'all 200ms cubic-bezier(0.33, 1, 0.68, 1)',
    ':hover': {
      transform: 'translateY(-1px)'
    },
    ':active': {
      transform: 'scale(0.98)'
    }
  },
  navButtonActive: {
    backgroundColor: '#1a1a1a',
    color: '#f6b012',
    borderBottomColor: '#f6b012',
    borderTopColor: '#f6b012',
    borderLeftColor: '#f6b012',
    borderRightColor: '#f6b012'
  },
  actionButton: {
    backgroundColor: '#111111',
    border: '1px solid #252525',
    color: '#ffffff',
    transition: 'all 200ms cubic-bezier(0.33, 1, 0.68, 1)',
    ':hover': {
      backgroundColor: '#1a1a1a',
      borderBottomColor: '#f6b012',
      borderTopColor: '#f6b012',
      borderLeftColor: '#f6b012',
      borderRightColor: '#f6b012',
      color: '#f6b012'
    },
    ':active': {
      transform: 'scale(0.98)'
    }
  },
  statusBadge: {
    marginLeft: tokens.spacingHorizontalXS
  },
  versionBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#1a1a1a',
    color: '#3c9fdd'
  }
})

interface MainContentProps {
  currentView: AppView
  activeTab: ActiveTab
  onDeviceConnected: () => void
  onSkipConnection: () => void
  onBackToDeviceList: () => void
}

const MainContent: React.FC<MainContentProps> = ({
  currentView,
  activeTab,
  onDeviceConnected,
  onSkipConnection,
  onBackToDeviceList
}) => {
  const styles = useStyles()
  const {
    isReady: dependenciesReady,
    error: dependencyError,
    progress: dependencyProgress,
    status: dependencyStatus
  } = useDependency()

  const renderCurrentView = (): React.ReactNode => {
    if (currentView === AppView.DEVICE_LIST) {
      return <DeviceList onConnected={onDeviceConnected} onSkip={onSkipConnection} />
    }

    if (activeTab === 'settings') {
      return <Settings />
    } else {
      return <GamesView onBackToDevices={onBackToDeviceList} />
    }
  }

  if (!dependenciesReady) {
    if (dependencyError) {
      if (dependencyError.startsWith('CONNECTIVITY_ERROR|')) {
        const failedUrls = dependencyError.replace('CONNECTIVITY_ERROR|', '').split('|')

        return (
          <div className={styles.loadingOrErrorContainer}>
            <Text weight="semibold" style={{ color: '#ef4444', fontSize: '18px' }}>
              network connectivity issues
            </Text>
            <Text style={{ color: '#ffffff' }}>cannot reach the following services:</Text>
            <ul style={{ textAlign: 'left', marginTop: tokens.spacingVerticalS }}>
              {failedUrls.map((url, index) => (
                <li key={index} style={{ marginBottom: tokens.spacingVerticalXS }}>
                  <Text style={{ fontFamily: 'monospace', fontSize: '12px', color: '#3c9fdd' }}>
                    {url}
                  </Text>
                </li>
              ))}
            </ul>
            <Text style={{ marginTop: tokens.spacingVerticalM, color: '#ffffff' }}>
              this is likely due to dns or firewall restrictions. please try:
            </Text>
            <ol style={{ textAlign: 'left', marginTop: tokens.spacingVerticalS, color: '#ffffff' }}>
              <li style={{ marginBottom: tokens.spacingVerticalXS }}>
                change your dns to cloudflare (1.1.1.1) or google (8.8.8.8)
              </li>
              <li style={{ marginBottom: tokens.spacingVerticalXS }}>
                use a vpn like protonvpn or 1.1.1.1 vpn
              </li>
              <li style={{ marginBottom: tokens.spacingVerticalXS }}>
                check your router/firewall settings
              </li>
            </ol>
            <Text style={{ marginTop: tokens.spacingVerticalM }}>
              <a
                href="https://github.com/houseofmates/forge-vr#troubleshooting-guide"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3c9fdd' }}
              >
                view troubleshooting guide
              </a>
            </Text>
          </div>
        )
      }

      const errorDetails: string[] = []
      if (!dependencyStatus?.sevenZip.ready) errorDetails.push('7zip')
      if (!dependencyStatus?.rclone.ready) errorDetails.push('rclone')
      if (!dependencyStatus?.adb.ready) errorDetails.push('adb')

      const failedDeps = errorDetails.length > 0 ? ` (${errorDetails.join(', ')})` : ''

      return (
        <div className={styles.loadingOrErrorContainer}>
          <Text weight="semibold" style={{ color: '#ef4444', fontSize: '18px' }}>
            dependency error {failedDeps}
          </Text>
          <Text style={{ color: '#ffffff' }}>{dependencyError}</Text>
        </div>
      )
    }

    let progressText = 'checking requirements...'

    if (dependencyProgress?.name === 'connectivity-check') {
      progressText = `checking network connectivity... ${dependencyProgress.percentage}%`
    } else if (dependencyStatus?.rclone.downloading && dependencyProgress) {
      progressText = `setting up ${dependencyProgress.name}... ${dependencyProgress.percentage}%`
      if (dependencyProgress.name === 'rclone-extract') {
        progressText = `extracting ${dependencyProgress.name.replace('-extract', '')}...`
      }
    } else if (dependencyStatus?.adb.downloading && dependencyProgress) {
      progressText = `setting up ${dependencyProgress.name}... ${dependencyProgress.percentage}%`
      if (dependencyProgress.name === 'adb-extract') {
        progressText = `extracting ${dependencyProgress.name.replace('-extract', '')}...`
      }
    } else if (
      dependencyStatus &&
      (!dependencyStatus.sevenZip.ready ||
        !dependencyStatus.rclone.ready ||
        !dependencyStatus.adb.ready)
    ) {
      progressText = 'setting up requirements...'
    }

    return (
      <div className={styles.loadingOrErrorContainer}>
        <Spinner size="huge" />
        <Text style={{ color: '#ffffff' }}>{progressText}</Text>
      </div>
    )
  }

  return (
    <>
      <UploadGamesDialog />
      {renderCurrentView()}
    </>
  )
}

const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DEVICE_LIST)
  const [activeTab, setActiveTab] = useState<ActiveTab>('games')
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false)
  const [isUploadsOpen, setIsUploadsOpen] = useState(false)
  const mountNodeRef = useRef<HTMLDivElement>(null)
  const styles = useStyles()
  const { queue: downloadQueue } = useDownload()
  const { queue: uploadQueue } = useUpload()

  const handleDeviceConnected = (): void => {
    setCurrentView(AppView.GAMES)
  }

  const handleSkipConnection = (): void => {
    setCurrentView(AppView.GAMES)
  }

  const handleBackToDeviceList = (): void => {
    setCurrentView(AppView.DEVICE_LIST)
  }

  // Keyboard shortcut handlers
  const handleFocusSearch = useCallback(() => {
    // Emit custom event that GamesView can listen to
    window.dispatchEvent(new CustomEvent('focus-search'))
  }, [])

  const handleToggleDownloads = useCallback(() => {
    setIsDownloadsOpen((prev) => !prev)
    setIsUploadsOpen(false)
  }, [])

  const handleToggleUploads = useCallback(() => {
    setIsUploadsOpen((prev) => !prev)
    setIsDownloadsOpen(false)
  }, [])

  const handleOpenSettings = useCallback(() => {
    if (currentView === AppView.GAMES) {
      setActiveTab('settings')
    }
  }, [currentView])

  const handleGamesView = useCallback(() => {
    if (currentView === AppView.GAMES) {
      setActiveTab('games')
    }
  }, [currentView])

  const handleEscape = useCallback(() => {
    if (isDownloadsOpen) {
      setIsDownloadsOpen(false)
    } else if (isUploadsOpen) {
      setIsUploadsOpen(false)
    }
  }, [isDownloadsOpen, isUploadsOpen])

  const handleRefreshGames = useCallback(() => {
    window.dispatchEvent(new CustomEvent('refresh-games'))
  }, [])

  // Register keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        ...SHORTCUT_REGISTRY.focusSearch,
        action: handleFocusSearch
      },
      {
        ...SHORTCUT_REGISTRY.toggleDownloads,
        action: handleToggleDownloads
      },
      {
        ...SHORTCUT_REGISTRY.toggleUploads,
        action: handleToggleUploads
      },
      {
        ...SHORTCUT_REGISTRY.openSettings,
        action: handleOpenSettings
      },
      {
        ...SHORTCUT_REGISTRY.gamesView,
        action: handleGamesView
      },
      {
        ...SHORTCUT_REGISTRY.escape,
        action: handleEscape
      },
      {
        ...SHORTCUT_REGISTRY.refreshGames,
        action: handleRefreshGames
      }
    ],
    enabled: currentView === AppView.GAMES
  })

  const downloadQueueProgress = useMemo(() => {
    const activeDownloads = downloadQueue.filter((item) => item.status === 'Downloading')
    const extractingDownloads = downloadQueue.filter((item) => item.status === 'Extracting')
    const installingDownloads = downloadQueue.filter((item) => item.status === 'Installing')
    const queuedDownloads = downloadQueue.filter((item) => item.status === 'Queued')
    return {
      activeDownloads,
      extractingDownloads,
      installingDownloads,
      queuedDownloads
    }
  }, [downloadQueue])

  const uploadQueueProgress = useMemo(() => {
    const preparingUploads = uploadQueue.filter((item) => item.status === 'Preparing')
    const activeUploads = uploadQueue.filter((item) => item.status === 'Uploading')
    const queuedUploads = uploadQueue.filter((item) => item.status === 'Queued')
    return {
      preparingUploads,
      activeUploads,
      queuedUploads
    }
  }, [uploadQueue])

  const getDownloadButtonContent = (): {
    icon: React.JSX.Element
    text: string
    badge?: number
  } => {
    const { activeDownloads, extractingDownloads, installingDownloads, queuedDownloads } =
      downloadQueueProgress

    const totalActive =
      activeDownloads.length +
      extractingDownloads.length +
      installingDownloads.length +
      queuedDownloads.length

    if (activeDownloads.length > 0) {
      const activeDownload = activeDownloads[0]
      return {
        icon: <Spinner size="tiny" />,
        text: `${activeDownload.gameName.substring(0, 15)}... ${activeDownload.progress}%`,
        badge: queuedDownloads.length > 0 ? queuedDownloads.length : undefined
      }
    } else if (extractingDownloads.length > 0) {
      const extracting = extractingDownloads[0]
      return {
        icon: <Spinner size="tiny" />,
        text: `extracting ${extracting.gameName.substring(0, 12)}...`,
        badge: queuedDownloads.length > 0 ? queuedDownloads.length : undefined
      }
    } else if (installingDownloads.length > 0) {
      return {
        icon: <Spinner size="tiny" />,
        text: 'installing...',
        badge: queuedDownloads.length > 0 ? queuedDownloads.length : undefined
      }
    } else {
      return {
        icon: <DownloadIcon />,
        text: 'downloads',
        badge: totalActive > 0 ? totalActive : undefined
      }
    }
  }

  const getUploadButtonContent = (): { icon: React.JSX.Element; text: string; badge?: number } => {
    const { preparingUploads, activeUploads, queuedUploads } = uploadQueueProgress

    const totalActive = preparingUploads.length + activeUploads.length + queuedUploads.length

    if (activeUploads.length > 0) {
      const activeUpload = activeUploads[0]
      return {
        icon: <Spinner size="tiny" />,
        text: `uploading ${activeUpload.gameName.substring(0, 12)}...`,
        badge: queuedUploads.length > 0 ? queuedUploads.length : undefined
      }
    } else if (preparingUploads.length > 0) {
      return {
        icon: <Spinner size="tiny" />,
        text: 'preparing...',
        badge: queuedUploads.length > 0 ? queuedUploads.length : undefined
      }
    } else {
      return {
        icon: <UploadIcon />,
        text: 'uploads',
        badge: totalActive > 0 ? totalActive : undefined
      }
    }
  }

  const {
    icon: downloadButtonIcon,
    text: downloadButtonText,
    badge: downloadBadge
  } = getDownloadButtonContent()
  const {
    icon: uploadButtonIcon,
    text: uploadButtonText,
    badge: uploadBadge
  } = getUploadButtonContent()

  return (
    <FluentProvider theme={pkmTheme}>
      <AdbProvider>
        <GamesProvider>
          <GameDialogProvider>
            <div className={styles.root}>
              <div className={styles.header}>
                <div className={styles.headerContent}>
                  <img alt="forge vr" className={styles.logo} src={electronLogo} />
                  <span className={styles.appTitle}>forge vr</span>
                  <span className={styles.versionBadge}>v2.0.0</span>
                </div>
                <div className={styles.headerActions}>
                  {currentView !== AppView.DEVICE_LIST && (
                    <>
                      {/* navigation tabs */}
                      <Tooltip content="game library" relationship="label">
                        <Button
                          icon={<GamesIcon />}
                          appearance={activeTab === 'games' ? 'primary' : 'subtle'}
                          onClick={() => setActiveTab('games')}
                          className={`${styles.navButton} ${activeTab === 'games' ? styles.navButtonActive : ''}`}
                        >
                          games
                        </Button>
                      </Tooltip>

                      <Tooltip content="application settings" relationship="label">
                        <Button
                          icon={<SettingsRegular />}
                          appearance={activeTab === 'settings' ? 'primary' : 'subtle'}
                          onClick={() => setActiveTab('settings')}
                          className={`${styles.navButton} ${activeTab === 'settings' ? styles.navButtonActive : ''}`}
                        >
                          settings
                        </Button>
                      </Tooltip>

                      <Divider vertical style={{ height: '24px', margin: '0 8px' }} />

                      {/* action buttons */}
                      <Tooltip content="view downloads" relationship="label">
                        <div style={{ position: 'relative', display: 'inline-flex' }}>
                          <Button
                            onClick={() => setIsDownloadsOpen(true)}
                            icon={downloadButtonIcon}
                            className={styles.actionButton}
                          >
                            {downloadButtonText}
                          </Button>
                          {downloadBadge && (
                            <Badge
                              size="small"
                              appearance="filled"
                              color="brand"
                              className={styles.statusBadge}
                              style={{ position: 'absolute', top: '-4px', right: '-4px' }}
                            >
                              {String(downloadBadge)}
                            </Badge>
                          )}
                        </div>
                      </Tooltip>

                      <Tooltip content="view uploads" relationship="label">
                        <div style={{ position: 'relative', display: 'inline-flex' }}>
                          <Button
                            onClick={() => setIsUploadsOpen(true)}
                            icon={uploadButtonIcon}
                            className={styles.actionButton}
                          >
                            {uploadButtonText}
                          </Button>
                          {uploadBadge && (
                            <Badge
                              size="small"
                              appearance="filled"
                              color="brand"
                              className={styles.statusBadge}
                              style={{ position: 'absolute', top: '-4px', right: '-4px' }}
                            >
                              {String(uploadBadge)}
                            </Badge>
                          )}
                        </div>
                      </Tooltip>

                      <Tooltip content="about" relationship="label">
                        <Button
                          icon={<InfoRegular />}
                          appearance="subtle"
                          onClick={() =>
                            window.open('https://github.com/houseofmates/forge-vr', '_blank')
                          }
                        />
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.mainContent} id="mainContent">
                <MainContent
                  currentView={currentView}
                  activeTab={activeTab}
                  onDeviceConnected={handleDeviceConnected}
                  onSkipConnection={handleSkipConnection}
                  onBackToDeviceList={handleBackToDeviceList}
                />
              </div>

              <UpdateNotification />

              <Drawer
                type="overlay"
                separator
                open={isDownloadsOpen}
                onOpenChange={(_, { open }) => setIsDownloadsOpen(open)}
                position="end"
                style={{ width: '650px' }}
                mountNode={mountNodeRef.current}
              >
                <DrawerHeader
                  style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #252525' }}
                >
                  <DrawerHeaderTitle
                    action={
                      <Button
                        appearance="subtle"
                        aria-label="close"
                        icon={<CloseIcon />}
                        onClick={() => setIsDownloadsOpen(false)}
                      />
                    }
                  >
                    <span style={{ color: '#f6b012' }}>downloads</span>
                  </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody style={{ backgroundColor: '#050505' }}>
                  <DownloadsView onClose={() => setIsDownloadsOpen(false)} />
                </DrawerBody>
              </Drawer>

              <Drawer
                type="overlay"
                separator
                open={isUploadsOpen}
                onOpenChange={(_, { open }) => setIsUploadsOpen(open)}
                position="end"
                style={{ width: '650px' }}
                mountNode={mountNodeRef.current}
              >
                <DrawerHeader
                  style={{ backgroundColor: '#0a0a0a', borderBottom: '1px solid #252525' }}
                >
                  <DrawerHeaderTitle
                    action={
                      <Button
                        appearance="subtle"
                        aria-label="close"
                        icon={<CloseIcon />}
                        onClick={() => setIsUploadsOpen(false)}
                      />
                    }
                  >
                    <span style={{ color: '#f6b012' }}>uploads</span>
                  </DrawerHeaderTitle>
                </DrawerHeader>
                <DrawerBody style={{ backgroundColor: '#050505' }}>
                  <UploadsView />
                </DrawerBody>
              </Drawer>
            </div>
            <div
              id="portal-parent"
              style={{
                zIndex: 1000,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none'
              }}
            >
              <div ref={mountNodeRef} id="portal" style={{ pointerEvents: 'auto' }}></div>
            </div>
          </GameDialogProvider>
        </GamesProvider>
      </AdbProvider>
    </FluentProvider>
  )
}

const AppLayoutWithProviders: React.FC = () => {
  return (
    <SettingsProvider>
      <DependencyProvider>
        <DownloadProvider>
          <UploadProvider>
            <CollectionsProvider>
              <AppLayout />
            </CollectionsProvider>
          </UploadProvider>
        </DownloadProvider>
      </DependencyProvider>
    </SettingsProvider>
  )
}

export default AppLayoutWithProviders
