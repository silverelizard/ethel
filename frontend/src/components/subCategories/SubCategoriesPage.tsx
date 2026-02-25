import { useMemo, useState } from 'react'
import { Button, useDisclosure, useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import PageHeader from '@/components/layout/PageHeader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ErrorAlert from '@/components/shared/ErrorAlert'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import SubCategoryTable from './SubCategoryTable'
import SubCategoryFormModal from './SubCategoryFormModal'
import {
  useSubCategories,
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
} from '@/hooks/useSubCategories'
import { useCategories } from '@/hooks/useCategories'
import type { SubCategory, SubCategoryPayload } from '@/types/api'

export default function SubCategoriesPage() {
  const { data: subCategories, isLoading: scLoading, error: scError } = useSubCategories()
  const { data: categories, isLoading: catLoading, error: catError } = useCategories()
  const createMutation = useCreateSubCategory()
  const updateMutation = useUpdateSubCategory()
  const deleteMutation = useDeleteSubCategory()
  const toast = useToast()

  const formModal = useDisclosure()
  const deleteDialog = useDisclosure()

  const [editing, setEditing] = useState<SubCategory | null>(null)
  const [deleting, setDeleting] = useState<SubCategory | null>(null)

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>()
    categories?.forEach((c) => map.set(c.id, c.name))
    return map
  }, [categories])

  const handleCreate = () => {
    setEditing(null)
    formModal.onOpen()
  }

  const handleEdit = (sc: SubCategory) => {
    setEditing(sc)
    formModal.onOpen()
  }

  const handleDelete = (sc: SubCategory) => {
    setDeleting(sc)
    deleteDialog.onOpen()
  }

  const handleFormSubmit = (payload: SubCategoryPayload) => {
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

  const isLoading = scLoading || catLoading
  const error = scError || catError

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={(error as Error).message} />

  return (
    <>
      <PageHeader
        title="Sub-Categories"
        action={
          <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={handleCreate}>
            Add Sub-Category
          </Button>
        }
      />

      {subCategories && subCategories.length > 0 ? (
        <SubCategoryTable
          subCategories={subCategories}
          categoryMap={categoryMap}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState message="No sub-categories yet. Create one to get started." />
      )}

      <SubCategoryFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        subCategory={editing}
        categories={categories ?? []}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Sub-Category"
        body={`Are you sure you want to delete "${deleting?.name}"? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </>
  )
}
