import {
  Container,
  Box,
  Checkbox,
  Heading,
  Text,
  Radio,
  RadioGroup,
  VStack,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react'
import { useState } from 'react'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isbnQuery, setIsbnQuery] = useState('')
  const [numberValue, setNumberValue] = useState(0)
  const [selectedValueKeywords, setSelectedValueKeywords] = useState('')
  const [selectedValueBookType, setSelectedValueBookType] = useState('')
  const [showNumberInput, setShowNumberInput] = useState(false)
  const handleCheckboxChange = () => {
    setShowNumberInput(!showNumberInput)
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

        <Box>
          <Checkbox onChange={handleCheckboxChange} colorScheme="blue">
            Nach Rating suchen
          </Checkbox>
          {showNumberInput && (
            <NumberInput
              value={numberValue}
              onChange={(valueString) => setNumberValue(parseInt(valueString))}
              min={0}
              max={5}
              clampValueOnBlur
              size="sm"
              w="60px"
              mt="10px"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          )}
        </Box>
      </HStack>

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
