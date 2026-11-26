import { IconButton, useColorMode, type IconButtonProps } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

type Props = Omit<IconButtonProps, 'aria-label' | 'icon' | 'onClick'>

/** Sun/moon button that switches between light and dark mode. */
export default function ColorModeToggle(props: Props) {
  const { colorMode, toggleColorMode } = useColorMode()
  const next = colorMode === 'light' ? 'dark' : 'light'

  return (
    <IconButton
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      variant="ghost"
      onClick={toggleColorMode}
      {...props}
    />
  )
}
