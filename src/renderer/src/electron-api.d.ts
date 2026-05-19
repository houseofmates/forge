import { IpcRenderer } from 'electron'
import {
  AdbAPIRenderer,
  DependencyStatus,
  DownloadAPIRenderer,
  GameAPIRenderer,
  SettingsAPIRenderer,
  UploadAPIRenderer,
  UpdateAPIRenderer,
  DependencyAPIRenderer,
  LogsAPIRenderer,
  MirrorAPIRenderer,
  WiFiBookmark,
  Collection,
  CollectionsData
} from '@shared/types'

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
    api: {
      dependency: DependencyAPIRenderer
      adb: AdbAPIRenderer
      games: GameAPIRenderer
      downloads: DownloadAPIRenderer
      settings: SettingsAPIRenderer
      uploads: UploadAPIRenderer
      updates: UpdateAPIRenderer
      logs: LogsAPIRenderer
      mirrors: MirrorAPIRenderer
      dialog: {
        showDirectoryPicker: () => Promise<string | null>
        showFilePicker: (options?: {
          filters?: { name: string; extensions: string[] }[]
        }) => Promise<string | null>
        showManualInstallPicker: () => Promise<string | null>
        showApkFilePicker: () => Promise<string | null>
        showFolderPicker: () => Promise<string | null>
      }
      wifiBookmarks: {
        getAll: () => Promise<WiFiBookmark[]>
        add: (name: string, ipAddress: string, port: number) => Promise<boolean>
        remove: (id: string) => Promise<boolean>
        updateLastConnected: (id: string) => Promise<void>
      }
      collections: {
        getAllData: () => Promise<CollectionsData>
        getFavorites: () => Promise<string[]>
        addToFavorites: (gameId: string) => Promise<boolean>
        removeFromFavorites: (gameId: string) => Promise<boolean>
        toggleFavorite: (gameId: string) => Promise<boolean>
        isFavorite: (gameId: string) => Promise<boolean>
        getCollections: () => Promise<Collection[]>
        getCollection: (id: string) => Promise<Collection | null>
        createCollection: (
          name: string,
          description?: string,
          color?: string,
          icon?: string
        ) => Promise<Collection>
        updateCollection: (
          id: string,
          updates: Partial<Omit<Collection, 'id' | 'createdDate'>>
        ) => Promise<Collection | null>
        deleteCollection: (id: string) => Promise<boolean>
        addGameToCollection: (collectionId: string, gameId: string) => Promise<boolean>
        removeGameFromCollection: (collectionId: string, gameId: string) => Promise<boolean>
        getCollectionsForGame: (gameId: string) => Promise<Collection[]>
        onCollectionsUpdated: (callback: (data: CollectionsData) => void) => () => void
      }
      onDependencyProgress: (
        callback: (status: DependencyStatus, progress: { name: string; percentage: number }) => void
      ) => () => void
      onDependencySetupComplete: (callback: (status: DependencyStatus) => void) => () => void
      onDependencySetupError: (
        callback: (errorInfo: { message: string; status: DependencyStatus }) => void
      ) => () => void
    }
  }
}
