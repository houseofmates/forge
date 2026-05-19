import { useContext } from 'react'
import { CollectionsContext, CollectionsContextType } from '../context/CollectionsProvider'

export const useCollections = (): CollectionsContextType => {
  const context = useContext(CollectionsContext)
  if (!context) {
    throw new Error('useCollections must be used within a CollectionsProvider')
  }
  return context
}
