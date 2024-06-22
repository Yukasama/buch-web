import { useState } from 'react'
import { Form } from '@remix-run/react'
import {
  Flex,
  Link,
  Button,
  IconButton,
  Image,
  useColorModeValue,
  Input,
  Box,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { ThemeToggle } from '../../components/layout/theme-toggle'
import type { User } from '~/utils/rest/login'

const NavBar = ({ user }: { user?: User | null }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = () => setIsOpen(!isOpen)

  const bg = useColorModeValue('gray.100', 'gray.900')

  return (
    <Box>
      <Flex bg={bg} px={4} h={16} alignItems="center">
        <Flex alignItems="center" flex="1">
          <IconButton
            size="sm"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Open Menu"
            display={{ md: 'none' }}
            onClick={handleToggle}
          />
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Buch-Web Logo"
              height={12}
              width={12}
              rounded="full"
              cursor="pointer"
            />
          </Link>
        </Flex>
        <Flex justifyContent="center" flex="1">
          <Form action="/search">
            <Input name="q" placeholder="Search books" variant="filled" />
            <Button type="submit" hidden />
          </Form>
        </Flex>
        <Flex justifyContent="end" flex="1">
          <Flex gap={2} alignItems="center">
            <ThemeToggle />
            <Flex>
              {user ? (
                <Form method="post" action="/logout">
                  <Button size="sm" type="submit">
                    Sign Out
                  </Button>
                </Form>
              ) : (
                <Button as={Link} href="/login" size="sm" colorScheme="blue">
                  Sign In
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

export default NavBar
