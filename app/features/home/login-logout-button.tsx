import { Button, Flex, Link, useToast } from '@chakra-ui/react'
import { Form } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { User } from '~/utils/rest/login'

export const LoginLogoutButton = ({ user }: { user?: User | null }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const toast = useToast()

  useEffect(() => {
    // log in
    if (!isLoggedIn && user) {
      toast({
        title: 'Welcome back',
        description: `You're logged in as ${user?.username}`,
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
    }
  }, [isLoggedIn, toast, user, user?.username])

  const handleLogOut = () => {
    setIsLoggedIn(false)
  }

  return (
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
          href="/login"
          size="sm"
          colorScheme="blue"
          _hover={{ textDecoration: 'none' }}
          onClick={handleLogOut}
        >
          Sign In
        </Button>
      )}
    </Flex>
  )
}
