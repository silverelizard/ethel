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
  FormLabel,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react'
import type { SubCategory, SubCategoryPayload, Category } from '@/types/api'

interface SubCategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: SubCategoryPayload) => void
  isLoading: boolean
  subCategory?: SubCategory | null
  categories: Category[]
}

export default function SubCategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  subCategory,
  categories,
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

  const isValid = name.trim() && categoryId

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
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bourbon"
                autoFocus
              />
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
