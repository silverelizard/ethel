import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Tag,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import ErrorAlert from '@/components/shared/ErrorAlert'
import { useRandomBottle } from '@/hooks/useBottles'
import type { Category, Storage, SubCategory } from '@/types/api'

interface RandomBottleModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  subCategories: SubCategory[]
  storageList: Storage[]
  /** Starting selections, e.g. the page's current filters. */
  initialCategoryId: number | null
  initialSubCategoryId: number | null
}

const toId = (v: string) => (v === '' ? null : Number(v))

/**
 * Mount with a fresh `key` each time it opens so the selections start from
 * the initial values.
 */
export default function RandomBottleModal({
  isOpen,
  onClose,
  categories,
  subCategories,
  storageList,
  initialCategoryId,
  initialSubCategoryId,
}: RandomBottleModalProps) {
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [subCategoryId, setSubCategoryId] = useState(initialSubCategoryId)
  const pick = useRandomBottle()

  const subCategoryOptions =
    categoryId == null ? subCategories : subCategories.filter((sc) => sc.category_id === categoryId)

  const handleCategoryChange = (id: number | null) => {
    setCategoryId(id)
    const sub = subCategories.find((sc) => sc.id === subCategoryId)
    if (id != null && sub && sub.category_id !== id) setSubCategoryId(null)
    pick.reset()
  }

  const handleSubCategoryChange = (id: number | null) => {
    setSubCategoryId(id)
    pick.reset()
  }

  const bottle = pick.data
  const category = categories.find((c) => c.id === bottle?.category_id)
  const storage = storageList.find((s) => s.id === bottle?.storage_id)
  const bottleSubCategories = subCategories.filter((sc) =>
    (bottle?.sub_category_ids ?? []).includes(sc.id),
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Random bottle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="Any category"
                value={categoryId ?? ''}
                onChange={(e) => handleCategoryChange(toId(e.target.value))}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Sub-category</FormLabel>
              <Select
                placeholder="Any sub-category"
                value={subCategoryId ?? ''}
                onChange={(e) => handleSubCategoryChange(toId(e.target.value))}
              >
                {subCategoryOptions.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {pick.error && <ErrorAlert message={pick.error.message} />}

            {bottle && (
              <Box borderWidth="1px" borderRadius="md" p={4} bg="accent.subtle" borderColor="border.subtle" aria-live="polite">
                <Heading size="md" mb={2}>
                  {bottle.name}
                </Heading>
                <Text color="text.subtle">{category?.name ?? 'Unknown category'}</Text>
                {bottleSubCategories.length > 0 && (
                  <Wrap spacing={1} mt={2}>
                    {bottleSubCategories.map((sc) => (
                      <WrapItem key={sc.id}>
                        <Tag size="sm" colorScheme="brand" variant="subtle">
                          {sc.name}
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                )}
                <Text mt={3} fontSize="sm" color="text.muted">
                  {storage
                    ? `${storage.name} · ${storage.room}, shelf ${storage.shelf}`
                    : 'Unknown storage location'}
                </Text>
              </Box>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="brand"
            isLoading={pick.isPending}
            onClick={() => pick.mutate({ categoryId, subCategoryId })}
          >
            {bottle ? 'Pick another' : 'Pick a bottle'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
