import React, { useMemo } from 'react'
import { Button, makeStyles, Text, tokens, Badge } from '@fluentui/react-components'
import {
  ArrowDownloadRegular,
  CheckboxCheckedRegular,
  DeleteRegular,
  DismissRegular,
  FolderAddRegular
} from '@fluentui/react-icons'
import { GameInfo } from '@shared/types'

const useStyles = makeStyles({
  batchBar: {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    backgroundColor: '#1a1a1a',
    borderRadius: tokens.borderRadiusXLarge,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
    borderTopColor: '#f6b012',
    borderTopWidth: '2px',
    borderTopStyle: 'solid',
    borderRightColor: '#333333',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    borderBottomColor: '#333333',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderLeftColor: '#333333',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    zIndex: 1000,
    animation: 'slideUp 0.2s ease-out'
  },
  selectionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    paddingRight: tokens.spacingHorizontalM,
    borderRightColor: '#333333',
    borderRightWidth: '1px',
    borderRightStyle: 'solid'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  closeButton: {
    marginLeft: tokens.spacingHorizontalS
  }
})

interface BatchActionBarProps {
  selectedGames: GameInfo[]
  onDownloadAll: () => void
  onInstallAll: () => void
  onUninstallAll: () => void
  onAddToCollection: () => void
  onClearSelection: () => void
  isConnected: boolean
  isBusy: boolean
}

const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedGames,
  onDownloadAll,
  onInstallAll,
  onUninstallAll,
  onAddToCollection,
  onClearSelection,
  isConnected,
  isBusy
}) => {
  const styles = useStyles()

  const totalSize = useMemo(() => {
    let bytes = 0
    selectedGames.forEach((game) => {
      const sizeStr = game.size
      if (sizeStr) {
        const match = sizeStr.match(/^([\d.]+)\s*(GB|MB|KB)?$/i)
        if (match) {
          const value = parseFloat(match[1])
          const unit = (match[2] || 'MB').toUpperCase()
          switch (unit) {
            case 'GB':
              bytes += value * 1024 * 1024 * 1024
              break
            case 'MB':
              bytes += value * 1024 * 1024
              break
            case 'KB':
              bytes += value * 1024
              break
          }
        }
      }
    })

    if (bytes >= 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
    } else if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    } else {
      return `${(bytes / 1024).toFixed(2)} KB`
    }
  }, [selectedGames])

  const installedCount = useMemo(
    () => selectedGames.filter((g) => g.isInstalled).length,
    [selectedGames]
  )

  if (selectedGames.length === 0) {
    return null
  }

  return (
    <div className={styles.batchBar}>
      <div className={styles.selectionInfo}>
        <Badge appearance="filled" color="brand">
          {selectedGames.length}
        </Badge>
        <Text size={300}>selected</Text>
        <Text size={200} style={{ color: '#888888' }}>
          ({totalSize})
        </Text>
      </div>

      <div className={styles.actions}>
        <Button
          appearance="subtle"
          icon={<ArrowDownloadRegular />}
          onClick={onDownloadAll}
          disabled={isBusy}
          title="Download all selected games"
        >
          Download
        </Button>

        {isConnected && (
          <>
            <Button
              appearance="subtle"
              icon={<CheckboxCheckedRegular />}
              onClick={onInstallAll}
              disabled={isBusy}
              title="Install all downloaded games to device"
            >
              Install
            </Button>

            <Button
              appearance="subtle"
              icon={<DeleteRegular />}
              onClick={onUninstallAll}
              disabled={isBusy || installedCount === 0}
              title={`Uninstall ${installedCount} games from device`}
            >
              Uninstall ({installedCount})
            </Button>
          </>
        )}

        <Button
          appearance="subtle"
          icon={<FolderAddRegular />}
          onClick={onAddToCollection}
          title="Add selected games to a collection"
        >
          Add to Collection
        </Button>
      </div>

      <Button
        appearance="subtle"
        icon={<DismissRegular />}
        onClick={onClearSelection}
        className={styles.closeButton}
        title="Clear selection"
        aria-label="Clear selection"
      />
    </div>
  )
}

export default BatchActionBar
