import { useMemo, useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { useBottles } from '@/hooks/useBottles'
import { useCategories } from '@/hooks/useCategories'
import { useSubCategories } from '@/hooks/useSubCategories'
import { useStorage } from '@/hooks/useStorage'
import {
  EMPTY_FILTERS,
  filterBottles,
  type BottleFilterState,
} from '@/components/bottles/filterBottles'

function nameMap(items: { id: number; name: string }[] | undefined) {
  const map = new Map<number, string>()
  items?.forEach((item) => map.set(item.id, item.name))
  return map
}

/**
 * Everything needed to browse bottles: the data, id -> name lookups, filter
 * state, and the random-bottle dialog. Shared by the admin and public pages.
 */
export function useBottleCatalog() {
  const bottles = useBottles()
  const categories = useCategories()
  const subCategories = useSubCategories()
  const storage = useStorage()

  const [filters, setFilters] = useState<BottleFilterState>(EMPTY_FILTERS)

  const randomDisclosure = useDisclosure()
  // New key per open, so the dialog starts from the current filters.
  const [randomKey, setRandomKey] = useState(0)

  const filteredBottles = useMemo(
    () => filterBottles(bottles.data ?? [], filters),
    [bottles.data, filters],
  )
  const categoryMap = useMemo(() => nameMap(categories.data), [categories.data])
  const subCategoryMap = useMemo(() => nameMap(subCategories.data), [subCategories.data])
  const storageMap = useMemo(() => nameMap(storage.data), [storage.data])

  return {
    bottles: bottles.data ?? [],
    categories: categories.data ?? [],
    subCategories: subCategories.data ?? [],
    storageList: storage.data ?? [],
    isLoading: bottles.isLoading || categories.isLoading || subCategories.isLoading || storage.isLoading,
    error: bottles.error || categories.error || subCategories.error || storage.error,
    filters,
    setFilters,
    filteredBottles,
    categoryMap,
    subCategoryMap,
    storageMap,
    random: {
      key: randomKey,
      isOpen: randomDisclosure.isOpen,
      open: () => {
        setRandomKey((k) => k + 1)
        randomDisclosure.onOpen()
      },
      close: randomDisclosure.onClose,
    },
  }
}

export type BottleCatalog = ReturnType<typeof useBottleCatalog>
