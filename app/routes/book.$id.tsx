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

export async function loader({ request, params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response('Not Found', { status: 404 })
  }

  const versionStr = request.headers.get('E-Tag')
  const version = versionStr ? Number(versionStr.replace(/"/g, '')) : 0

  const buch = await getBookById({ id: params.id, version })
  if (!buch) {
    throw new Response('Not Found', { status: 404 })
  }

  return json(buch)
}

export default function BookPage() {
  const buch = useLoaderData<typeof loader>()
  const isAdmin = true

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

                <BuchTags buch={buch} />

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

export async function action({ request, params }: ActionFunctionArgs) {
  if (!params.id) {
    throw new Response('Not Found', { status: 404 })
  }

  const isAdmin = true
  if (!isAdmin) {
    return json('No Access', { status: 403 })
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
    return json({ errors: validated.error.errors }, { status: 400 })
  }

  const versionStr = request.headers.get('E-Tag')
  const version = versionStr ? Number(versionStr.replace(/"/g, '')) : 0

  const { ok } = await updateBookById({
    id: params.id,
    version,
    mutateData: validated.data,
  })

  return json({ ok })
}
