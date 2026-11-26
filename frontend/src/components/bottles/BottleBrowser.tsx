import { Text } from '@chakra-ui/react'
import EmptyState from '@/components/shared/EmptyState'
import BottleTable from './BottleTable'
import BottleFilters from './BottleFilters'
import RandomBottleModal from './RandomBottleModal'
import type { BottleCatalog } from '@/hooks/useBottleCatalog'
import type { Bottle } from '@/types/api'

interface BottleBrowserProps {
  catalog: BottleCatalog
  /** Omit both for a read-only table (public view). */
  onEdit?: (bottle: Bottle) => void
  onDelete?: (bottle: Bottle) => void
  emptyMessage: string
}

/** Filters, result count, bottle table and the random-bottle dialog. */
export default function BottleBrowser({ catalog, onEdit, onDelete, emptyMessage }: BottleBrowserProps) {
  const { bottles, filteredBottles, categories, subCategories, storageList, filters, random } = catalog

  return (
    <>
      {bottles.length > 0 ? (
        <>
          <BottleFilters
            value={filters}
            onChange={catalog.setFilters}
            categories={categories}
            subCategories={subCategories}
            storageList={storageList}
          />
          <Text fontSize="sm" color="text.muted" mb={2} aria-live="polite">
            Showing {filteredBottles.length} of {bottles.length} bottles
          </Text>
          {filteredBottles.length > 0 ? (
            <BottleTable
              bottles={filteredBottles}
              categoryMap={catalog.categoryMap}
              subCategoryMap={catalog.subCategoryMap}
              storageMap={catalog.storageMap}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ) : (
            <EmptyState message="No bottles match these filters." />
          )}
        </>
      ) : (
        <EmptyState message={emptyMessage} />
      )}

      <RandomBottleModal
        key={random.key}
        isOpen={random.isOpen}
        onClose={random.close}
        categories={categories}
        subCategories={subCategories}
        storageList={storageList}
        initialCategoryId={filters.categoryId}
        initialSubCategoryId={filters.subCategoryId}
      />
    </>
  )
}
