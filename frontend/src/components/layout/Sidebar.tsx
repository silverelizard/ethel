import { Box, VStack, Text, Link as ChakraLink } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Bottles', path: '/bottles' },
  { label: 'Storage', path: '/storage' },
  { label: 'Categories', path: '/categories' },
  { label: 'Sub-Categories', path: '/sub-categories' },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={8} px={2}>
        Ethel
      </Text>
      <VStack align="stretch" spacing={1}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ChakraLink
              as={Link}
              to={item.path}
              key={item.path}
              px={4}
              py={2}
              borderRadius="md"
              fontWeight={isActive ? 'semibold' : 'normal'}
              bg={isActive ? 'brand.50' : 'transparent'}
              color={isActive ? 'brand.700' : 'gray.700'}
              _hover={{ bg: isActive ? 'brand.50' : 'gray.100', textDecoration: 'none' }}
              onClick={onClose}
            >
              {item.label}
            </ChakraLink>
          )
        })}
      </VStack>
    </Box>
  )
}
