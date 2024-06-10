import authenticator from '~/services/auth.server'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { ActionFunction, json, LoaderFunction } from '@remix-run/node'

import ImageCarousel from '../components/layout/image-carousel'
import { Button } from '@chakra-ui/react'

// // is logged in?
// export const loader: LoaderFunction = async ({ request }) => {
//   return await authenticator.isAuthenticated(request, {
//     failureRedirect: '/login',
//   })
// }

// // logout
// export const action: ActionFunction = async ({ request }) => {
//   await authenticator.logout(request, { redirectTo: '/login' })
// }

export default function Index() {
  const data = useLoaderData<{ name: string; token?: string }>()
  return (
    <main id="content">
      <ImageCarousel />
      <p id="ctb">
        <Link to="/search">Lets Search</Link>
      </p>
      <p>
        {data?.name} {data?.token}
      </p>
      <Form method="post" action="/logout">
        <Button type="submit">Log Out</Button>
      </Form>
    </main>
  )
}
