import { useMemo, useState } from 'react'
import { Button, useDisclosure, useToast } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import PageHeader from '@/components/layout/PageHeader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ErrorAlert from '@/components/shared/ErrorAlert'
import EmptyState from '@/components/shared/EmptyState'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import BottleTable from './BottleTable'
import BottleFormModal from './BottleFormModal'
import {
  useBottles,
  useCreateBottle,
  useUpdateBottle,
  useDeleteBottle,
} from '@/hooks/useBottles'
import { useCategories } from '@/hooks/useCategories'
import { useSubCategories } from '@/hooks/useSubCategories'
import { useStorage } from '@/hooks/useStorage'
import type { Bottle, BottlePayload } from '@/types/api'

export default function BottlesPage() {
  const { data: bottles, isLoading: bLoading, error: bError } = useBottles()
  const { data: categories, isLoading: cLoading, error: cError } = useCategories()
  const { data: subCategories, isLoading: scLoading, error: scError } = useSubCategories()
  const { data: storageList, isLoading: sLoading, error: sError } = useStorage()

  const createMutation = useCreateBottle()
  const updateMutation = useUpdateBottle()
  const deleteMutation = useDeleteBottle()
  const toast = useToast()

  const formModal = useDisclosure()
  const deleteDialog = useDisclosure()

  const [editing, setEditing] = useState<Bottle | null>(null)
  const [deleting, setDeleting] = useState<Bottle | null>(null)

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>()
    categories?.forEach((c) => map.set(c.id, c.name))
    return map
  }, [categories])

  const subCategoryMap = useMemo(() => {
    const map = new Map<number, string>()
    subCategories?.forEach((sc) => map.set(sc.id, sc.name))
    return map
  }, [subCategories])

  const storageMap = useMemo(() => {
    const map = new Map<number, string>()
    storageList?.forEach((s) => map.set(s.id, s.name))
    return map
  }, [storageList])

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

  const isLoading = bLoading || cLoading || scLoading || sLoading
  const error = bError || cError || scError || sError

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={(error as Error).message} />

  return (
    <>
      <PageHeader
        title="Bottles"
        action={
          <Button leftIcon={<AddIcon />} colorScheme="brand" onClick={handleCreate}>
            Add Bottle
          </Button>
        }
      />

      {bottles && bottles.length > 0 ? (
        <BottleTable
          bottles={bottles}
          categoryMap={categoryMap}
          subCategoryMap={subCategoryMap}
          storageMap={storageMap}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState message="No bottles yet. Add one to get started." />
      )}

      <BottleFormModal
        isOpen={formModal.isOpen}
        onClose={formModal.onClose}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
        bottle={editing}
        categories={categories ?? []}
        subCategories={subCategories ?? []}
        storageList={storageList ?? []}
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
