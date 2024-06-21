import {
  Box,
  Button,
  Flex,
  GridItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Buch } from '~/lib/validators/book'

export const BuyDetails = ({ buch }: Readonly<{ buch: Buch }>) => {
  const bg = useColorModeValue('gray.100', 'gray.700')
  const lieferbarColor = useColorModeValue('green.500', 'green.300')

  return (
    <GridItem
      border="1px"
      rounded="md"
      colSpan={[2, 2, 2, 1, 1]}
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
                {(buch.preis - buch.preis * buch.rabatt).toFixed(2)}€
              </Text>
              <Text fontSize="larger" color="red.400" fontWeight={500} mt="3px">
                -{(buch.rabatt * 100).toFixed(2)}%
              </Text>
            </Flex>

            <Flex gap={2} alignItems="center" fontSize="small" color="gray.400">
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

      {buch.lieferbar ? (
        <Text color={lieferbarColor} fontSize="large">
          Lieferbar
        </Text>
      ) : (
        <Text color="red.400" fontSize="large">
          Nicht lieferbar
        </Text>
      )}
      <Flex direction="column" gap={1}>
        {buch.lieferbar ? (
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
        ) : null}
      </Flex>
      <Flex direction="column" gap={2} mt={2}>
        <Button colorScheme="blue">Jetzt bestellen</Button>
        <Button colorScheme="gray">In den Warenkorb</Button>
      </Flex>
    </GridItem>
  )
}
