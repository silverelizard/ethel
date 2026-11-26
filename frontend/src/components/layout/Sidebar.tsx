import { Box, Button, VStack, Text, Link as ChakraLink } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useLogout } from '@/hooks/useAuth'

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
  const logout = useLogout()

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
              bg={isActive ? 'accent.subtle' : 'transparent'}
              color={isActive ? 'accent.fg' : 'text.subtle'}
              _hover={{ bg: isActive ? 'accent.subtle' : 'bg.subtle', textDecoration: 'none' }}
              onClick={onClose}
            >
              {item.label}
            </ChakraLink>
          )
        })}
      </VStack>
      <Button
        mt={8}
        mx={2}
        size="sm"
        variant="outline"
        isLoading={logout.isPending}
        onClick={() => logout.mutate()}
      >
        Log out
      </Button>
    </Box>
  )
}
