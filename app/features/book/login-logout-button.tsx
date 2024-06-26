import { Button, Flex, useToast } from '@chakra-ui/react'
import { Form, Link } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { User } from '~/utils/rest/login'

const LoginLogoutButton = ({ user }: { user?: User | null }) => {
  const [isLogInPlayed, setIsLogInPlayed] = useState(true)
  const [isLogOutPlayed, setIsLogOutPlayed] = useState(false)

  const toast = useToast()

  useEffect(() => {
    // log in
    if (user && !isLogInPlayed) {
      setIsLogInPlayed(true)
      setIsLogOutPlayed(false)
      toast({
        title: 'Welcome back',
        description: `You're logged in as ${user?.username}`,
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
    }
    // log out
    if (!user && !isLogOutPlayed) {
      setIsLogOutPlayed(true)
      setIsLogInPlayed(false)
      toast({
        title: 'Logged out',
        status: 'info',
        duration: 6000,
        isClosable: true,
      })
    }
  }, [isLogInPlayed, isLogOutPlayed, toast, user, user?.username])

  const handleIsLogInPlayed = () => {
    setIsLogInPlayed(true)
  }

  return (
    <Flex>
      {user ? (
        <Form method="post" action="/logout">
          <Button size="sm" type="submit" onClick={handleIsLogInPlayed}>
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
  )
}

export default LoginLogoutButton
