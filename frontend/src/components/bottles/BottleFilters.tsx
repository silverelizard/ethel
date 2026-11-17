import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Stack,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import type { Category, Storage, SubCategory } from '@/types/api'
import { EMPTY_FILTERS, hasActiveFilters, type BottleFilterState } from './filterBottles'

interface BottleFiltersProps {
  value: BottleFilterState
  onChange: (value: BottleFilterState) => void
  categories: Category[]
  subCategories: SubCategory[]
  storageList: Storage[]
}

const toId = (v: string) => (v === '' ? null : Number(v))

export default function BottleFilters({
  value,
  onChange,
  categories,
  subCategories,
  storageList,
}: BottleFiltersProps) {
  // Only offer sub-categories of the selected category (all, if none selected).
  const subCategoryOptions =
    value.categoryId == null
      ? subCategories
      : subCategories.filter((sc) => sc.category_id === value.categoryId)

  const setCategory = (categoryId: number | null) => {
    // Drop a sub-category filter that doesn't belong to the new category.
    const sub = subCategories.find((sc) => sc.id === value.subCategoryId)
    const keepSub = categoryId == null || sub?.category_id === categoryId
    onChange({ ...value, categoryId, subCategoryId: keepSub ? value.subCategoryId : null })
  }

  return (
    <Stack direction={{ base: 'column', md: 'row' }} spacing={3} mb={4}>
      <InputGroup flex={2}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search bottles by name"
          aria-label="Search bottles by name"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </InputGroup>

      <Select
        flex={1}
        aria-label="Filter by category"
        placeholder="All categories"
        value={value.categoryId ?? ''}
        onChange={(e) => setCategory(toId(e.target.value))}
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select
        flex={1}
        aria-label="Filter by sub-category"
        placeholder="All sub-categories"
        value={value.subCategoryId ?? ''}
        onChange={(e) => onChange({ ...value, subCategoryId: toId(e.target.value) })}
      >
        {subCategoryOptions.map((sc) => (
          <option key={sc.id} value={sc.id}>
            {sc.name}
          </option>
        ))}
      </Select>

      <Select
        flex={1}
        aria-label="Filter by storage location"
        placeholder="All storage"
        value={value.storageId ?? ''}
        onChange={(e) => onChange({ ...value, storageId: toId(e.target.value) })}
      >
        {storageList.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </Select>

      <Button
        variant="ghost"
        onClick={() => onChange(EMPTY_FILTERS)}
        isDisabled={!hasActiveFilters(value)}
        flexShrink={0}
      >
        Clear
      </Button>
    </Stack>
  )
}
