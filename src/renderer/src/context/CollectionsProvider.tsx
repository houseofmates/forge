import React, { createContext, useCallback, useEffect, useState } from 'react'
import { Collection, CollectionsData } from '@shared/types'

export interface CollectionsContextType {
  collections: Collection[]
  favorites: string[]
  isLoading: boolean
  error: string | null
  activeCollection: Collection | null
  setActiveCollection: (collection: Collection | null) => void
  // Favorites operations
  addToFavorites: (gameId: string) => Promise<boolean>
  removeFromFavorites: (gameId: string) => Promise<boolean>
  toggleFavorite: (gameId: string) => Promise<boolean>
  isFavorite: (gameId: string) => boolean
  // Collection operations
  createCollection: (
    name: string,
    description?: string,
    color?: string,
    icon?: string
  ) => Promise<Collection | null>
  updateCollection: (
    id: string,
    updates: Partial<Omit<Collection, 'id' | 'createdDate'>>
  ) => Promise<Collection | null>
  deleteCollection: (id: string) => Promise<boolean>
  addGameToCollection: (collectionId: string, gameId: string) => Promise<boolean>
  removeGameFromCollection: (collectionId: string, gameId: string) => Promise<boolean>
  getCollectionsForGame: (gameId: string) => Collection[]
  refreshCollections: () => Promise<void>
}

const defaultContext: CollectionsContextType = {
  collections: [],
  favorites: [],
  isLoading: true,
  error: null,
  activeCollection: null,
  setActiveCollection: () => {},
  addToFavorites: async () => false,
  removeFromFavorites: async () => false,
  toggleFavorite: async () => false,
  isFavorite: () => false,
  createCollection: async () => null,
  updateCollection: async () => null,
  deleteCollection: async () => false,
  addGameToCollection: async () => false,
  removeGameFromCollection: async () => false,
  getCollectionsForGame: () => [],
  refreshCollections: async () => {}
}

// eslint-disable-next-line react-refresh/only-export-components
export const CollectionsContext = createContext<CollectionsContextType>(defaultContext)

interface CollectionsProviderProps {
  children: React.ReactNode
}

export const CollectionsProvider: React.FC<CollectionsProviderProps> = ({ children }) => {
  const [collections, setCollections] = useState<Collection[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null)

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await window.api.collections.getAllData()
      setCollections(data.collections)
      setFavorites(data.favoriteGameIds)
    } catch (err) {
      console.error('[Collections] Error loading collections:', err)
      setError('Failed to load collections')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()

    // Subscribe to updates from main process
    const unsubscribe = window.api.collections.onCollectionsUpdated((data: CollectionsData) => {
      setCollections(data.collections)
      setFavorites(data.favoriteGameIds)
    })

    return () => {
      unsubscribe()
    }
  }, [loadData])

  const addToFavorites = useCallback(async (gameId: string): Promise<boolean> => {
    try {
      const result = await window.api.collections.addToFavorites(gameId)
      if (result) {
        setFavorites((prev) => [...prev, gameId])
      }
      return result
    } catch (err) {
      console.error('[Collections] Error adding to favorites:', err)
      return false
    }
  }, [])

  const removeFromFavorites = useCallback(async (gameId: string): Promise<boolean> => {
    try {
      const result = await window.api.collections.removeFromFavorites(gameId)
      if (result) {
        setFavorites((prev) => prev.filter((id) => id !== gameId))
      }
      return result
    } catch (err) {
      console.error('[Collections] Error removing from favorites:', err)
      return false
    }
  }, [])

  const toggleFavorite = useCallback(async (gameId: string): Promise<boolean> => {
    try {
      const newState = await window.api.collections.toggleFavorite(gameId)
      if (newState) {
        setFavorites((prev) => [...prev, gameId])
      } else {
        setFavorites((prev) => prev.filter((id) => id !== gameId))
      }
      return newState
    } catch (err) {
      console.error('[Collections] Error toggling favorite:', err)
      return false
    }
  }, [])

  const isFavorite = useCallback(
    (gameId: string): boolean => {
      return favorites.includes(gameId)
    },
    [favorites]
  )

  const createCollection = useCallback(
    async (
      name: string,
      description?: string,
      color?: string,
      icon?: string
    ): Promise<Collection | null> => {
      try {
        const collection = await window.api.collections.createCollection(
          name,
          description,
          color,
          icon
        )
        setCollections((prev) => [...prev, collection])
        return collection
      } catch (err) {
        console.error('[Collections] Error creating collection:', err)
        return null
      }
    },
    []
  )

  const updateCollection = useCallback(
    async (
      id: string,
      updates: Partial<Omit<Collection, 'id' | 'createdDate'>>
    ): Promise<Collection | null> => {
      try {
        const updated = await window.api.collections.updateCollection(id, updates)
        if (updated) {
          setCollections((prev) => prev.map((c) => (c.id === id ? updated : c)))
        }
        return updated
      } catch (err) {
        console.error('[Collections] Error updating collection:', err)
        return null
      }
    },
    []
  )

  const deleteCollection = useCallback(async (id: string): Promise<boolean> => {
    try {
      const result = await window.api.collections.deleteCollection(id)
      if (result) {
        setCollections((prev) => prev.filter((c) => c.id !== id))
      }
      return result
    } catch (err) {
      console.error('[Collections] Error deleting collection:', err)
      return false
    }
  }, [])

  const addGameToCollection = useCallback(
    async (collectionId: string, gameId: string): Promise<boolean> => {
      try {
        const result = await window.api.collections.addGameToCollection(collectionId, gameId)
        if (result) {
          setCollections((prev) =>
            prev.map((c) => (c.id === collectionId ? { ...c, gameIds: [...c.gameIds, gameId] } : c))
          )
        }
        return result
      } catch (err) {
        console.error('[Collections] Error adding game to collection:', err)
        return false
      }
    },
    []
  )

  const removeGameFromCollection = useCallback(
    async (collectionId: string, gameId: string): Promise<boolean> => {
      try {
        const result = await window.api.collections.removeGameFromCollection(collectionId, gameId)
        if (result) {
          setCollections((prev) =>
            prev.map((c) =>
              c.id === collectionId ? { ...c, gameIds: c.gameIds.filter((id) => id !== gameId) } : c
            )
          )
        }
        return result
      } catch (err) {
        console.error('[Collections] Error removing game from collection:', err)
        return false
      }
    },
    []
  )

  const getCollectionsForGame = useCallback(
    (gameId: string): Collection[] => {
      return collections.filter((c) => c.gameIds.includes(gameId))
    },
    [collections]
  )

  const refreshCollections = useCallback(async () => {
    await loadData()
  }, [loadData])

  const value: CollectionsContextType = {
    collections,
    favorites,
    isLoading,
    error,
    activeCollection,
    setActiveCollection,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    createCollection,
    updateCollection,
    deleteCollection,
    addGameToCollection,
    removeGameFromCollection,
    getCollectionsForGame,
    refreshCollections
  }

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>
}
