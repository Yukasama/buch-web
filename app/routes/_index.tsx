import { Stack } from '@chakra-ui/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import authenticator from '~/services/auth.server'
import ImageCarousel from '../features/home/image-carousel'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request)
}

export default function Index() {
  return (
    <main id="content">
      <Stack>
        <ImageCarousel />
      </Stack>
    </main>
  )
}
