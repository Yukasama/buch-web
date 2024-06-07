import { StarIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Divider,
  Flex,
  GridItem,
  Icon,
  Image,
  SimpleGrid,
  Text,
  Skeleton,
} from '@chakra-ui/react'
import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { json, useLoaderData, Await, useFetcher } from '@remix-run/react'
import { BuyDetails } from '~/features/book/buy-details'
import { Star } from 'lucide-react'
import { Suspense } from 'react'
import { getBookById } from '~/utils/rest/read-books'
import { updateBookById } from '~/utils/rest/write-book'
import { UpdateInfo } from '~/features/book/update-info'

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response('Not Found', { status: 404 })
  }

  const buch = await getBookById({ id: params.id })
  if (!buch) {
    throw new Response('Not Found', { status: 404 })
  }

  return buch
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Response('Not Found', { status: 404 })
  }

  const body = await request.formData()
  const versionStr = request.headers.get('E-Tag')
  const version = versionStr ? Number(versionStr.replace(/"/g, '')) : 0

  const { ...values } = Object.fromEntries(body)
  await updateBookById({ id: params.id, version, mutateData: values })

  return json({ ok: true })
}

export default function BookPage() {
  const buch = useLoaderData<typeof loader>()
  const fetcher = useFetcher()
  const isAdmin = true

  return (
    <SimpleGrid columns={3} spacing={10} px={48} py={28}>
      <GridItem>
        <Image src="/gangof4.png" rounded="md" alt="Book Image" />
      </GridItem>
      <GridItem>
        <Suspense fallback={<Skeleton />}>
          <Await resolve={buch}>
            {(buch) => (
              <Flex flexDirection="column" gap={2}>
                <Flex justifyContent="space-between">
                  <Box>
                    <Text fontSize="x-large" fontWeight={500}>
                      {buch.titel.titel}
                    </Text>
                    <Text
                      mt={-1}
                      color="gray.400"
                      display={buch.titel.untertitel ? 'block' : 'none'}
                    >
                      {buch.titel.untertitel}
                    </Text>
                  </Box>
                  {isAdmin && <UpdateInfo buch={buch} />}
                </Flex>
                <Flex gap={2}>
                  <Badge colorScheme="blue">{buch.art}</Badge>
                  {buch.schlagwoerter?.map((word) => (
                    <Badge key={word}>{word}</Badge>
                  ))}
                </Flex>
                <Flex alignItems="center" gap={2} my={2}>
                  <Text fontSize="md">{buch.rating}.0</Text>
                  {Array.from({ length: Number(buch.rating) }, (_, i) => (
                    <StarIcon key={i} />
                  ))}
                  <Box display="flex" gap={2} mt={0.4}>
                    {Array.from(
                      { length: Number(5 - (buch.rating ?? 0)) },
                      (_, i) => (
                        <Icon
                          as={Star}
                          boxSize={18}
                          key={i + '1'}
                          onClick={() => {
                            fetcher.submit(
                              { rating: (buch.rating ?? 0) + i + 1 },
                              { method: 'POST', encType: 'application/json' },
                            )
                          }}
                          _hover={{ cursor: 'pointer', background: 'gray' }}
                        />
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
                  <Text color="gray.400">Homepage</Text>
                  <Text>{buch.homepage}</Text>
                </Box>
              </Flex>
            )}
          </Await>
        </Suspense>
      </GridItem>
      <Suspense fallback={<Skeleton />}>
        <Await resolve={buch}>{(buch) => <BuyDetails buch={buch} />}</Await>
      </Suspense>
    </SimpleGrid>
  )
}
