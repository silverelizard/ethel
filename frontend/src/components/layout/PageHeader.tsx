import type { ReactNode } from 'react'
import { Flex, Heading } from '@chakra-ui/react'

interface PageHeaderProps {
  title: string
  action?: ReactNode
}

export default function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <Flex justify="space-between" align="center" mb={6}>
      <Heading size="lg">{title}</Heading>
      {action}
    </Flex>
  )
}
