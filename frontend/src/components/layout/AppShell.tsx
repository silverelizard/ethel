import type { ReactNode } from 'react'
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import Sidebar from './Sidebar'
import ColorModeToggle from '@/components/shared/ColorModeToggle'

const SIDEBAR_WIDTH = '240px'

export default function AppShell({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
    <Flex minH="100vh">
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box
          w={SIDEBAR_WIDTH}
          flexShrink={0}
          borderRight="1px"
          borderColor="border.subtle"
          bg="bg.surface"
          p={4}
          pt={6}
        >
          <Sidebar />
        </Box>
      )}

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody pt={6}>
            <Sidebar onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main content */}
      <Box flex={1} overflow="auto">
        {/* Top bar: menu button on mobile (left), color mode toggle (right). */}
        <Flex justify="space-between" align="center" px={2} pt={2}>
          {isMobile ? (
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              onClick={onOpen}
            />
          ) : (
            <Box />
          )}
          <ColorModeToggle size="sm" />
        </Flex>
        <Box px={{ base: 4, md: 8 }} pb={{ base: 4, md: 8 }} pt={{ base: 2, md: 4 }} maxW="1200px" mx="auto">
          {children}
        </Box>
      </Box>
    </Flex>
  )
}
