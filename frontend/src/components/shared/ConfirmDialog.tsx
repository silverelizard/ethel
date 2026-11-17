import { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  body: string
  isLoading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  isLoading,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{body}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={onConfirm}
              ml={3}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
