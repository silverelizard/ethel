import { Flex, Text } from '@chakra-ui/react'

interface EmptyStateProps {
  message: string
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <Flex
      justify="center"
      align="center"
      py={20}
      color="gray.500"
      borderWidth="1px"
      borderRadius="md"
      borderStyle="dashed"
    >
      <Text fontSize="lg">{message}</Text>
    </Flex>
  )
}
