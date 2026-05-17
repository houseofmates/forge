import React, { useState, useEffect, useRef } from 'react'
import {
  Text,
  Button,
  Input,
  makeStyles,
  tokens,
  Spinner,
  Dropdown,
  Option,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableCellLayout
} from '@fluentui/react-components'
import {
  FolderOpenRegular,
  CheckmarkCircleRegular,
  InfoRegular,
  DeleteRegular,
  ShareRegular,
  SettingsRegular,
  ArrowDownloadRegular,
  ShieldRegular,
  DocumentRegular
} from '@fluentui/react-icons'
import { useSettings } from '../hooks/useSettings'
import { useGames } from '../hooks/useGames'
import { useLogs } from '../hooks/useLogs'
import CollapsibleSection from './ui/CollapsibleSection'

// Supported speed units with conversion factors to KB/s
const SPEED_UNITS = [
  { label: 'KB/s', value: 'kbps', factor: 1 },
  { label: 'MB/s', value: 'mbps', factor: 1024 }
]

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
    position: 'relative',
    height: 'calc(100dvh - 64px)',
    overflowY: 'auto',
    padding: tokens.spacingVerticalXL,
    backgroundColor: '#050505'
  },
  contentContainer: {
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM
  },
  headerTitle: {
    marginBottom: tokens.spacingVerticalXS,
    color: '#f6b012',
    fontSize: '24px',
    fontWeight: 600
  },
  headerSubtitle: {
    color: '#3c9fdd',
    display: 'block',
    marginBottom: tokens.spacingVerticalL,
    fontSize: '14px'
  },
  sectionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalM
  },
  formRow: {
    display: 'flex',
    alignItems: 'center',
    marginTop: tokens.spacingVerticalM,
    gap: tokens.spacingHorizontalM,
    width: '100%'
  },
  input: {
    flexGrow: 1,
    backgroundColor: '#111111',
    border: '1px solid #252525',
    borderRadius: '6px'
  },
  error: {
    color: '#ef4444',
    marginTop: tokens.spacingVerticalXS
  },
  success: {
    color: '#22c55e',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalXS
  },
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalS,
    color: '#3c9fdd',
    fontSize: '12px'
  },
  speedFormRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: tokens.spacingHorizontalL,
    marginTop: tokens.spacingVerticalM,
    width: '100%'
  },
  speedControl: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS
  },
  speedInputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  speedInput: {
    width: '140px',
    flexGrow: 1,
    backgroundColor: '#111111',
    border: '1px solid #252525'
  },
  unitDropdown: {
    width: '90px',
    minWidth: '90px'
  },
  blacklistTable: {
    marginTop: tokens.spacingVerticalM,
    width: '100%',
    backgroundColor: '#0a0a0a',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  emptyState: {
    marginTop: tokens.spacingVerticalL,
    color: '#3c9fdd',
    textAlign: 'center',
    padding: tokens.spacingVerticalL
  },
  actionButton: {
    minWidth: 'auto',
    backgroundColor: '#111111',
    border: '1px solid #252525',
    transition: 'all 200ms cubic-bezier(0.33, 1, 0.68, 1)',
    ':hover': {
      backgroundColor: '#1a1a1a',
      borderBottomColor: '#f6b012',
      borderTopColor: '#f6b012',
      borderLeftColor: '#f6b012',
      borderRightColor: '#f6b012',
      color: '#f6b012'
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
  sectionLabel: {
    color: '#f6b012',
    fontWeight: 500,
    marginBottom: tokens.spacingVerticalXS
  },
  sectionDescription: {
    color: '#ffffff',
    marginBottom: tokens.spacingVerticalM,
    fontSize: '13px'
  }
})

const BlacklistSettings: React.FC = () => {
  const styles = useStyles()
  const { getBlacklistGames, removeGameFromBlacklist } = useGames()
  const [blacklistGames, setBlacklistGames] = useState<
    { packageName: string; version: number | 'any' }[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [removeSuccess, setRemoveSuccess] = useState(false)

  const loadBlacklistGames = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      const games = await getBlacklistGames()
      setBlacklistGames(games)
    } catch {
      setError('failed to load blacklisted games')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBlacklistGames()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRemoveFromBlacklist = async (packageName: string): Promise<void> => {
    try {
      setError(null)
      await removeGameFromBlacklist(packageName)
      await loadBlacklistGames()
      setRemoveSuccess(true)

      setTimeout(() => {
        setRemoveSuccess(false)
      }, 3000)
    } catch {
      setError('failed to remove game from blacklist')
    }
  }

  return (
    <CollapsibleSection
      title="blacklisted games"
      subtitle={`${blacklistGames.length} games`}
      icon={<ShieldRegular style={{ color: '#f6b012' }} />}
    >
      <div className={styles.sectionContent}>
        <Text className={styles.sectionDescription}>
          manage games that will not prompt for uploads
        </Text>

        {isLoading ? (
          <div
            style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacingVerticalL }}
          >
            <Spinner size="small" label="loading blacklisted games..." />
          </div>
        ) : (
          <>
            {blacklistGames.length === 0 ? (
              <div className={styles.emptyState}>
                <Text>no blacklisted games found</Text>
              </div>
            ) : (
              <Table className={styles.blacklistTable}>
                <TableHeader>
                  <TableRow style={{ backgroundColor: '#0a0a0a' }}>
                    <TableHeaderCell style={{ color: '#f6b012' }}>package name</TableHeaderCell>
                    <TableHeaderCell style={{ color: '#f6b012' }}>version</TableHeaderCell>
                    <TableHeaderCell style={{ width: '100px', color: '#f6b012' }}>
                      actions
                    </TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blacklistGames.map((game) => (
                    <TableRow
                      key={`${game.packageName}-${game.version}`}
                      style={{ backgroundColor: '#111111' }}
                    >
                      <TableCell>
                        <TableCellLayout style={{ color: '#ffffff' }}>
                          {game.packageName}
                        </TableCellLayout>
                      </TableCell>
                      <TableCell>
                        <TableCellLayout style={{ color: '#3c9fdd' }}>
                          {game.version === 'any' ? 'all versions' : game.version}
                        </TableCellLayout>
                      </TableCell>
                      <TableCell>
                        <Button
                          icon={<DeleteRegular />}
                          appearance="subtle"
                          className={styles.actionButton}
                          onClick={() => handleRemoveFromBlacklist(game.packageName)}
                          aria-label="remove from blacklist"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {error && <Text className={styles.error}>{error}</Text>}
            {removeSuccess && (
              <Text className={styles.success}>
                <CheckmarkCircleRegular />
                game removed from blacklist successfully
              </Text>
            )}
          </>
        )}
      </div>
    </CollapsibleSection>
  )
}

const LogUploadSettings: React.FC = () => {
  const styles = useStyles()
  const {
    isUploading,
    uploadError,
    uploadSuccess,
    shareableUrl,
    password,
    uploadCurrentLog,
    clearUploadState
  } = useLogs()

  const handleUploadLog = async (): Promise<void> => {
    clearUploadState()
    await uploadCurrentLog()
  }

  const handleCopyUrl = (): void => {
    if (shareableUrl) {
      navigator.clipboard.writeText(shareableUrl)
    }
  }

  const handleCopyPassword = (): void => {
    if (password) {
      navigator.clipboard.writeText(password)
    }
  }

  return (
    <CollapsibleSection
      title="log upload"
      subtitle="share logs for support"
      icon={<DocumentRegular style={{ color: '#f6b012' }} />}
    >
      <div className={styles.sectionContent}>
        <Text className={styles.sectionDescription}>
          upload the current log file to catbox.moe for sharing with support
        </Text>

        <div className={styles.formRow}>
          <Button
            onClick={handleUploadLog}
            appearance="primary"
            size="large"
            disabled={isUploading}
            icon={<ShareRegular />}
            className={styles.primaryButton}
          >
            {isUploading ? 'uploading...' : 'upload current log'}
          </Button>
        </div>

        {uploadError && <Text className={styles.error}>{uploadError}</Text>}

        {uploadSuccess && shareableUrl && (
          <div className={styles.success}>
            <CheckmarkCircleRegular />
            <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS }}>
              <Text>log uploaded successfully!</Text>

              <div
                style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS }}
              >
                <Text weight="semibold" style={{ color: '#f6b012' }}>
                  url:
                </Text>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}
                >
                  <Input
                    value={shareableUrl}
                    readOnly
                    className={styles.input}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px'
                    }}
                  />
                  <Button onClick={handleCopyUrl} size="small" className={styles.actionButton}>
                    copy url
                  </Button>
                </div>
              </div>

              {password && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: tokens.spacingVerticalXS
                  }}
                >
                  <Text weight="semibold" style={{ color: '#f6b012' }}>
                    password:
                  </Text>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: tokens.spacingHorizontalS
                    }}
                  >
                    <Input
                      value={password}
                      readOnly
                      className={styles.input}
                      style={{
                        width: '200px',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    />
                    <Button
                      onClick={handleCopyPassword}
                      size="small"
                      className={styles.actionButton}
                    >
                      copy password
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <Text className={styles.hint}>
          <InfoRegular />
          the uploaded log file will be available on catbox.moe. share only the url with support for
          troubleshooting.
        </Text>
      </div>
    </CollapsibleSection>
  )
}

