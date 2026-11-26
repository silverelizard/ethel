import { useEffect, useState } from 'react'
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
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react'
import type { SubCategory, SubCategoryPayload, Category } from '@/types/api'
import { normalizeName } from '@/utils/names'

interface SubCategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: SubCategoryPayload) => void
  isLoading: boolean
  subCategory?: SubCategory | null
  categories: Category[]
  /** All sub-categories, to warn about duplicate names before saving. */
  subCategories: SubCategory[]
}

export default function SubCategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  subCategory,
  categories,
  subCategories,
}: SubCategoryFormModalProps) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      setName(subCategory?.name ?? '')
      setCategoryId(subCategory?.category_id?.toString() ?? '')
    }
  }, [isOpen, subCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name: name.trim(), category_id: Number(categoryId) })
  }

  // Names only need to be unique within their category.
  const isDuplicate =
    name.trim() !== '' &&
    categoryId !== '' &&
    subCategories.some(
      (sc) =>
        sc.id !== subCategory?.id &&
        sc.category_id === Number(categoryId) &&
        normalizeName(sc.name) === normalizeName(name),
    )

  const isValid = name.trim() && categoryId && !isDuplicate

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>
          {subCategory ? 'Edit Sub-Category' : 'New Sub-Category'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired isInvalid={isDuplicate}>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bourbon"
                autoFocus
              />
              <FormErrorMessage>This category already has a sub-category with this name</FormErrorMessage>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="Select category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
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
            {subCategory ? 'Save' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
