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
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { ThemeToggle } from '../theme-toggle'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => setIsOpen(!isOpen)

  return (
    <Box bg="black" px={4}>
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
        <HStack spacing={8} alignItems="center" ml={-10}>
          <Link
            px={2}
            py={1}
            rounded="md"
            _hover={{
              textDecoration: 'none',
              color: 'black',
              bg: 'gray.200',
            }}
            href="#"
          >
            Bücher suchen
          </Link>
        </HStack>
        <Flex alignItems="center" ml={350}>
          <Input
            placeholder="Benutzername"
            variant="filled"
            bg="blackAlpha.900"
          />
          <Input
            placeholder="Passwort"
            variant="filled"
            type="password"
            ml={2}
            bg="blackAlpha.900"
          />
          <Button ml={2} colorScheme="blue" size="lg">
            Login
          </Button>
        </Flex>
        <ThemeToggle />
      </Flex>
    </Box>
  )
}

export default NavBar
