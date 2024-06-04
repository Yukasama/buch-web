import { Button, useColorMode } from '@chakra-ui/react'
import { Moon, Sun } from 'lucide-react'

export const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Button size="sm" onClick={toggleColorMode} aria-label="Toggle theme">
      {colorMode === 'light' ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  )
}
