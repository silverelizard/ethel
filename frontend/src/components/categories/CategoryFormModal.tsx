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
} from '@chakra-ui/react'
import type { Category, CategoryPayload } from '@/types/api'
import { normalizeName } from '@/utils/names'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: CategoryPayload) => void
  isLoading: boolean
  category?: Category | null
  /** All categories, to warn about duplicate names before saving. */
  categories: Category[]
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  category,
  categories,
}: CategoryFormModalProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName(category?.name ?? '')
    }
  }, [isOpen, category])

  const isDuplicate =
    name.trim() !== '' &&
    categories.some(
      (c) => c.id !== category?.id && normalizeName(c.name) === normalizeName(name),
    )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name: name.trim() })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>
          {category ? 'Edit Category' : 'New Category'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired isInvalid={isDuplicate}>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Whiskey"
              autoFocus
            />
            <FormErrorMessage>A category with this name already exists</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="brand"
            isLoading={isLoading}
            isDisabled={!name.trim() || isDuplicate}
          >
            {category ? 'Save' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
