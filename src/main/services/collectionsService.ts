import { app } from 'electron'
import * as fs from 'fs/promises'
import * as path from 'path'
import { EventEmitter } from 'events'
import { randomUUID } from 'crypto'

export interface Collection {
  id: string
  name: string
  description?: string
  gameIds: string[] // Store game packageNames for reference
  createdDate: string // ISO string for JSON serialization
  modifiedDate: string
  color?: string
  icon?: string
}

export interface CollectionsData {
  collections: Collection[]
  favoriteGameIds: string[] // packageNames of favorited games
}

const DEFAULT_DATA: CollectionsData = {
  collections: [],
  favoriteGameIds: []
}

class CollectionsService extends EventEmitter {
  private dataPath: string
  private data: CollectionsData = { ...DEFAULT_DATA }
  private saveQueue: Promise<void> = Promise.resolve()
  private initialized = false

  constructor() {
    super()
    this.dataPath = path.join(app.getPath('userData'), 'collections.json')
  }

  async initialize(): Promise<void> {
    if (this.initialized) return
    await this.loadData()
    this.initialized = true
  }

  private async loadData(): Promise<void> {
    try {
      const fileContent = await fs.readFile(this.dataPath, 'utf-8')
      const parsed = JSON.parse(fileContent) as CollectionsData
      this.data = {
        collections: parsed.collections || [],
        favoriteGameIds: parsed.favoriteGameIds || []
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        // File doesn't exist yet, use defaults
        this.data = { ...DEFAULT_DATA }
        await this.saveData()
      } else {
        console.error('[Collections] Error loading collections:', error)
        this.data = { ...DEFAULT_DATA }
      }
    }
  }

  private async saveData(): Promise<void> {
    this.saveQueue = this.saveQueue
      .then(async () => {
        try {
          await fs.writeFile(this.dataPath, JSON.stringify(this.data, null, 2), 'utf-8')
          this.emit('collections-updated', this.data)
        } catch (error) {
          console.error('[Collections] Error saving collections:', error)
        }
      })
      .catch((error) => {
        console.error('[Collections] Error in save queue:', error)
      })

    return this.saveQueue
  }

  // Favorites methods
  async getFavorites(): Promise<string[]> {
    await this.initialize()
    return [...this.data.favoriteGameIds]
  }

  async addToFavorites(gameId: string): Promise<boolean> {
    await this.initialize()
    if (this.data.favoriteGameIds.includes(gameId)) {
      return false // Already favorited
    }
    this.data.favoriteGameIds.push(gameId)
    await this.saveData()
    return true
  }

  async removeFromFavorites(gameId: string): Promise<boolean> {
    await this.initialize()
    const index = this.data.favoriteGameIds.indexOf(gameId)
    if (index === -1) {
      return false // Not in favorites
    }
    this.data.favoriteGameIds.splice(index, 1)
    await this.saveData()
    return true
  }

  async isFavorite(gameId: string): Promise<boolean> {
    await this.initialize()
    return this.data.favoriteGameIds.includes(gameId)
  }

  async toggleFavorite(gameId: string): Promise<boolean> {
    const isFav = await this.isFavorite(gameId)
    if (isFav) {
      await this.removeFromFavorites(gameId)
      return false
    } else {
      await this.addToFavorites(gameId)
      return true
    }
  }

  // Collections methods
  async getCollections(): Promise<Collection[]> {
    await this.initialize()
    return [...this.data.collections]
  }

  async getCollection(id: string): Promise<Collection | null> {
    await this.initialize()
    return this.data.collections.find((c) => c.id === id) || null
  }

  async createCollection(
    name: string,
    description?: string,
    color?: string,
    icon?: string
  ): Promise<Collection> {
    await this.initialize()

    const now = new Date().toISOString()
    const collection: Collection = {
      id: randomUUID(),
      name: name.toLowerCase(), // PKM aesthetic: lowercase
      description,
      gameIds: [],
      createdDate: now,
      modifiedDate: now,
      color,
      icon
    }

    this.data.collections.push(collection)
    await this.saveData()
    return collection
  }

  async updateCollection(
    id: string,
    updates: Partial<Omit<Collection, 'id' | 'createdDate'>>
  ): Promise<Collection | null> {
    await this.initialize()

    const index = this.data.collections.findIndex((c) => c.id === id)
    if (index === -1) {
      return null
    }

    const collection = this.data.collections[index]
    this.data.collections[index] = {
      ...collection,
      ...updates,
      modifiedDate: new Date().toISOString()
    }

    await this.saveData()
    return this.data.collections[index]
  }

  async deleteCollection(id: string): Promise<boolean> {
    await this.initialize()

    const index = this.data.collections.findIndex((c) => c.id === id)
    if (index === -1) {
      return false
    }

    this.data.collections.splice(index, 1)
    await this.saveData()
    return true
  }

  async addGameToCollection(collectionId: string, gameId: string): Promise<boolean> {
    await this.initialize()

    const collection = this.data.collections.find((c) => c.id === collectionId)
    if (!collection) {
      return false
    }

    if (collection.gameIds.includes(gameId)) {
      return false // Already in collection
    }

    collection.gameIds.push(gameId)
    collection.modifiedDate = new Date().toISOString()
    await this.saveData()
    return true
  }

  async removeGameFromCollection(collectionId: string, gameId: string): Promise<boolean> {
    await this.initialize()

    const collection = this.data.collections.find((c) => c.id === collectionId)
    if (!collection) {
      return false
    }

    const index = collection.gameIds.indexOf(gameId)
    if (index === -1) {
      return false // Not in collection
    }

    collection.gameIds.splice(index, 1)
    collection.modifiedDate = new Date().toISOString()
    await this.saveData()
    return true
  }

  async getCollectionsForGame(gameId: string): Promise<Collection[]> {
    await this.initialize()
    return this.data.collections.filter((c) => c.gameIds.includes(gameId))
  }

  // Get all data for initial load
  async getAllData(): Promise<CollectionsData> {
    await this.initialize()
    return {
      collections: [...this.data.collections],
      favoriteGameIds: [...this.data.favoriteGameIds]
    }
  }
}

export const collectionsService = new CollectionsService()
