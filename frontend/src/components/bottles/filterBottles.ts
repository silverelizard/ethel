import type { Bottle } from '@/types/api'

export interface BottleFilterState {
  search: string
  categoryId: number | null
  subCategoryId: number | null
  storageId: number | null
}

export const EMPTY_FILTERS: BottleFilterState = {
  search: '',
  categoryId: null,
  subCategoryId: null,
  storageId: null,
}

export function hasActiveFilters(f: BottleFilterState): boolean {
  return f.search.trim() !== '' || f.categoryId != null || f.subCategoryId != null || f.storageId != null
}

/** Case-insensitive name search combined (AND) with the dropdown filters. */
export function filterBottles(bottles: Bottle[], f: BottleFilterState): Bottle[] {
  const search = f.search.trim().toLowerCase()
  return bottles.filter(
    (b) =>
      (search === '' || b.name.toLowerCase().includes(search)) &&
      (f.categoryId == null || b.category_id === f.categoryId) &&
      (f.subCategoryId == null || (b.sub_category_ids ?? []).includes(f.subCategoryId)) &&
      (f.storageId == null || b.storage_id === f.storageId),
  )
}
