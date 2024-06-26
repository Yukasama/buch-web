import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Link,
  useColorModeValue,
} from '@chakra-ui/react'
import { Form } from '@remix-run/react'
import type { User } from '~/utils/rest/login'
import { LoginLogoutButton } from './login-logout-button'
import { ThemeToggle } from './theme-toggle'

const NavBar = ({ user }: { user?: User | null }) => {
  const bg = useColorModeValue('gray.100', 'gray.900')

  return (
    <Box>
      <Flex bg={bg} px={4} h={16} alignItems="center">
        <Flex alignItems="center" flex="1" gap={2}>
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
          {user?.role?.includes('admin') ? (
            <Button
              as={Link}
              href="/create"
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
            <LoginLogoutButton user={user} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

export default NavBar
