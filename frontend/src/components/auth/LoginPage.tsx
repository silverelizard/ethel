import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link as ChakraLink,
  VStack,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import ErrorAlert from '@/components/shared/ErrorAlert'
import ColorModeToggle from '@/components/shared/ColorModeToggle'
import { ApiError } from '@/api/client'
import { useLogin } from '@/hooks/useAuth'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const login = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate(password)
  }

  const errorMessage =
    login.error instanceof ApiError && login.error.status === 401
      ? 'Incorrect password'
      : login.error
        ? 'Could not sign in. Please try again.'
        : null

  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg.canvas" px={4} position="relative">
      <ColorModeToggle size="sm" position="absolute" top={3} right={4} />
      <Box as="form" onSubmit={handleSubmit} bg="bg.surface" p={8} borderRadius="lg" boxShadow="md" w="full" maxW="sm">
        <VStack spacing={5} align="stretch">
          <Heading size="lg">Ethel</Heading>
          {errorMessage && <ErrorAlert message={errorMessage} />}
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Button type="submit" colorScheme="brand" isLoading={login.isPending}>
            Sign in
          </Button>
          <ChakraLink as={Link} to="/" textAlign="center" fontSize="sm" color="text.subtle">
            Back to the bottle list
          </ChakraLink>
        </VStack>
      </Box>
    </Flex>
  )
}
