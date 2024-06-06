import { StarIcon } from '@chakra-ui/icons'
import {
  Badge,
  Box,
  Divider,
  Editable,
  Flex,
  GridItem,
  Icon,
  Image,
  SimpleGrid,
  Text,
  EditableInput,
  EditablePreview,
  Skeleton,
} from '@chakra-ui/react'
import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import { json, useLoaderData, Await, useFetcher } from '@remix-run/react'
import { BuyDetails } from '~/features/book/buy-details'
import { Star } from 'lucide-react'
import { Suspense } from 'react'
import { getBookById } from '~/utils/get-books'
import { Buch } from '~/graphql/__generated__/graphql'
import { updateBookById } from '~/utils/update-book'

export async function loader({ params }: LoaderFunctionArgs) {
  const buch = await getBookById({ id: params.id })

  if (!buch) {
    throw new Response('Not Found', { status: 404 })
  }

  return json(buch)
}

export async function action({ request, params }: ActionFunctionArgs) {
  const body = await request.formData()
  const id = params.id

  const { ...values } = Object.fromEntries(body)
  await updateBookById({ id, mutateData: values })

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
            {(buch: Buch) => (
              <Flex flexDirection="column" gap={2}>
                <Box>
                  <Editable
                    isDisabled={!isAdmin}
                    defaultValue={buch.titel.titel}
                    fontSize="x-large"
                    fontWeight={500}
                  >
                    <EditablePreview />
                    <EditableInput name="title" />
                  </Editable>
                  <Text
                    mt={-1}
                    color="gray.400"
                    display={buch.titel.untertitel ? 'block' : 'none'}
                  >
                    {buch.titel.untertitel}
                  </Text>
                </Box>
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
        <Await resolve={buch}>{(buch) => <BuyDetails book={buch} />}</Await>
      </Suspense>
    </SimpleGrid>
  )
}
