import { Box, Button, Flex, HStack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/layout/PageHeader'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ErrorAlert from '@/components/shared/ErrorAlert'
import ColorModeToggle from '@/components/shared/ColorModeToggle'
import BottleBrowser from '@/components/bottles/BottleBrowser'
import RandomBottleButton from '@/components/bottles/RandomBottleButton'
import { useBottleCatalog } from '@/hooks/useBottleCatalog'

/** Read-only bottle list for visitors: browse, search and pick a random bottle. */
export default function PublicBottlesPage() {
  const catalog = useBottleCatalog()

  return (
    <Box minH="100vh">
      <Flex
        as="header"
        justify="space-between"
        align="center"
        px={{ base: 4, md: 8 }}
        py={3}
        borderBottom="1px"
        borderColor="border.subtle"
        bg="bg.surface"
      >
        <Text fontSize="xl" fontWeight="bold">
          Ethel
        </Text>
        <HStack spacing={1}>
          <Button as={Link} to="/login" size="sm" variant="ghost">
            Sign in
          </Button>
          <ColorModeToggle size="sm" />
        </HStack>
      </Flex>

      <Box as="main" p={{ base: 4, md: 8 }} maxW="1200px" mx="auto">
        {catalog.isLoading ? (
          <LoadingSpinner />
        ) : catalog.error ? (
          <ErrorAlert message={(catalog.error as Error).message} />
        ) : (
          <>
            <PageHeader title="Bottles" action={<RandomBottleButton catalog={catalog} />} />
            <BottleBrowser catalog={catalog} emptyMessage="No bottles yet." />
          </>
        )}
      </Box>
    </Box>
  )
}
