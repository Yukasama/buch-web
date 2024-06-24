import { Stack, useToast } from '@chakra-ui/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import authenticator from '~/services/auth.server'
import ImageCarousel from '../features/home/image-carousel'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request)
}

export default function Index() {
  const user = useLoaderData<typeof loader>()
  const firstTimeRef = useRef(true)
  const logout = useRef(false)

  const toast = useToast()
  useEffect(() => {
    if (user !== null && firstTimeRef.current) {
      toast({
        title: 'Welcome back',
        description: `You're logged in as ${user?.username}`,
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
      firstTimeRef.current = false
      logout.current = true
    }

    if (logout.current && user === null) {
      toast({
        title: 'Logged out',
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      logout.current = false
    }
  })

  return (
    <main id="content">
      <Stack>
        <ImageCarousel />
      </Stack>
    </main>
  )
}
