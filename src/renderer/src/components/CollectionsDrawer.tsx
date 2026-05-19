import React, { useState, useCallback, useMemo } from 'react'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  Button,
  makeStyles,
  tokens,
  Text,
  Input,
  Badge,
  Divider,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@fluentui/react-components'
import {
  DismissRegular,
  AddRegular,
  DeleteRegular,
  EditRegular,
  FolderRegular,
  CheckmarkRegular
} from '@fluentui/react-icons'
import { useCollections } from '@renderer/hooks/useCollections'
import { Collection } from '@shared/types'

const COLLECTION_COLORS = [
  '#f6b012', // PKM Yellow
  '#3c9fdd', // PKM Blue
  '#22c55e', // PKM Green
  '#ef4444', // PKM Red
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#f97316', // Orange
  '#06b6d4' // Cyan
]

const useStyles = makeStyles({
  drawerBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalM
  },
  collectionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS
  },
  collectionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    backgroundColor: '#111111',
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#1a1a1a'
    }
  },
  collectionItemSelected: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #f6b012'
  },
  collectionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flex: 1
  },
  collectionColorDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  collectionActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
    opacity: 0.7,
    ':hover': {
      opacity: 1
    }
  },
  actionButton: {
    minWidth: 'auto',
    padding: tokens.spacingVerticalXS
  },
  newCollectionForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingVerticalM,
    backgroundColor: '#111111',
    borderRadius: tokens.borderRadiusMedium
  },
  colorPicker: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap'
  },
  colorOption: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
    ':hover': {
      transform: 'scale(1.1)'
    }
  },
  colorOptionSelected: {
    border: '2px solid #ffffff'
  },
  formActions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    justifyContent: 'flex-end'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    color: '#666666'
  },
  gameCountBadge: {
    marginLeft: 'auto'
  }
})

interface CollectionsDrawerProps {
  open: boolean
  onClose: () => void
  selectedGameId?: string | null // If provided, shows "add to collection" mode
  onCollectionSelect?: (collection: Collection) => void // For filtering by collection
}

