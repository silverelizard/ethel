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
import type { SubCategory } from '@/types/api'

interface SubCategoryTableProps {
  subCategories: SubCategory[]
  categoryMap: Map<number, string>
  onEdit: (subCategory: SubCategory) => void
  onDelete: (subCategory: SubCategory) => void
}

export default function SubCategoryTable({
  subCategories,
  categoryMap,
  onEdit,
  onDelete,
}: SubCategoryTableProps) {
  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Category</Th>
            <Th w="1px">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {subCategories.map((sc) => (
            <Tr key={sc.id}>
              <Td>{sc.id}</Td>
              <Td>{sc.name}</Td>
              <Td>{categoryMap.get(sc.category_id) ?? 'Unknown'}</Td>
              <Td>
                <HStack spacing={1}>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(sc)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => onDelete(sc)}
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
