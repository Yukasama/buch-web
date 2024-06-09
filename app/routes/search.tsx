import {
  Container,
  Box,
  Heading,
  Text,
  Radio,
  RadioGroup,
  VStack,
  HStack,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button, // Import Button component
} from '@chakra-ui/react'
import StarRating from '../components/star-rating'
import { useState, useEffect } from 'react'
import { useSearchParams } from '@remix-run/react'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isbnQuery, setIsbnQuery] = useState('')
  const [selectedValueKeywords, setSelectedValueKeywords] = useState('')
  const [selectedValueBookType, setSelectedValueBookType] = useState('')
  const [rating, setRating] = useState(0) // New state for the rating
  const [searchParams] = useSearchParams()

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

  // Reset all input elements to their initial state
  const resetInputs = () => {
    setSearchQuery('')
    setIsbnQuery('')
    setSelectedValueKeywords('')
    setSelectedValueBookType('')
    setRating(0) // Reset the rating
  }

  // Beispiel-Daten für die Tabelle
  const exampleData = [
    { column1: 'Data 1', column2: 'Data 2', column3: 'Data 3' },
    { column1: 'Data 4', column2: 'Data 5', column3: 'Data 6' },
    { column1: 'Data 7', column2: 'Data 8', column3: 'Data 9' },
  ]

  return (
    <Container as="section" maxW="1920px" py="20px" ml="15">
      <Box display="flex" justifyContent="center">
        <Heading my="30px" p="20px" fontSize="60">
          Search for Books
        </Heading>
      </Box>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for books..."
          size="md"
          w="300px"
        />
        <Input
          value={isbnQuery}
          onChange={(e) => setIsbnQuery(e.target.value)}
          placeholder="Search for ISBN..."
          size="md"
          w="200px"
        />
      </div>

      <HStack spacing="40px">
        <VStack align="start" spacing={2}>
          <Text mr="30px" fontWeight="bold">
            Schlagwörter
          </Text>
          <RadioGroup
            value={selectedValueKeywords}
            onChange={setSelectedValueKeywords}
          >
            <VStack align="start" spacing={2}>
              <Radio value="option1">TypScript</Radio>
              <Radio value="option2">JavaScript</Radio>
            </VStack>
          </RadioGroup>
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
              <Radio value="option3">Kindle</Radio>
              <Radio value="option4">Drukausgabe</Radio>
            </VStack>
          </RadioGroup>
        </VStack>

        <VStack align="flex-start" spacing={2}>
          <Text fontWeight="bold">Rating</Text>
          <StarRating maxStars={5} rating={rating} setRating={setRating} />{' '}
          {/* Pass rating state and setter */}
        </VStack>
      </HStack>

      {/* Button to reset all input elements */}
      <Box mt={4}>
        <Button colorScheme="gray" onClick={resetInputs}>
          Reset
        </Button>
      </Box>

      {/* Tabelle für die Anzeige der Daten */}
      <Table variant="simple" mt="15px">
        <Thead>
          <Tr>
            <Th>Titel</Th>
            <Th>ISBN</Th>
            <Th>Preis</Th>
          </Tr>
        </Thead>
        <Tbody>
          {exampleData.map((row, index) => (
            <Tr key={index}>
              <Td>{row.column1}</Td>
              <Td>{row.column2}</Td>
              <Td>{row.column3}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Container>
  )
}
