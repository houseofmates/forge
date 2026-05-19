import React from 'react'
import { useAdb } from '../hooks/useAdb'
import { ExtendedDeviceInfo, hasBookmarkData, isWiFiBookmark } from '@shared/types'
import {
  Button,
  Card,
  CardHeader,
  CardPreview,
  Spinner,
  Body1,
  makeStyles,
  tokens,
  Text,
  Input,
  Field
} from '@fluentui/react-components'
import {
  DeviceMeetingRoomRegular,
  PlugDisconnectedRegular,
  ArrowClockwiseRegular as RefreshIcon,
  BatteryChargeRegular,
  StorageRegular,
  DismissCircleRegular,
  WarningRegular,
  ErrorCircleRegular,
  BookmarkRegular,
  Wifi1Regular,
  CheckmarkCircleRegular,
  DismissCircleRegular as DisconnectedCircleRegular,
  ClockRegular,
  PlugConnectedRegular
} from '@fluentui/react-icons'

interface DeviceListProps {
  onSkip?: () => void
  onConnected?: () => void
}

const useStyles = makeStyles({
  card: {
    width: '100%',
    maxWidth: '700px',
    margin: 'auto',
    backgroundColor: '#0a0a0a',
    border: '1px solid #252525',
    borderRadius: '12px'
  },
  headerActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS
  },
  deviceListContainer: {
    marginTop: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalL
  },
  deviceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    backgroundColor: '#111111',
    borderRadius: '8px',
    marginBottom: tokens.spacingVerticalS,
    border: '1px solid #252525',
    transition: 'all 200ms cubic-bezier(0.33, 1, 0.68, 1)',
    ':hover': {
      backgroundColor: '#1a1a1a',
      borderBottomColor: '#f6b012',
      borderTopColor: '#f6b012',
      borderLeftColor: '#f6b012',
      borderRightColor: '#f6b012'
    },
    cursor: 'default'
  },
  wifiBookmarkDevice: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    backgroundColor: '#111111',
    borderRadius: '8px',
    border: '1px solid #3c9fdd',
    marginBottom: tokens.spacingVerticalS,
    transition: 'all 200ms cubic-bezier(0.33, 1, 0.68, 1)',
    ':hover': {
      backgroundColor: '#1a1a1a',
      borderBottomColor: '#f6b012',
      borderTopColor: '#f6b012',
      borderLeftColor: '#f6b012',
      borderRightColor: '#f6b012'
    },
    cursor: 'default'
  },
  deviceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM
  },
  deviceText: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingHorizontalXXS
  },
  deviceId: {
    fontWeight: 500,
    color: '#ffffff'
  },
  deviceType: {
    color: '#3c9fdd',
    fontSize: '12px'
  },
  wifiDeviceType: {
    color: '#f6b012',
    fontSize: '12px',
    fontWeight: 500
  },
  deviceDetailsLine: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    color: '#3c9fdd',
    fontSize: '12px'
  },
  statusBadge: {
    marginLeft: tokens.spacingHorizontalS
  },
  messageArea: {
    textAlign: 'center',
    padding: tokens.spacingVerticalXXL,
    color: '#3c9fdd'
  },
  warningText: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    color: '#f6b012',
    fontSize: '12px',
    marginTop: tokens.spacingVerticalXXS
  },
  deviceStatusText: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    color: '#ef4444',
    fontSize: '12px',
    marginTop: tokens.spacingVerticalXXS
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
  primaryButton: {
    backgroundColor: '#f6b012',
    color: '#050505',
    fontWeight: 500,
    transition: 'all 200ms cubic-bezier(0.33, 1, 0.68, 1)',
    ':hover': {
      backgroundColor: '#f9c042'
    },
    ':active': {
      transform: 'scale(0.98)'
    }
  },
  headerTitle: {
    color: '#f6b012',
    fontSize: '18px',
    fontWeight: 600
  },
  inputField: {
    backgroundColor: '#111111',
    border: '1px solid #252525',
    borderRadius: '6px'
  },
  tcpSection: {
    padding: tokens.spacingVerticalM,
    borderBottom: '1px solid #252525',
    backgroundColor: '#0a0a0a'
  }
})