const CollectionsDrawer: React.FC<CollectionsDrawerProps> = ({
  open,
  onClose,
  selectedGameId,
  onCollectionSelect
}) => {
  const styles = useStyles()
  const {
    collections,
    createCollection,
    updateCollection,
    deleteCollection,
    addGameToCollection,
    removeGameFromCollection,
    getCollectionsForGame
  } = useCollections()

  const [isCreating, setIsCreating] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newColor, setNewColor] = useState(COLLECTION_COLORS[0])
  const [deleteConfirmCollection, setDeleteConfirmCollection] = useState<Collection | null>(null)

  // Get collections that contain the selected game
  const gameCollections = useMemo(
    () => (selectedGameId ? getCollectionsForGame(selectedGameId) : []),
    [selectedGameId, getCollectionsForGame]
  )
  const gameCollectionIds = useMemo(
    () => new Set(gameCollections.map((c) => c.id)),
    [gameCollections]
  )

  const resetForm = useCallback(() => {
    setNewName('')
    setNewDescription('')
    setNewColor(COLLECTION_COLORS[0])
    setIsCreating(false)
    setEditingCollection(null)
  }, [])

  const handleCreateCollection = useCallback(async () => {
    if (!newName.trim()) return

    await createCollection(newName.trim(), newDescription.trim() || undefined, newColor)
    resetForm()
  }, [newName, newDescription, newColor, createCollection, resetForm])

  const handleUpdateCollection = useCallback(async () => {
    if (!editingCollection || !newName.trim()) return

    await updateCollection(editingCollection.id, {
      name: newName.trim(),
      description: newDescription.trim() || undefined,
      color: newColor
    })
    resetForm()
  }, [editingCollection, newName, newDescription, newColor, updateCollection, resetForm])

  const handleStartEdit = useCallback((collection: Collection) => {
    setEditingCollection(collection)
    setNewName(collection.name)
    setNewDescription(collection.description || '')
    setNewColor(collection.color || COLLECTION_COLORS[0])
    setIsCreating(false)
  }, [])

  const handleDeleteCollection = useCallback(async () => {
    if (!deleteConfirmCollection) return

    await deleteCollection(deleteConfirmCollection.id)
    setDeleteConfirmCollection(null)
  }, [deleteConfirmCollection, deleteCollection])

  const handleToggleGameInCollection = useCallback(
    async (collection: Collection) => {
      if (!selectedGameId) return

      if (gameCollectionIds.has(collection.id)) {
        await removeGameFromCollection(collection.id, selectedGameId)
      } else {
        await addGameToCollection(collection.id, selectedGameId)
      }
    },
    [selectedGameId, gameCollectionIds, addGameToCollection, removeGameFromCollection]
  )

  const handleCollectionClick = useCallback(
    (collection: Collection) => {
      if (selectedGameId) {
        handleToggleGameInCollection(collection)
      } else if (onCollectionSelect) {
        onCollectionSelect(collection)
        onClose()
      }
    },
    [selectedGameId, onCollectionSelect, onClose, handleToggleGameInCollection]
  )

  const renderCollectionForm = (): React.ReactNode => (
    <div className={styles.newCollectionForm}>
      <Input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Collection name"
        autoFocus
      />
      <Input
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        placeholder="Description (optional)"
      />
      <div>
        <Text size={200} style={{ marginBottom: tokens.spacingVerticalXS, display: 'block' }}>
          Color:
        </Text>
        <div className={styles.colorPicker}>
          {COLLECTION_COLORS.map((color) => (
            <button
              key={color}
              className={`${styles.colorOption} ${newColor === color ? styles.colorOptionSelected : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setNewColor(color)}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>
      <div className={styles.formActions}>
        <Button appearance="secondary" onClick={resetForm}>
          Cancel
        </Button>
        <Button
          appearance="primary"
          onClick={editingCollection ? handleUpdateCollection : handleCreateCollection}
          disabled={!newName.trim()}
        >
          {editingCollection ? 'Save' : 'Create'}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Drawer
        type="overlay"
        separator
        open={open}
        onOpenChange={(_, data) => !data.open && onClose()}
        position="end"
        size="medium"
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<DismissRegular />}
                onClick={onClose}
              />
            }
          >
            {selectedGameId ? 'Add to Collection' : 'Collections'}
          </DrawerHeaderTitle>
        </DrawerHeader>

        <DrawerBody className={styles.drawerBody}>
          {!isCreating && !editingCollection && (
            <Button appearance="primary" icon={<AddRegular />} onClick={() => setIsCreating(true)}>
              New Collection
            </Button>
          )}

          {(isCreating || editingCollection) && renderCollectionForm()}

          <Divider />

          {collections.length === 0 ? (
            <div className={styles.emptyState}>
              <FolderRegular fontSize={48} />
              <Text size={300} style={{ marginTop: tokens.spacingVerticalM }}>
                No collections yet
              </Text>
              <Text size={200}>Create a collection to organize your games</Text>
            </div>
          ) : (
            <div className={styles.collectionsList}>
              {collections.map((collection) => {
                const isInCollection = gameCollectionIds.has(collection.id)

                return (
                  <div
                    key={collection.id}
                    className={`${styles.collectionItem} ${isInCollection ? styles.collectionItemSelected : ''}`}
                    onClick={() => handleCollectionClick(collection)}
                  >
                    <div className={styles.collectionInfo}>
                      <div
                        className={styles.collectionColorDot}
                        style={{ backgroundColor: collection.color || COLLECTION_COLORS[0] }}
                      />
                      <div>
                        <Text weight="semibold">{collection.name}</Text>
                        {collection.description && (
                          <Text size={200} style={{ display: 'block', color: '#888888' }}>
                            {collection.description}
                          </Text>
                        )}
                      </div>
                    </div>

                    {selectedGameId && isInCollection && <CheckmarkRegular color="#22c55e" />}

                    <Badge
                      className={styles.gameCountBadge}
                      appearance="outline"
                      color="informative"
                    >
                      {collection.gameIds.length}
                    </Badge>

                    {!selectedGameId && (
                      <div className={styles.collectionActions}>
                        <Button
                          appearance="subtle"
                          icon={<EditRegular />}
                          className={styles.actionButton}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartEdit(collection)
                          }}
                          title="Edit collection"
                        />
                        <Button
                          appearance="subtle"
                          icon={<DeleteRegular />}
                          className={styles.actionButton}
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirmCollection(collection)
                          }}
                          title="Delete collection"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </DrawerBody>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmCollection !== null}
        onOpenChange={(_, data) => !data.open && setDeleteConfirmCollection(null)}
      >
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogContent>
              <Text>
                Are you sure you want to delete &quot;{deleteConfirmCollection?.name}&quot;? This
                action cannot be undone.
              </Text>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setDeleteConfirmCollection(null)}>
                Cancel
              </Button>
              <Button
                appearance="primary"
                style={{ backgroundColor: '#ef4444' }}
                onClick={handleDeleteCollection}
              >
                Delete
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  )
}

export default CollectionsDrawer
