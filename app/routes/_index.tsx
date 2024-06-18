import authenticator from '~/services/auth.server'
import { Link, useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import ImageCarousel from '../components/layout/image-carousel'
import { Stack, Text } from '@chakra-ui/react'

// TODO: Workaround für Zertifikate finden
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request)
}

// export const action: ActionFunction = async ({ request }) => {
//   await authenticator.logout(request, { redirectTo: '/login' })
// }

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
        <p>
          {user?.username} {user?.access_token}
        </p>
      </Stack>
    </main>
  )
}
