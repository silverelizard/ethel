import { useState } from 'react'
import { Button, HStack, useDisclosure, useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import PageHeader from '@/components/layout/PageHeader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ErrorAlert from '@/components/shared/ErrorAlert'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import BottleFormModal from './BottleFormModal'
import BottleBrowser from './BottleBrowser'
import RandomBottleButton from './RandomBottleButton'
import { useCreateBottle, useUpdateBottle, useDeleteBottle } from '@/hooks/useBottles'
import { useBottleCatalog } from '@/hooks/useBottleCatalog'
import type { Bottle, BottlePayload } from '@/types/api'

/** Admin bottles page: browsing plus add, edit and delete. */
export default function BottlesPage() {
  const catalog = useBottleCatalog()

  const createMutation = useCreateBottle()
  const updateMutation = useUpdateBottle()
  const deleteMutation = useDeleteBottle()
  const toast = useToast()

  const formModal = useDisclosure()
  const deleteDialog = useDisclosure()

  const [editing, setEditing] = useState<Bottle | null>(null)
  const [deleting, setDeleting] = useState<Bottle | null>(null)

  const handleCreate = () => {
    setEditing(null)
    formModal.onOpen()
  }

  const handleEdit = (bottle: Bottle) => {
    setEditing(bottle)
    formModal.onOpen()
  }

  const handleDelete = (bottle: Bottle) => {
    setDeleting(bottle)
    deleteDialog.onOpen()
  }

  const handleFormSubmit = (payload: BottlePayload) => {
    const mutation = editing
      ? updateMutation.mutateAsync({ id: editing.id, payload })
      : createMutation.mutateAsync(payload)

    mutation.then(() => formModal.onClose()).catch((err: Error) => {
      toast({ title: 'Error', description: err.message, status: 'error' })
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleting) return
    deleteMutation
      .mutateAsync(deleting.id)
      .then(() => deleteDialog.onClose())
      .catch((err: Error) => {
        toast({ title: 'Delete failed', description: err.message, status: 'error' })
      })
  }

  if (catalog.isLoading) return <LoadingSpinner />
  if (catalog.error) return <ErrorAlert message={(catalog.error as Error).message} />

  return (
    <>
      <PageHeader
        title="Bottles"
        action={
          <HStack spacing={2}>
            <RandomBottleButton catalog={catalog} />
            <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={handleCreate}>
              Add Bottle
            </Button>
          </HStack>
        }
      />

      <BottleBrowser
        catalog={catalog}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No bottles yet. Add one to get started."
      />

      <BottleFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        bottle={editing}
        categories={catalog.categories}
        subCategories={catalog.subCategories}
        storageList={catalog.storageList}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Bottle"
        body={`Are you sure you want to delete "${deleting?.name}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
