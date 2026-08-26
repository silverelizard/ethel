import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  Box,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import type { Storage } from '@/types/api'

interface StorageTableProps {
  storageList: Storage[]
  onEdit: (storage: Storage) => void
  onDelete: (storage: Storage) => void
}

export default function StorageTable({
  storageList,
  onEdit,
  onDelete,
}: StorageTableProps) {
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Room</Th>
            <Th>Shelf</Th>
            <Th w="1px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {storageList.map((s) => (
            <Tr key={s.id}>
              <Td>{s.id}</Td>
              <Td>{s.name}</Td>
              <Td>{s.room}</Td>
              <Td>{s.shelf}</Td>
              <Td>
                <HStack spacing={1}>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(s)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDelete(s)}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
