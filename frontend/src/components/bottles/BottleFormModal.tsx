import { useEffect, useMemo, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Checkbox,
  CheckboxGroup,
  Stack,
  Text,
} from '@chakra-ui/react'
import type {
  Bottle,
  BottlePayload,
  Category,
  SubCategory,
  Storage,
} from '@/types/api'

interface BottleFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: BottlePayload) => void
  isLoading: boolean
  bottle?: Bottle | null
  categories: Category[]
  subCategories: SubCategory[]
  storageList: Storage[]
}

export default function BottleFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  bottle,
  categories,
  subCategories,
  storageList,
}: BottleFormModalProps) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [selectedSubCatIds, setSelectedSubCatIds] = useState<string[]>([])
  const [storageId, setStorageId] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      setName(bottle?.name ?? '')
      setCategoryId(bottle?.category_id?.toString() ?? '')
      setSelectedSubCatIds(bottle?.sub_category_ids?.map(String) ?? [])
      setStorageId(bottle?.storage_id?.toString() ?? '')
    }
  }, [isOpen, bottle])

  const filteredSubCategories = useMemo(
    () =>
      categoryId
        ? subCategories.filter((sc) => sc.category_id === Number(categoryId))
        : [],
    [categoryId, subCategories],
  )

  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId)
    // Clear sub-category selections that don't belong to the new category
    const validIds = new Set(
      subCategories
        .filter((sc) => sc.category_id === Number(newCatId))
        .map((sc) => sc.id.toString()),
    )
    setSelectedSubCatIds((prev) => prev.filter((id) => validIds.has(id)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: name.trim(),
      category_id: Number(categoryId),
      sub_category_ids: selectedSubCatIds.map(Number),
      storage_id: Number(storageId),
    })
  }

  const isValid = name.trim() && categoryId && storageId

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>{bottle ? 'Edit Bottle' : 'New Bottle'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Maker's Mark"
                autoFocus
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="Select category"
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Sub-Categories</FormLabel>
              {filteredSubCategories.length > 0 ? (
                <CheckboxGroup
                  value={selectedSubCatIds}
                  onChange={(vals) => setSelectedSubCatIds(vals as string[])}
                >
                  <Stack spacing={2}>
                    {filteredSubCategories.map((sc) => (
                      <Checkbox key={sc.id} value={sc.id.toString()}>
                        {sc.name}
                      </Checkbox>
                    ))}
                  </Stack>
                </CheckboxGroup>
              ) : (
                <Text color="gray.500" fontSize="sm">
                  {categoryId
                    ? 'No sub-categories for this category'
                    : 'Select a category first'}
                </Text>
              )}
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Storage Location</FormLabel>
              <Select
                placeholder="Select storage"
                value={storageId}
                onChange={(e) => setStorageId(e.target.value)}
              >
                {storageList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.room} — {s.shelf})
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="brand"
            isLoading={isLoading}
            isDisabled={!isValid}
          >
            {bottle ? 'Save' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
