import authenticator from '~/services/auth.server'
import { Link, useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import ImageCarousel from '../features/home/image-carousel'
import { Stack, Text, useToast } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request)
}

export default function Index() {
  const user = useLoaderData<typeof loader>()
  const firstTimeRef = useRef(true)
  const loggout = useRef(false)

  const toast = useToast()
  useEffect(() => {
    if (user !== null && firstTimeRef.current) {
      toast({
        title: 'Welcome back',
        description: user?.username,
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
      firstTimeRef.current = false
      loggout.current = true
    }
    if (loggout.current && user === null) {
      toast({
        title: 'Logged out',
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      loggout.current = false
    }
  })

  return (
    <main id="content">
      <Stack py={[14, 21]}>
        <Text
          display="flex"
          alignSelf="center"
          fontSize="x-large"
          fontWeight={600}
        >
          Buch-Web
        </Text>
        <ImageCarousel />
        <p id="search-link">
          <Link to="/search">Lets Search</Link>
        </p>
        {user && (
          <p id="create-link">
            <Link to="/create">Lets Create</Link>
          </p>
        )}
        <Text>{user?.role}</Text>
        <Text>🍆🤓</Text>
      </Stack>
    </main>
  )
}
