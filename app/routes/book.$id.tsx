import { StarIcon } from '@chakra-ui/icons'
import {
  Box,
  Divider,
  Flex,
  GridItem,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import { Book, Star } from 'lucide-react'
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
  const bg = useColorModeValue('gray.100', 'gray.700')

  return (
    <SimpleGrid columns={3} spacing={10} px={48} py={28}>
      <GridItem>
        <Flex
          justifyContent="center"
          alignItems="center"
          rounded="lg"
          bg={bg}
          height={550}
          width={420}
        >
          <Book size={40} />
        </Flex>
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
      <GridItem
        border="1px"
        rounded="md"
        p={5}
        display="flex"
        flexDirection="column"
        gap={4}
        borderColor={bg}
      >
        <Box>
          {buch.rabatt ? (
            <Box>
              <Flex gap={2} alignItems="center">
                <Text fontSize="x-large" fontWeight={500}>
                  {Number(
                    (buch.preis - Number(buch.rabatt.split('%')[0])).toFixed(2),
                  )}
                  €
                </Text>
                <Text
                  fontSize="larger"
                  color="red.400"
                  fontWeight={500}
                  mt="3px"
                >
                  -{buch.rabatt}
                </Text>
              </Flex>

              <Flex
                gap={2}
                alignItems="center"
                fontSize="small"
                color="gray.400"
              >
                <Text>Listenpreis:</Text>
                <Text as="del" fontWeight={500}>
                  {buch.preis}€
                </Text>
              </Flex>
            </Box>
          ) : (
            <Text fontSize="x-large" fontWeight={500}>
              {buch.preis}€
            </Text>
          )}
          <Text fontSize="small" mt="5px" color="gray.400">
            inkl. MwSt., zzgl. Versand
          </Text>
        </Box>
        <Flex>
          {buch.lieferbar ? (
            <Text color="green.400">Lieferbar</Text>
          ) : (
            <Text color="red.400">Nicht lieferbar</Text>
          )}
        </Flex>
      </GridItem>
    </SimpleGrid>
  )
}
