import { useState } from 'react'
import { Button, useDisclosure, useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import PageHeader from '@/components/layout/PageHeader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ErrorAlert from '@/components/shared/ErrorAlert'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import StorageTable from './StorageTable'
import StorageFormModal from './StorageFormModal'
import {
  useStorage,
  useCreateStorage,
  useUpdateStorage,
  useDeleteStorage,
} from '@/hooks/useStorage'
import type { Storage, StoragePayload } from '@/types/api'

export default function StoragePage() {
  const { data: storageList, isLoading, error } = useStorage()
  const createMutation = useCreateStorage()
  const updateMutation = useUpdateStorage()
  const deleteMutation = useDeleteStorage()
  const toast = useToast()

  const formModal = useDisclosure()
  const deleteDialog = useDisclosure()

  const [editing, setEditing] = useState<Storage | null>(null)
  const [deleting, setDeleting] = useState<Storage | null>(null)

  const handleCreate = () => {
    setEditing(null)
    formModal.onOpen()
  }

  const handleEdit = (storage: Storage) => {
    setEditing(storage)
    formModal.onOpen()
  }

  const handleDelete = (storage: Storage) => {
    setDeleting(storage)
    deleteDialog.onOpen()
  }

  const handleFormSubmit = (payload: StoragePayload) => {
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

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={(error as Error).message} />

  return (
    <>
      <PageHeader
        title="Storage"
        action={
          <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={handleCreate}>
            Add Storage
          </Button>
        }
      />

      {storageList && storageList.length > 0 ? (
        <StorageTable
          storageList={storageList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState message="No storage locations yet. Create one to get started." />
      )}

      <StorageFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        storage={editing}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Storage"
        body={`Are you sure you want to delete "${deleting?.name}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
