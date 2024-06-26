import {
  Badge,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  HStack,
  Heading,
  Input,
  Link,
  Radio,
  RadioGroup,
  Select,
  Skeleton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from '@chakra-ui/react'
import { json } from '@remix-run/node'
import { Await, useLoaderData, useSearchParams } from '@remix-run/react'
import { Info } from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { StarRating } from '../features/search/star-rating'
import { Buch, ISBN_REGEX } from '../lib/validators/book'
import { getAllBooks } from '../utils/rest/read-books'

export const loader = async () => {
  const { data: books, error } = await getAllBooks()
  return json({ books, error })
}

export default function SearchPage() {
  const { books, error } = useLoaderData<typeof loader>()

  const [searchQuery, setSearchQuery] = useState('')
  const [isbnQuery, setIsbnQuery] = useState('')
  const [isTypeScript, setIsTypeScript] = useState(false)
  const [isJavaScript, setIsJavaScript] = useState(false)
  const [selectedValueBookType, setSelectedValueBookType] = useState('')
  const [rating, setRating] = useState(0)
  const [searchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState<Buch[] | undefined>(books)
  const [sortCriteria, setSortCriteria] = useState('rating')

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      if (ISBN_REGEX.test(query)) {
        return setIsbnQuery(query)
      }
      setSearchQuery(query)
    }
  }, [searchParams])

  useEffect(() => {
    handleSearchClick()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults, sortCriteria])

  const resetInputs = () => {
    setSearchQuery('')
    setIsbnQuery('')
    setIsTypeScript(false)
    setIsJavaScript(false)
    setSelectedValueBookType('')
    setRating(0)
    setSearchResults(books)
  }

  const handleSearchClick = () => {
    const filteredBooks = books?.filter((book) => {
      const matchesSearchQuery = searchQuery
        ? book?.titel.titel.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      const normalizedIsbn = book?.isbn.replaceAll('-', '')
      const normalizedQuery = isbnQuery.replaceAll('-', '').trim()
      const matchesIsbnQuery = isbnQuery
        ? normalizedIsbn?.toString() === normalizedQuery.toString()
        : true
      const matchesTypeScript = isTypeScript
        ? book?.schlagwoerter?.some(
            (keyword) => keyword.toLowerCase() === 'typescript',
          )
        : true
      const matchesJavaScript = isJavaScript
        ? book?.schlagwoerter?.some(
            (keyword) => keyword.toLowerCase() === 'javascript',
          )
        : true
      const matchesBookType = selectedValueBookType
        ? book?.art.toUpperCase() === selectedValueBookType.toUpperCase()
        : true
      const matchesRating = rating ? book?.rating === rating : true

      return (
        matchesSearchQuery &&
        matchesIsbnQuery &&
        matchesTypeScript &&
        matchesJavaScript &&
        matchesBookType &&
        matchesRating
      )
    })

    setSearchResults(
      filteredBooks?.sort((a, b) => {
        switch (sortCriteria) {
          case 'rating':
            return (b.rating ?? 0) - (a.rating ?? 0)
          case 'discount':
            return (b.rabatt ?? 0) - (a.rabatt ?? 0)
          case 'price':
            return (b.preis ?? 0) - (a.preis ?? 0)
          default:
            return 0
        }
      }),
    )
  }

  const calculateDiscountPercentage = (discount:number |undefined) => {
    return discount ? `${(discount * 100).toFixed(2)}%` : '0%';
  }

  return (
    <Container as="section" maxW="1920px" py="20px" ml="15">
      <Box display="flex" justifyContent="center">
        <Heading my="30px" p="20px" fontSize="60">
          Search for Books
        </Heading>
      </Box>
      <Flex gap="20px" mb="20px" alignItems="center">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchClick()
            }
          }}
          placeholder="Search for books..."
          size="md"
          w="300px"
        />
        <Box position="relative" display="inline-block">
          <Input
            value={isbnQuery}
            onChange={(e) => setIsbnQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchClick()
              }
            }}
            placeholder="Search for ISBN..."
            size="md"
            w="200px"
          />
          <Tooltip
            label={
              <>
                <p>Allowed formats:</p>
                <p>123-1-123-12345-1</p>
                <p>or</p>
                <p>1234567890123</p>
              </>
            }
            aria-label="ISBN info"
          >
            <Info
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
              }}
            />
          </Tooltip>
        </Box>
        <Select
          placeholder="Sort by"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          w="150px"
        >
          <option value="rating">Rating</option>
          <option value="discount">Discount</option>
          <option value="price">Price</option>
        </Select>
      </Flex>

      <HStack spacing="40px">
        <VStack align="start" spacing={2}>
          <Text mr="30px" fontWeight="bold">
            Catchwords
          </Text>
          <Checkbox
            isChecked={isTypeScript}
            onChange={(e) => setIsTypeScript(e.target.checked)}
          >
            TypeScript
          </Checkbox>
          <Checkbox
            isChecked={isJavaScript}
            onChange={(e) => setIsJavaScript(e.target.checked)}
          >
            JavaScript
          </Checkbox>
        </VStack>

        <VStack align="start" spacing={2}>
          <Text mr="30px" fontWeight="bold">
            Type
          </Text>
          <RadioGroup
            value={selectedValueBookType}
            onChange={setSelectedValueBookType}
          >
            <VStack align="start" spacing={2}>
              <Radio value="Kindle">Kindle</Radio>
              <Radio value="Druckausgabe">Druckausgabe</Radio>
            </VStack>
          </RadioGroup>
        </VStack>

        <VStack align="flex-start" spacing={2}>
          <Text fontWeight="bold">Rating</Text>
          <StarRating maxStars={5} rating={rating} setRating={setRating} />
        </VStack>
      </HStack>

      <Box mt={4} display="flex" gap="20px">
        <Button colorScheme="blue" onClick={handleSearchClick}>
          Search
        </Button>
        <Button colorScheme="gray" onClick={resetInputs}>
          Reset
        </Button>
      </Box>

      {error ? (
        <Badge colorScheme="red" alignSelf="center">
          {error}
        </Badge>
      ) : (
        <Suspense fallback={<Skeleton />}>
          <Await resolve={searchResults}>
            {(searchResults) => (
              <Table variant="simple" mt="15px">
                <Thead>
                  <Tr>
                    <Th>Title</Th>
                    <Th>ISBN</Th>
                    <Th>Price</Th>
                    <Th>Rating</Th>
                    <Th>Type</Th>
                    <Th>Discount</Th>
                    <Th>In Stock</Th>
                    <Th>Homepage</Th>
                    <Th>Catchwords</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {(searchResults?.length ?? 0) > 0 ? (
                    searchResults?.map((row) => (
                      <Tr key={row.id}>
                        <Td>{row.titel.titel}</Td>
                        <Td>{row.isbn}</Td>
                        <Td>{row.preis}</Td>
                        <Td>{row.rating}</Td>
                        <Td>{row.art}</Td>
                        <Td>{calculateDiscountPercentage(row.rabatt)}</Td>
                        <Td>{row.lieferbar ? 'Yes' : 'No'}</Td>
                        <Td>{row.homepage}</Td>
                        <Td>{row.schlagwoerter?.join(', ')}</Td>
                        <Td>
                          <Button
                            as={Link}
                            href={`/book/${row.id}`}
                            _hover={{ textDecoration: 'none' }}
                            colorScheme="blue"
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={10}>
                        No books found for the search term: {searchQuery}
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </Await>
        </Suspense>
      )}
    </Container>
  )
}
