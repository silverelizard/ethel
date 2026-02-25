import { useState } from 'react'
import { Button, useDisclosure, useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import PageHeader from '@/components/layout/PageHeader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ErrorAlert from '@/components/shared/ErrorAlert'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import CategoryTable from './CategoryTable'
import CategoryFormModal from './CategoryFormModal'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories'
import type { Category, CategoryPayload } from '@/types/api'

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useCategories()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()
  const toast = useToast()

  const formModal = useDisclosure()
  const deleteDialog = useDisclosure()

  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  const handleCreate = () => {
    setEditing(null)
    formModal.onOpen()
  }

  const handleEdit = (category: Category) => {
    setEditing(category)
    formModal.onOpen()
  }

  const handleDelete = (category: Category) => {
    setDeleting(category)
    deleteDialog.onOpen()
  }

  const handleFormSubmit = (payload: CategoryPayload) => {
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
        title="Categories"
        action={
          <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={handleCreate}>
            Add Category
          </Button>
        }
      />

      {categories && categories.length > 0 ? (
        <CategoryTable
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState message="No categories yet. Create one to get started." />
      )}

      <CategoryFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        category={editing}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        body={`Are you sure you want to delete "${deleting?.name}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
