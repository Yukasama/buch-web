import {
  Container,
  Box,
  Heading,
  Text,
  Radio,
  RadioGroup,
  Checkbox,
  VStack,
  HStack,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Tooltip,
} from '@chakra-ui/react'
import { StarRating } from '../features/search/star-rating'
import { useState, useEffect } from 'react'
import { useSearchParams } from '@remix-run/react'
import { Buch } from '../lib/validators/book'
import { getAllBooks } from '../utils/rest/read-books'
import { Info } from 'lucide-react'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isbnQuery, setIsbnQuery] = useState('')
  const [isTypeScript, setIsTypeScript] = useState(false)
  const [isJavaScript, setIsJavaScript] = useState(false)
  const [selectedValueBookType, setSelectedValueBookType] = useState('')
  const [rating, setRating] = useState(0)
  const [searchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState<Buch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [books, setBooks] = useState<Buch[]>([])

  useEffect(() => {
    const query = searchParams.get('query')
    if (query) {
      if (/^\d{10}$|^\d{13}$/.test(query)) {
        setIsbnQuery(query)
      } else {
        setSearchQuery(query)
      }
    }
  }, [searchParams])

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true)
      setError('')

      try {
        const booksData: Buch[] = await getAllBooks()

        setBooks(booksData)
        setSearchResults(booksData)
      } catch (error) {
        setError('Error fetching books data')
        console.error('Error fetching books:', error)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchBooks()
  }, [])

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
    const filteredBooks = books.filter((book) => {
      const matchesSearchQuery = searchQuery
        ? book.titel.titel.toLowerCase().includes(searchQuery.toLowerCase())
        : true
      const normalizedIsbn = book.isbn.replace(/-/g, '')
      const normalizedQuery = isbnQuery.replace(/-/g, '').trim()
      const matchesIsbnQuery = isbnQuery
        ? normalizedIsbn.toString() === normalizedQuery.toString()
        : true
      const matchesTypeScript = isTypeScript
        ? book.schlagwoerter?.some(
            (keyword) => keyword.toLowerCase() === 'typescript',
          )
        : true
      const matchesJavaScript = isJavaScript
        ? book.schlagwoerter?.some(
            (keyword) => keyword.toLowerCase() === 'javascript',
          )
        : true
      const matchesBookType = selectedValueBookType
        ? book.art.toUpperCase() === selectedValueBookType.toUpperCase()
        : true
      const matchesRating = rating ? book.rating === rating : true

      return (
        matchesSearchQuery &&
        matchesIsbnQuery &&
        matchesTypeScript &&
        matchesJavaScript &&
        matchesBookType &&
        matchesRating
      )
    })

    setSearchResults(filteredBooks)
  }

  return (
    <Container as="section" maxW="1920px" py="20px" ml="15">
      <Box display="flex" justifyContent="center">
        <Heading my="30px" p="20px" fontSize="60">
          Search for Books
        </Heading>
      </Box>
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          alignItems: 'center',
        }}
      >
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
                Erlaubte Formate:
                <br />
                123-1-123-12345-1
                <br />
                oder
                <br />
                1234567890123
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
      </div>

      <HStack spacing="40px">
        <VStack align="start" spacing={2}>
          <Text mr="30px" fontWeight="bold">
            Schlagwörter
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
            Buchart
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

      {isLoading && <Text>Loading...</Text>}
      {error && <Text color="red.500">Error: {error}</Text>}
      {!isLoading && !error && (
        <Table variant="simple" mt="15px">
          <Thead>
            <Tr>
              <Th>Titel</Th>
              <Th>ISBN</Th>
              <Th>Preis</Th>
              <Th>Rating</Th>
              <Th>Art</Th>
              <Th>Rabatt</Th>
              <Th>Lieferbar</Th>
              <Th>Datum</Th>
              <Th>Homepage</Th>
              <Th>Schlagwörter</Th>
            </Tr>
          </Thead>
          <Tbody>
            {searchResults.length > 0 ? (
              searchResults.map((row) => (
                <Tr key={row.id}>
                  <Td>{row.titel.titel}</Td>
                  <Td>{row.isbn}</Td>
                  <Td>{row.preis}</Td>
                  <Td>{row.rating}</Td>
                  <Td>{row.art}</Td>
                  <Td>{row.rabatt}</Td>
                  <Td>{row.lieferbar ? 'True' : 'False'}</Td>
                  <Td>{row.datum}</Td>
                  <Td>{row.homepage}</Td>
                  <Td>{row.schlagwoerter?.join(', ')}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={10}>Keine Ergebnisse gefunden</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
    </Container>
  )
}