const DeviceList: React.FC<DeviceListProps> = ({ onSkip, onConnected }) => {
  const {
    devices,
    selectedDevice,
    isConnected,
    isLoading,
    error,
    connectToDevice,
    connectTcpDevice,
    disconnectTcpDevice,
    refreshDevices,
    disconnectDevice
  } = useAdb()
  const styles = useStyles()
  const [tcpIpAddress, setTcpIpAddress] = React.useState('')
  const [tcpPort, setTcpPort] = React.useState('5555')
  const [isTcpConnecting, setIsTcpConnecting] = React.useState(false)
  const [connectingDeviceId, setConnectingDeviceId] = React.useState<string | null>(null)
  const [connectionError, setConnectionError] = React.useState<string | null>(null)
  const [lastFailedDeviceId, setLastFailedDeviceId] = React.useState<string | null>(null)

  // Get all bookmarked IP addresses to check for duplicates
  const bookmarkedIpAddresses = React.useMemo(() => {
    return devices
      .filter((device) => isWiFiBookmark(device) || hasBookmarkData(device))
      .map((device) => {
        if (isWiFiBookmark(device)) {
          return device.ipAddress
        }
        if (hasBookmarkData(device)) {
          return device.bookmarkData.ipAddress
        }
        return null
      })
      .filter((ip): ip is string => ip !== null)
  }, [devices])

  const handleConnect = async (serial: string): Promise<void> => {
    setConnectingDeviceId(serial)
    setConnectionError(null)
    setLastFailedDeviceId(null)
    try {
      const success = await connectToDevice(serial)
      if (success && onConnected) {
        onConnected()
        setLastFailedDeviceId(null)
      } else {
        const currentDevice = devices.find((d) => d.id === serial)
        if (currentDevice?.pingStatus === 'unreachable') {
          setConnectionError(`device ${currentDevice.ipAddress || serial} is unreachable (offline)`)
        } else {
          setConnectionError(`failed to connect to device ${serial}`)
        }
        setLastFailedDeviceId(serial)
      }
    } catch {
      setConnectionError('connection failed')
      setLastFailedDeviceId(serial)
    } finally {
      setConnectingDeviceId(null)
    }
  }

  const handleTcpConnect = async (): Promise<void> => {
    if (!tcpIpAddress.trim()) return

    setIsTcpConnecting(true)
    try {
      const port = parseInt(tcpPort) || 5555
      const deviceName = `${tcpIpAddress.trim()}:${port}`

      const success = await window.api.wifiBookmarks.add(deviceName, tcpIpAddress.trim(), port)
      if (success) {
        setTcpIpAddress('')
        setTcpPort('5555')
        refreshDevices()
      }
    } finally {
      setIsTcpConnecting(false)
    }
  }

  const handleBookmarkDevice = async (device: {
    ipAddress?: string | null
    friendlyModelName?: string | null
    model?: string | null
    id: string
  }): Promise<void> => {
    if (!device.ipAddress) return

    const deviceName = device.friendlyModelName || device.model || device.id
    const success = await window.api.wifiBookmarks.add(
      `${deviceName} (${device.ipAddress})`,
      device.ipAddress,
      5555
    )

    if (success) {
      refreshDevices()
    }
  }

  const handleConnectBookmark = async (device: ExtendedDeviceInfo): Promise<void> => {
    if (!hasBookmarkData(device)) return

    const bookmarkData = device.bookmarkData
    const deviceId = device.id
    setConnectingDeviceId(deviceId)
    setConnectionError(null)
    setLastFailedDeviceId(null)
    try {
      const success = await connectTcpDevice(bookmarkData.ipAddress, bookmarkData.port)
      if (success) {
        await window.api.wifiBookmarks.updateLastConnected(bookmarkData.id)
        setLastFailedDeviceId(null)
        if (onConnected) {
          onConnected()
        }
      } else {
        const currentDevice = devices.find((d) => d.id === deviceId)
        if (currentDevice?.pingStatus === 'unreachable') {
          setConnectionError(`device ${bookmarkData.ipAddress} is unreachable (offline)`)
        } else {
          setConnectionError(`failed to connect to ${bookmarkData.ipAddress}:${bookmarkData.port}`)
        }
        setLastFailedDeviceId(deviceId)
      }
    } catch {
      setConnectionError(`connection to ${bookmarkData.ipAddress} failed`)
      setLastFailedDeviceId(deviceId)
    } finally {
      setConnectingDeviceId(null)
    }
  }

  const handleDeleteBookmark = async (device: ExtendedDeviceInfo): Promise<void> => {
    if (!hasBookmarkData(device)) return

    const success = await window.api.wifiBookmarks.remove(device.bookmarkData.id)
    if (success) {
      refreshDevices()
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: tokens.spacingVerticalXXL,
        backgroundColor: '#050505'
      }}
    >
      <Card className={styles.card}>
        <CardHeader
          header={
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
              <DeviceMeetingRoomRegular style={{ color: '#f6b012', fontSize: '24px' }} />
              <span className={styles.headerTitle}>meta quest devices</span>
            </div>
          }
          action={
            <div className={styles.headerActions}>
              <Button
                icon={<RefreshIcon />}
                onClick={() => refreshDevices()}
                disabled={isLoading}
                appearance="subtle"
                className={styles.actionButton}
              >
                {isLoading ? 'loading...' : 'refresh'}
              </Button>
              {onSkip && !isConnected && (
                <Button onClick={onSkip} appearance="secondary" className={styles.actionButton}>
                  skip connection
                </Button>
              )}
              {onSkip && isConnected && (
                <Button onClick={onSkip} appearance="primary" className={styles.primaryButton}>
                  continue
                </Button>
              )}
            </div>
          }
        />

        {/* TCP Connection Section */}
        <CardPreview className={styles.tcpSection}>
          <Field label={<span style={{ color: '#f6b012' }}>connect via tcp/ip</span>}>
            <div style={{ display: 'flex', gap: tokens.spacingHorizontalS, alignItems: 'end' }}>
              <Input
                placeholder="ip address (e.g., 192.168.1.100)"
                value={tcpIpAddress}
                onChange={(_, data) => setTcpIpAddress(data.value)}
                style={{ flex: 1 }}
                className={styles.inputField}
              />
              <Input
                placeholder="port"
                value={tcpPort}
                onChange={(_, data) => setTcpPort(data.value)}
                style={{ width: '80px' }}
                className={styles.inputField}
              />
              <Button
                icon={<BookmarkRegular />}
                onClick={handleTcpConnect}
                disabled={!tcpIpAddress.trim() || isTcpConnecting || isLoading}
                appearance="primary"
                className={styles.primaryButton}
              >
                {isTcpConnecting ? 'adding...' : 'add bookmark'}
              </Button>
            </div>
          </Field>
        </CardPreview>

        <CardPreview className={styles.deviceListContainer}>
          {error && <Body1 className={styles.messageArea}>error: {error}</Body1>}
          {!error && isLoading && devices.length === 0 && (
            <div className={styles.messageArea}>
              <Spinner size="small" /> searching for devices...
            </div>
          )}
          {!error && !isLoading && devices.length === 0 && (
            <Body1 className={styles.messageArea}>
              no devices found. ensure device is connected and in adb mode.
            </Body1>
          )}
          {!error && devices.length > 0 && (
            <div style={{ padding: `0 ${tokens.spacingHorizontalM}` }}>
              {devices.map((device) => {
                const isCurrentDeviceConnected = selectedDevice === device.id && isConnected
                const isConnectable = device.type === 'device' || device.type === 'emulator'
                const isKnownQuestDevice = device.isQuestDevice
                const isTcpDevice = device.id.includes(':')
                const isWifiBookmark = isWiFiBookmark(device)
                const isConnectedBookmark = hasBookmarkData(device) && isTcpDevice && isConnectable
                const isConnecting = connectingDeviceId === device.id
                const isAlreadyBookmarked =
                  device.ipAddress && bookmarkedIpAddresses.includes(device.ipAddress)
                const showConnectionError = connectionError && lastFailedDeviceId === device.id

                let deviceStatusMessage = ''
                if (device.type === 'offline') deviceStatusMessage = 'offline'
                else if (device.type === 'unauthorized')
                  deviceStatusMessage = 'unauthorized - check device'
                else if (device.type === 'unknown') deviceStatusMessage = 'unknown state'

                return (
                  <div
                    key={device.id}
                    className={
                      isWifiBookmark || isConnectedBookmark
                        ? styles.wifiBookmarkDevice
                        : styles.deviceItem
                    }
                  >
                    <div className={styles.deviceInfo}>
                      {isWifiBookmark || isConnectedBookmark ? (
                        <Wifi1Regular fontSize={24} style={{ color: '#3c9fdd' }} />
                      ) : (
                        <DeviceMeetingRoomRegular fontSize={24} style={{ color: '#f6b012' }} />
                      )}
                      <div className={styles.deviceText}>
                        <Text weight="semibold" className={styles.deviceId}>
                          {device.friendlyModelName || device.model || device.id}
                        </Text>
                        <Text
                          size={200}
                          className={
                            isWifiBookmark || isConnectedBookmark
                              ? styles.wifiDeviceType
                              : styles.deviceType
                          }
                        >
                          {isWifiBookmark
                            ? 'wifi bookmark'
                            : isConnectedBookmark
                              ? 'wifi device (connected)'
                              : device.friendlyModelName
                                ? device.id
                                : device.type}
                          {!isConnectable && deviceStatusMessage && ` - ${deviceStatusMessage}`}
                        </Text>

                        {/* Warning for connectable non-Quest devices */}
                        {isConnectable &&
                          !isKnownQuestDevice &&
                          !isWifiBookmark &&
                          !isConnectedBookmark && (
                            <div className={styles.warningText}>
                              <WarningRegular fontSize={16} />
                              <Text size={200}>
                                not a recognized quest device. connection may have unintended
                                results.
                              </Text>
                            </div>
                          )}

                        {/* Status for non-connectable devices */}
                        {!isConnectable && deviceStatusMessage && !isWifiBookmark && (
                          <div className={styles.deviceStatusText}>
                            <ErrorCircleRegular fontSize={16} />
                            <Text size={200}>{deviceStatusMessage}</Text>
                          </div>
                        )}

                        {device.batteryLevel !== null && (
                          <div className={styles.deviceDetailsLine}>
                            <BatteryChargeRegular fontSize={16} />
                            <Text size={200}>{device.batteryLevel}%</Text>
                          </div>
                        )}
                        {device.storageFree !== null && device.storageTotal !== null && (
                          <div className={styles.deviceDetailsLine}>
                            <StorageRegular fontSize={16} />
                            <Text size={200}>
                              {`${device.storageFree} free / ${device.storageTotal} total`}
                            </Text>
                          </div>
                        )}

                        {device.ipAddress && (
                          <div className={styles.deviceDetailsLine}>
                            <PlugDisconnectedRegular fontSize={16} />
                            <Text size={200}>ip: {device.ipAddress}</Text>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: tokens.spacingHorizontalXS }}>
                      {/* Bookmark button for devices with IP addresses */}
                      {device.ipAddress && isConnectable && !isTcpDevice && !isWifiBookmark && (
                        <Button
                          icon={<BookmarkRegular />}
                          onClick={() => handleBookmarkDevice(device)}
                          appearance="subtle"
                          size="small"
                          aria-label="bookmark device"
                          disabled={!!isAlreadyBookmarked}
                          className={styles.actionButton}
                        >
                          {isAlreadyBookmarked ? 'bookmarked' : 'bookmark'}
                        </Button>
                      )}

                      {/* Show ping status for WiFi devices */}
                      {(isWifiBookmark || isConnectedBookmark) && device.ipAddress && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: tokens.spacingHorizontalXXS,
                            marginRight: tokens.spacingHorizontalS
                          }}
                        >
                          {device.pingStatus === 'checking' && (
                            <>
                              <ClockRegular fontSize={16} style={{ color: '#3c9fdd' }} />
                              <Text size={200} style={{ color: '#3c9fdd' }}>
                                checking...
                              </Text>
                            </>
                          )}
                          {device.pingStatus === 'reachable' && (
                            <>
                              <CheckmarkCircleRegular fontSize={16} style={{ color: '#22c55e' }} />
                              <Text size={200} style={{ color: '#22c55e' }}>
                                online{' '}
                                {device.pingResponseTime ? `(${device.pingResponseTime}ms)` : ''}
                              </Text>
                            </>
                          )}
                          {device.pingStatus === 'unreachable' && (
                            <>
                              <DisconnectedCircleRegular
                                fontSize={16}
                                style={{ color: '#ef4444' }}
                              />
                              <Text size={200} style={{ color: '#ef4444' }}>
                                offline
                              </Text>
                            </>
                          )}
                        </div>
                      )}

                      {/* Show connection error if any */}
                      {showConnectionError && (
                        <Text
                          size={200}
                          style={{ color: '#ef4444', padding: '10px', maxWidth: '150px' }}
                        >
                          {connectionError}
                        </Text>
                      )}

                      {/* Delete button for WiFi bookmarks */}
                      {(isWifiBookmark || isConnectedBookmark) && (
                        <Button
                          icon={<DismissCircleRegular />}
                          onClick={() => handleDeleteBookmark(device)}
                          appearance="subtle"
                          size="small"
                          aria-label="delete bookmark"
                          className={styles.actionButton}
                        >
                          delete
                        </Button>
                      )}

                      {(isConnectedBookmark && isCurrentDeviceConnected) ||
                      (isTcpDevice && isConnectable && isCurrentDeviceConnected) ? (
                        <Button
                          icon={<DismissCircleRegular />}
                          onClick={async () => {
                            const [ip, port] = device.id.split(':')
                            await disconnectTcpDevice(ip, parseInt(port) || 5555)
                          }}
                          appearance="outline"
                          aria-label="disconnect tcp device"
                          className={styles.actionButton}
                        >
                          disconnect
                        </Button>
                      ) : isCurrentDeviceConnected ? (
                        <Button
                          icon={<DismissCircleRegular />}
                          onClick={disconnectDevice}
                          appearance="outline"
                          aria-label="disconnect device"
                          className={styles.actionButton}
                        >
                          disconnect
                        </Button>
                      ) : isWifiBookmark ? (
                        <Button
                          icon={<PlugConnectedRegular />}
                          onClick={() => handleConnectBookmark(device)}
                          appearance="primary"
                          aria-label="connect to bookmarked device"
                          disabled={isConnecting}
                          className={styles.primaryButton}
                        >
                          {isConnecting ? 'connecting...' : 'connect'}
                        </Button>
                      ) : isConnectable ? (
                        <Button
                          icon={<PlugConnectedRegular />}
                          appearance="primary"
                          onClick={() => handleConnect(device.id)}
                          disabled={isLoading || isConnecting}
                          className={styles.primaryButton}
                        >
                          {isConnecting ? 'connecting...' : 'connect'}
                        </Button>
                      ) : (
                        <Button
                          icon={<PlugDisconnectedRegular />}
                          appearance="outline"
                          disabled={true}
                          className={styles.actionButton}
                        >
                          cannot connect
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardPreview>
      </Card>
    </div>
  )
}

export default DeviceList