const Settings: React.FC = () => {
  const styles = useStyles()
  const {
    downloadPath,
    downloadSpeedLimit,
    uploadSpeedLimit,
    isLoading,
    error,
    setDownloadPath,
    setDownloadSpeedLimit,
    setUploadSpeedLimit
  } = useSettings()
  const [editedDownloadPath, setEditedDownloadPath] = useState(downloadPath)

  // New state for speed input values
  const [downloadSpeedInput, setDownloadSpeedInput] = useState(
    downloadSpeedLimit > 0 ? String(downloadSpeedLimit) : ''
  )
  const [uploadSpeedInput, setUploadSpeedInput] = useState(
    uploadSpeedLimit > 0 ? String(uploadSpeedLimit) : ''
  )
  const [downloadSpeedUnit, setDownloadSpeedUnit] = useState(SPEED_UNITS[0].value)
  const [uploadSpeedUnit, setUploadSpeedUnit] = useState(SPEED_UNITS[0].value)

  // Add refs to store original values in KB/s
  const originalDownloadKbps = useRef<number | null>(null)
  const originalUploadKbps = useRef<number | null>(null)

  const [localError, setLocalError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Update local state when the context values change
  useEffect(() => {
    setEditedDownloadPath(downloadPath)

    // Handle new download/upload speed state
    if (downloadSpeedLimit === 0) {
      setDownloadSpeedInput('')
      originalDownloadKbps.current = null
    } else {
      setDownloadSpeedInput(String(downloadSpeedLimit))
      setDownloadSpeedUnit('kbps') // Always reset to KB/s when loading from settings
      originalDownloadKbps.current = downloadSpeedLimit
    }

    if (uploadSpeedLimit === 0) {
      setUploadSpeedInput('')
      originalUploadKbps.current = null
    } else {
      setUploadSpeedInput(String(uploadSpeedLimit))
      setUploadSpeedUnit('kbps') // Always reset to KB/s when loading from settings
      originalUploadKbps.current = uploadSpeedLimit
    }
  }, [downloadPath, downloadSpeedLimit, uploadSpeedLimit])

  const handleSaveDownloadPath = async (): Promise<void> => {
    if (!editedDownloadPath) {
      setLocalError('download path cannot be empty')
      return
    }

    try {
      setLocalError(null)
      setSaveSuccess(false)
      await setDownloadPath(editedDownloadPath)

      // Show success message
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch {
      setLocalError('failed to save download path')
    }
  }

  const handleSaveSpeedLimits = async (): Promise<void> => {
    try {
      setLocalError(null)
      setSaveSuccess(false)

      // Use the stored original KB/s values if available, otherwise calculate
      let downloadLimit: number
      let uploadLimit: number

      if (downloadSpeedInput.trim() === '') {
        downloadLimit = 0
      } else if (originalDownloadKbps.current !== null) {
        downloadLimit = originalDownloadKbps.current
      } else {
        const inputValue = parseFloat(downloadSpeedInput)
        if (isNaN(inputValue)) {
          setLocalError('please enter valid numbers for speed limits')
          return
        }
        const factor = SPEED_UNITS.find((u) => u.value === downloadSpeedUnit)?.factor || 1
        downloadLimit = inputValue * factor
      }

      if (uploadSpeedInput.trim() === '') {
        uploadLimit = 0
      } else if (originalUploadKbps.current !== null) {
        uploadLimit = originalUploadKbps.current
      } else {
        const inputValue = parseFloat(uploadSpeedInput)
        if (isNaN(inputValue)) {
          setLocalError('please enter valid numbers for speed limits')
          return
        }
        const factor = SPEED_UNITS.find((u) => u.value === uploadSpeedUnit)?.factor || 1
        uploadLimit = inputValue * factor
      }

      // Ensure values are non-negative
      downloadLimit = Math.max(0, downloadLimit)
      uploadLimit = Math.max(0, uploadLimit)

      // Round to integer for storage (as the API expects integers)
      const roundedDownloadLimit = Math.round(downloadLimit)
      const roundedUploadLimit = Math.round(uploadLimit)

      await setDownloadSpeedLimit(roundedDownloadLimit)
      await setUploadSpeedLimit(roundedUploadLimit)

      // Show success message
      setSaveSuccess(true)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch {
      setLocalError('failed to save speed limits')
    }
  }

  const handleSelectFolder = async (): Promise<void> => {
    try {
      const selectedPath = await window.api.dialog.showDirectoryPicker()
      if (selectedPath) {
        setEditedDownloadPath(selectedPath)
      }
    } catch {
      setLocalError('failed to select folder')
    }
  }

  // Handle unit conversion when dropdown changes
  const handleDownloadUnitChange = (newUnit: string): void => {
    if (!downloadSpeedInput.trim()) {
      setDownloadSpeedUnit(newUnit)
      return
    }

    const currentValue = parseFloat(downloadSpeedInput)
    if (isNaN(currentValue)) {
      setDownloadSpeedUnit(newUnit)
      return
    }

    const currentUnitValue = SPEED_UNITS.find((u) => u.value === downloadSpeedUnit)
    const newUnitValue = SPEED_UNITS.find((u) => u.value === newUnit)

    if (!currentUnitValue || !newUnitValue) {
      setDownloadSpeedUnit(newUnit)
      return
    }

    // If this is the first unit change, store the original KB/s value
    if (originalDownloadKbps.current === null) {
      if (downloadSpeedUnit === 'kbps') {
        originalDownloadKbps.current = currentValue
      } else {
        originalDownloadKbps.current = currentValue * currentUnitValue.factor
      }
    }

    // Use the original KB/s value for conversions to prevent rounding errors
    if (originalDownloadKbps.current !== null) {
      const valueInNewUnit = originalDownloadKbps.current / newUnitValue.factor

      // Format based on the unit
      let formattedValue: string
      if (newUnit === 'mbps') {
        formattedValue = valueInNewUnit.toFixed(2).replace(/\.?0+$/, '')
        if (formattedValue.endsWith('.')) formattedValue = formattedValue.slice(0, -1)
      } else {
        formattedValue = Math.round(valueInNewUnit).toString()
      }

      setDownloadSpeedInput(formattedValue)
    }

    setDownloadSpeedUnit(newUnit)
  }

  const handleUploadUnitChange = (newUnit: string): void => {
    if (!uploadSpeedInput.trim()) {
      setUploadSpeedUnit(newUnit)
      return
    }

    const currentValue = parseFloat(uploadSpeedInput)
    if (isNaN(currentValue)) {
      setUploadSpeedUnit(newUnit)
      return
    }

    const currentUnitValue = SPEED_UNITS.find((u) => u.value === uploadSpeedUnit)
    const newUnitValue = SPEED_UNITS.find((u) => u.value === newUnit)

    if (!currentUnitValue || !newUnitValue) {
      setUploadSpeedUnit(newUnit)
      return
    }

    if (originalUploadKbps.current === null) {
      if (uploadSpeedUnit === 'kbps') {
        originalUploadKbps.current = currentValue
      } else {
        originalUploadKbps.current = currentValue * currentUnitValue.factor
      }
    }

    if (originalUploadKbps.current !== null) {
      const valueInNewUnit = originalUploadKbps.current / newUnitValue.factor

      let formattedValue: string
      if (newUnit === 'mbps') {
        formattedValue = valueInNewUnit.toFixed(2).replace(/\.?0+$/, '')
        if (formattedValue.endsWith('.')) formattedValue = formattedValue.slice(0, -1)
      } else {
        formattedValue = Math.round(valueInNewUnit).toString()
      }

      setUploadSpeedInput(formattedValue)
    }

    setUploadSpeedUnit(newUnit)
  }

  // Update stored KB/s value when input changes
  const handleDownloadInputChange = (value: string): void => {
    setDownloadSpeedInput(value.replace(/[^0-9.]/g, ''))

    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      if (downloadSpeedUnit === 'kbps') {
        originalDownloadKbps.current = numValue
      } else {
        const factor = SPEED_UNITS.find((u) => u.value === downloadSpeedUnit)?.factor || 1
        originalDownloadKbps.current = numValue * factor
      }
    } else if (value.trim() === '') {
      originalDownloadKbps.current = null
    }
  }

  const handleUploadInputChange = (value: string): void => {
    setUploadSpeedInput(value.replace(/[^0-9.]/g, ''))

    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      if (uploadSpeedUnit === 'kbps') {
        originalUploadKbps.current = numValue
      } else {
        const factor = SPEED_UNITS.find((u) => u.value === uploadSpeedUnit)?.factor || 1
        originalUploadKbps.current = numValue * factor
      }
    } else if (value.trim() === '') {
      originalUploadKbps.current = null
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.contentContainer}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalM }}>
          <SettingsRegular style={{ color: '#f6b012', fontSize: '28px' }} />
          <h2 className={styles.headerTitle}>settings</h2>
          {isLoading && <Spinner size="small" />}
        </div>
        <Text as="p" className={styles.headerSubtitle}>
          configure application preferences and manage your downloads
        </Text>

        {/* Download Settings Section */}
        <CollapsibleSection
          title="download settings"
          subtitle="storage & location"
          icon={<FolderOpenRegular style={{ color: '#f6b012' }} />}
          defaultExpanded={true}
        >
          <div className={styles.sectionContent}>
            <Text className={styles.sectionDescription}>
              set where your games will be downloaded and stored on your device
            </Text>

            <div className={styles.formRow}>
              <Input
                className={styles.input}
                value={editedDownloadPath}
                onChange={(_, data) => setEditedDownloadPath(data.value)}
                placeholder="download path"
                contentAfter={
                  <Button
                    icon={<FolderOpenRegular />}
                    onClick={handleSelectFolder}
                    aria-label="browse folders"
                    appearance="subtle"
                  />
                }
                size="large"
              />
              <Button
                onClick={handleSaveDownloadPath}
                appearance="primary"
                size="large"
                className={styles.primaryButton}
              >
                save path
              </Button>
            </div>
          </div>
        </CollapsibleSection>

        {/* Speed Limits Section */}
        <CollapsibleSection
          title="speed limits"
          subtitle="bandwidth control"
          icon={<ArrowDownloadRegular style={{ color: '#f6b012' }} />}
        >
          <div className={styles.sectionContent}>
            <Text className={styles.sectionDescription}>
              configure download and upload speed limits to manage bandwidth usage
            </Text>

            <div className={styles.speedFormRow}>
              <div className={styles.speedControl}>
                <Text className={styles.sectionLabel}>download speed limit</Text>
                <div className={styles.speedInputGroup}>
                  <Input
                    className={styles.speedInput}
                    value={downloadSpeedInput}
                    onChange={(_, data) => handleDownloadInputChange(data.value)}
                    placeholder="unlimited"
                  />
                  <Dropdown
                    className={styles.unitDropdown}
                    value={SPEED_UNITS.find((u) => u.value === downloadSpeedUnit)?.label}
                    selectedOptions={[downloadSpeedUnit]}
                    onOptionSelect={(_, data) => {
                      if (data.optionValue) {
                        handleDownloadUnitChange(data.optionValue)
                      }
                    }}
                    mountNode={document.getElementById('portal')}
                  >
                    {SPEED_UNITS.map((unit) => (
                      <Option key={unit.value} value={unit.value} text={unit.label}>
                        {unit.label}
                      </Option>
                    ))}
                  </Dropdown>
                </div>
                <Text className={styles.hint}>
                  <InfoRegular />
                  leave empty for unlimited download speed
                </Text>
              </div>

              <div className={styles.speedControl}>
                <Text className={styles.sectionLabel}>upload speed limit</Text>
                <div className={styles.speedInputGroup}>
                  <Input
                    className={styles.speedInput}
                    value={uploadSpeedInput}
                    onChange={(_, data) => handleUploadInputChange(data.value)}
                    placeholder="unlimited"
                  />
                  <Dropdown
                    className={styles.unitDropdown}
                    value={SPEED_UNITS.find((u) => u.value === uploadSpeedUnit)?.label}
                    selectedOptions={[uploadSpeedUnit]}
                    onOptionSelect={(_, data) => {
                      if (data.optionValue) {
                        handleUploadUnitChange(data.optionValue)
                      }
                    }}
                    mountNode={document.getElementById('portal')}
                  >
                    {SPEED_UNITS.map((unit) => (
                      <Option key={unit.value} value={unit.value} text={unit.label}>
                        {unit.label}
                      </Option>
                    ))}
                  </Dropdown>
                </div>
                <Text className={styles.hint}>
                  <InfoRegular />
                  leave empty for unlimited upload speed
                </Text>
              </div>
            </div>

            <div
              className={styles.formRow}
              style={{ justifyContent: 'flex-end', marginTop: tokens.spacingVerticalM }}
            >
              <Button
                onClick={handleSaveSpeedLimits}
                appearance="primary"
                size="large"
                className={styles.primaryButton}
              >
                save speed limits
              </Button>
            </div>
          </div>
        </CollapsibleSection>

        {/* Log Upload Section */}
        <LogUploadSettings />

        {/* Blacklist Section */}
        <BlacklistSettings />

        {/* Status Messages */}
        {(error || localError) && <Text className={styles.error}>{error || localError}</Text>}

        {saveSuccess && (
          <Text className={styles.success}>
            <CheckmarkCircleRegular />
            settings saved successfully
          </Text>
        )}
      </div>
    </div>
  )
}

export default Settings
