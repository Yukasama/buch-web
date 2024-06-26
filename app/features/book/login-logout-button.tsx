import { Button, Flex, useToast } from '@chakra-ui/react'
import { Form, Link } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { User } from '~/utils/rest/login'

const LoginLogoutButton = ({ user }: { user?: User | null }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLogInPlayed, setIsLogInPlayed] = useState(false)
  const [isLogOutPlayed, setIsLogOutPlayed] = useState(true)

  const toast = useToast()

  useEffect(() => {
    // log in
    if (user && isLoggedIn && !isLogInPlayed) {
      toast({
        title: 'Welcome back',
        description: `You're logged in as ${user?.username}`,
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
      setIsLogInPlayed(true)
      setIsLogOutPlayed(false)
    }
    // log out
    if (!user && !isLoggedIn && !isLogOutPlayed) {
      toast({
        title: 'Logged out',
        status: 'info',
        duration: 6000,
        isClosable: true,
      })
      setIsLogInPlayed(false)
      setIsLogOutPlayed(true)
    }
  }, [isLogInPlayed, isLogOutPlayed, isLoggedIn, toast, user, user?.username])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <Flex>
      {user ? (
        <Form method="post" action="/logout">
          <Button size="sm" type="submit" onClick={handleLogout}>
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
          onClick={handleLogin}
        >
          Sign In
        </Button>
      )}
    </Flex>
  )
}

export default LoginLogoutButton
