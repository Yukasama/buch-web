import { useState } from 'react'
import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  Input,
  IconButton,
  Image,
  Spacer,
  useColorModeValue,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { ThemeToggle } from './theme-toggle'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => setIsOpen(!isOpen)

  const bg = useColorModeValue('gray.100', 'gray.900')

  return (
    <Box bg={bg} px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Open Menu"
          display={{ md: 'none' }}
          onClick={handleToggle}
        />
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            height={12}
            width={12}
            cursor="pointer"
          />
        </Link>
        <Spacer />
        <HStack spacing={8} alignItems="center">
          <Input
            placeholder="Bücher suchen"
            variant="filled"
            bg="blackAlpha.900"
          />
        </HStack>
        <Spacer />
        <ThemeToggle />
        <Flex alignItems="center">
          <Button ml={4} colorScheme="blue">
            Login
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default NavBar
