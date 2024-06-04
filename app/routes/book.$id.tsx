import { StarIcon } from '@chakra-ui/icons'
import {
  Box,
  Divider,
  Flex,
  GridItem,
  Image,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import { BuyDetails } from 'features/book/buy-details'
import { Star } from 'lucide-react'
import { getBookById } from '~/utils/get-books'

export async function loader({ params }: LoaderFunctionArgs) {
  const buch = await getBookById({ id: params.id })

  if (!buch) {
    throw new Response(undefined, {
      status: 404,
      statusText: 'Not Found',
    })
  }

  return json(buch)
}

export default function BookPage() {
  const buch = useLoaderData<typeof loader>()

  return (
    <SimpleGrid columns={3} spacing={10} px={48} py={28}>
      <GridItem>
        <Image src="/gangof4.png" rounded="md" alt="Book Image" />
      </GridItem>
      <GridItem>
        <Flex flexDirection="column" gap={4}>
          <Box>
            <Text fontSize="x-large" fontWeight={500}>
              {buch.titel.titel}
            </Text>
            <Text
              color="gray.400"
              display={buch.titel.untertitel ? 'block' : 'none'}
            >
              {buch.titel.untertitel}
            </Text>
          </Box>
          <Flex alignItems="center" gap={2}>
            <Text fontSize="md">{buch.rating}.0</Text>
            {Array.from({ length: Number(buch.rating) }, (_, i) => (
              <StarIcon key={i} />
            ))}
            <Box display="flex" gap={2} mt={0.4}>
              {Array.from(
                { length: Number(5 - (buch.rating ?? 0)) },
                (_, i) => (
                  <Star key={i + '1'} size={18} />
                ),
              )}
            </Box>
          </Flex>
          <Divider />
          <Box>
            <Text color="gray.400">ISBN</Text>
            <Text>{buch.isbn}</Text>
          </Box>
          <Box>
            <Text color="gray.400">Art</Text>
            <Text>{buch.art}</Text>
          </Box>
          <Box>
            <Text color="gray.400">Homepage</Text>
            <Text>{buch.homepage}</Text>
          </Box>
        </Flex>
      </GridItem>
      <BuyDetails book={buch} />
    </SimpleGrid>
  )
}
