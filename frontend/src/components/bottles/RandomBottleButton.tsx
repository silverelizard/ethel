import { Button } from '@chakra-ui/react'
import { RepeatIcon } from '@chakra-ui/icons'
import type { BottleCatalog } from '@/hooks/useBottleCatalog'

export default function RandomBottleButton({ catalog }: { catalog: BottleCatalog }) {
  return (
    <Button
      leftIcon={<RepeatIcon />}
      variant="outline"
      colorScheme="brand"
      onClick={catalog.random.open}
      isDisabled={catalog.bottles.length === 0}
    >
      Random bottle
    </Button>
  )
}
