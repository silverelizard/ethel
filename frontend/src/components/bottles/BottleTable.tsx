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
  Tag,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import type { Bottle } from '@/types/api'

interface BottleTableProps {
  bottles: Bottle[]
  categoryMap: Map<number, string>
  subCategoryMap: Map<number, string>
  storageMap: Map<number, string>
  onEdit: (bottle: Bottle) => void
  onDelete: (bottle: Bottle) => void
}

export default function BottleTable({
  bottles,
  categoryMap,
  subCategoryMap,
  storageMap,
  onEdit,
  onDelete,
}: BottleTableProps) {
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th>Sub-Categories</Th>
            <Th>Storage</Th>
            <Th w="1px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bottles.map((b) => (
            <Tr key={b.id}>
              <Td>{b.id}</Td>
              <Td fontWeight="medium">{b.name}</Td>
              <Td>{categoryMap.get(b.category_id) ?? 'Unknown'}</Td>
              <Td>
                <Wrap spacing={1}>
                  {b.sub_category_ids.map((scId) => (
                    <WrapItem key={scId}>
                      <Tag size="sm" colorScheme="brand" variant="subtle">
                        {subCategoryMap.get(scId) ?? `#${scId}`}
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Td>
              <Td>{storageMap.get(b.storage_id) ?? 'Unknown'}</Td>
              <Td>
                <HStack spacing={1}>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(b)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDelete(b)}
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
