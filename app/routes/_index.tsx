import authenticator from '~/services/auth.server'
import { Link, useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import ImageCarousel from '../features/home/image-carousel'
import { Stack, Text } from '@chakra-ui/react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request)
}

export default function Index() {
  const user = useLoaderData<typeof loader>()

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
      </Stack>
    </main>
  )
}
