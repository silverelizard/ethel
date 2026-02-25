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
  VStack,
} from '@chakra-ui/react'
import type { Storage, StoragePayload } from '@/types/api'

interface StorageFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payload: StoragePayload) => void
  isLoading: boolean
  storage?: Storage | null
}

export default function StorageFormModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  storage,
}: StorageFormModalProps) {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [shelf, setShelf] = useState('')

  useEffect(() => {
    if (isOpen) {
      setName(storage?.name ?? '')
      setRoom(storage?.room ?? '')
      setShelf(storage?.shelf ?? '')
    }
  }, [isOpen, storage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name: name.trim(), room: room.trim(), shelf: shelf.trim() })
  }

  const isValid = name.trim() && room.trim() && shelf.trim()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>
          {storage ? 'Edit Storage' : 'New Storage'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kitchen Cabinet"
                autoFocus
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Room</FormLabel>
              <Input
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Kitchen"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Shelf</FormLabel>
              <Input
                value={shelf}
                onChange={(e) => setShelf(e.target.value)}
                placeholder="e.g. Top"
              />
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
            {storage ? 'Save' : 'Create'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
