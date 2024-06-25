import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  useColorModeValue,
} from '@chakra-ui/react'
import { Form, Link } from '@remix-run/react'
import type { User } from '~/utils/rest/login'
import { ThemeToggle } from '../../components/theme-toggle'

const NavBar = ({ user }: { user?: User | null }) => {
  const bg = useColorModeValue('gray.100', 'gray.900')

  return (
    <Box>
      <Flex bg={bg} px={4} h={16} alignItems="center">
        <Flex alignItems="center" flex="1" gap={2}>
          <Link to="/">
            <Image
              src="/logo.png"
              alt="Buch-Web Logo"
              height={12}
              width={12}
              rounded="full"
              cursor="pointer"
            />
          </Link>
          {user?.role?.includes('admin') ? (
            <Button
              as={Link}
              to="/create"
              size="sm"
              _hover={{ textDecoration: 'none' }}
            >
              New Book
            </Button>
          ) : undefined}
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
                <Button
                  as={Link}
                  to="/login"
                  size="sm"
                  colorScheme="blue"
                  _hover={{ textDecoration: 'none' }}
                >
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
