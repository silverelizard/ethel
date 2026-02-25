import { Flex, Spinner } from '@chakra-ui/react'

export default function LoadingSpinner() {
  return (
    <Flex justify="center" align="center" py={20}>
      <Spinner size="xl" color="brand.500" thickness="3px" />
    </Flex>
  )
}
