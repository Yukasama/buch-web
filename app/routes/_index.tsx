import authenticator from '~/services/auth.server'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { ActionFunction, json, LoaderFunction } from '@remix-run/node'
import ImageCarousel from '../components/layout/image-carousel'
import { Button, Stack, Text } from '@chakra-ui/react'

// export const loader: LoaderFunction = async ({ request }) => {
//   return await authenticator.isAuthenticated(request, {
//     failureRedirect: '/login',
//   })
// }

// export const action: ActionFunction = async ({ request }) => {
//   await authenticator.logout(request, { redirectTo: '/login' })
// }

export default function Index() {
  const data = useLoaderData<{ name: string; token?: string }>()
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
        <p id="create-link">
          <Link to="/create">Lets Create</Link>
        </p>
        <p>
          {data?.name} {data?.token}
        </p>
        <Form method="post" action="/logout">
          <Button type="submit">Log Out</Button>
        </Form>
      </Stack>
    </main>
  )
}
