import {
  Box,
  Button,
  Flex,
  GridItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Buch } from '~/graphql/__generated__/graphql'

export const BuyDetails = ({ book }: Readonly<{ book: Buch }>) => {
  const bg = useColorModeValue('gray.100', 'gray.700')
  const lieferbarColor = useColorModeValue('green.500', 'green.300')

  return (
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
        {book.rabatt ? (
          <Box>
            <Flex gap={2} alignItems="center">
              <Text fontSize="x-large" fontWeight={500}>
                {Number(
                  (book.preis - Number(book.rabatt.split('%')[0])).toFixed(2),
                )}
                €
              </Text>
              <Text fontSize="larger" color="red.400" fontWeight={500} mt="3px">
                -{book.rabatt}
              </Text>
            </Flex>

            <Flex gap={2} alignItems="center" fontSize="small" color="gray.400">
              <Text>Listenpreis:</Text>
              <Text as="del" fontWeight={500}>
                {book.preis}€
              </Text>
            </Flex>
          </Box>
        ) : (
          <Text fontSize="x-large" fontWeight={500}>
            {book.preis}€
          </Text>
        )}
        <Text fontSize="small" mt="5px" color="gray.400">
          inkl. MwSt., zzgl. Versand
        </Text>
      </Box>
      {book.lieferbar ? (
        <Text color={lieferbarColor} fontSize="large">
          Lieferbar
        </Text>
      ) : (
        <Text color="red.400" fontSize="large">
          Nicht lieferbar
        </Text>
      )}
      <Flex direction="column" gap={1}>
        {book.lieferbar && (
          <>
            <Flex gap={1.5}>
              <Text fontSize="small">Versand durch:</Text>
              <Text
                fontSize="small"
                color="blue.300"
                decoration="underline"
                cursor="pointer"
              >
                Buch-Web
              </Text>
            </Flex>
            <Flex gap={1.5}>
              <Text fontSize="small">Lieferung durch:</Text>
              <Text
                fontSize="small"
                color="blue.300"
                decoration="underline"
                cursor="pointer"
              >
                Buch-Web
              </Text>
            </Flex>
          </>
        )}
      </Flex>
      <Flex direction="column" gap={2} mt={2}>
        <Button colorScheme="blue">Jetzt bestellen</Button>
        <Button colorScheme="gray">In den Warenkorb</Button>
      </Flex>
    </GridItem>
  )
}
