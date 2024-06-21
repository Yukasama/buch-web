import { StarIcon } from '@chakra-ui/icons'
import {
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
import { json, useLoaderData, Await } from '@remix-run/react'
import { BuyDetails } from '~/features/book/buy-details'
import { Star } from 'lucide-react'
import { Suspense } from 'react'
import { getBookById } from '~/utils/rest/read-books'
import { updateBookById } from '~/utils/rest/write-book'
import { UpdateModal } from '~/features/book/update-modal'
import { BuchUpdateSchema } from '~/lib/validators/book'
import { logger } from '~/lib/logger'
import { BuchTags } from '~/features/book/buch-tags'
import authenticator from '~/services/auth.server'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!params.id) {
    throw new Response('Not Found', { status: 404 })
  }

  const buch = await getBookById({ id: params.id })
  if (!buch) {
    throw new Response('Not Found', { status: 404 })
  }

  const user = await authenticator.isAuthenticated(request)
  return json({ user, buch })
}

export default function BookPage() {
  const { buch, user } = useLoaderData<typeof loader>()
  const isAdmin = !!user

  return (
    <SimpleGrid
      columns={[1, 1, 2, 3]}
      spacing={[5, 5, 10, 10, 10]}
      px={[7, 16, 24, 32, 48]}
      py={[7, 12, 20, 16, 28]}
    >
      <GridItem>
        <Image
          src="/gangof4.png"
          boxSize={['sm', 'sm', 'md', 'lg']}
          rounded="md"
          alt="Book Image"
        />
      </GridItem>
      <GridItem>
        <Suspense fallback={<Skeleton />}>
          <Await resolve={buch}>
            {(buch) => (
              <Flex flexDirection="column" gap={2}>
                <Flex justifyContent="space-between" alignItems="center">
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
                  {isAdmin && <UpdateModal buch={buch} />}
                </Flex>

                <BuchTags buch={buch} user={user} />

                <Flex alignItems="center" gap={2} my={2}>
                  <Text fontSize="md">{buch.rating}.0</Text>
                  {Array.from({ length: Number(buch.rating) }, (_, i) => (
                    <StarIcon key={i} />
                  ))}
                  <Box display="flex" gap={2} mt={0.4}>
                    {Array.from(
                      { length: Number(5 - (buch.rating ?? 0)) },
                      (_, i) => (
                        <Icon as={Star} boxSize={18} key={i + '1'} />
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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request)
  if (!user) {
    throw new Response('Unauthorized', { status: 401 })
  }

  // TODO
  // const isAdmin = !!user.roles.admin
  // if (!isAdmin) {
  //   throw new Response('No Access', { status: 403 })
  // }

  if (!params.id) {
    throw new Response('Not Found', { status: 404 })
  }

  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  const values = {
    ...data,
    rating: Number(formData.get('rating')),
    preis: Number(formData.get('preis')),
    rabatt: Number(formData.get('rabatt')),
    lieferbar: formData.get('lieferbar') === 'on',
  }

  const validated = BuchUpdateSchema.safeParse(values)
  if (!validated.success) {
    logger.debug('book [action] (invalid-fields): values=%o', validated)
    return { errors: validated.error.issues }
  }

  await updateBookById({
    id: params.id,
    mutateData: validated.data,
    access_token: user.access_token,
  })

  return { errors: [] }
}
