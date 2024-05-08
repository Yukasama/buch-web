import { StarIcon } from '@chakra-ui/icons'
import { Box, Text } from '@chakra-ui/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import { getBookById } from '~/utils/getBooks'

export async function loader({ params }: LoaderFunctionArgs) {
  const buch = await getBookById({ id: params.id })

  if (!buch) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    })
  }

  return json(buch)
}

export default function Details() {
  const buch = useLoaderData<typeof loader>()

  return (
    <div>
      <div key={buch.titel.titel}>
        <h2>{buch.titel.titel}</h2>
        <h2>{buch.isbn}</h2>
      </div>
      <Box display="flex" alignItems="center" gap={2}>
        <Text fontSize="md">{buch.rating}.0</Text>
        {Array.from({ length: Number(buch.rating) }, (_, i) => (
          <StarIcon key={i} />
        ))}
      </Box>
    </div>
  )
}
