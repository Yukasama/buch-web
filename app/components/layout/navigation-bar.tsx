import { useState } from 'react'
import { Form, useLoaderData, useNavigate } from '@remix-run/react'
import {
  Box,
  Flex,
  HStack,
  Link,
  Button,
  IconButton,
  Image,
  Spacer,
  useColorModeValue,
  Input,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { ThemeToggle } from './theme-toggle'
import { LoaderFunction } from '@remix-run/node'
import authenticator from '~/services/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.isAuthenticated(request)
}

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = () => setIsOpen(!isOpen)
  const navigate = useNavigate()

  const user = useLoaderData<typeof loader>()

  const bg = useColorModeValue('gray.100', 'gray.900')

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get('searchQuery')
    if (searchQuery && typeof searchQuery === 'string') {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
    }
  }

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
            alt="Buch-Web Logo"
            height={12}
            width={12}
            rounded="full"
            cursor="pointer"
          />
        </Link>
        <Spacer />
        <HStack spacing={8} alignItems="center">
          <form onSubmit={handleSearch}>
            <Input
              name="searchQuery"
              placeholder="Search books"
              variant="filled"
            />
          </form>
        </HStack>
        <Spacer />
        <ThemeToggle />
        <Flex alignItems="center">
          {user ? (
            <Form method="post" action="/logout">
              <Button type="submit">Log Out</Button>
            </Form>
          ) : (
            <Button ml={4} colorScheme="blue">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}

export default NavBar
