import {
  Container,
  Box,
  Heading,
  Radio,
  RadioGroup,
  VStack,
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Schema für die Validierung
const bookSchema = z.object({
  isbn: z
    .string()
    .min(10, { message: 'Ungültige ISBN, muss mindestens 10 Zahlen haben' })
    .max(13, { message: 'Ungültige ISBN, darf höchstens 13 Zahlen haben' })
    .regex(/^\d{10}$|^\d{13}$/, 'Ungültige ISBN, muss 10 oder 13 Zahlen haben'),
  price: z
    .number()
    .positive({ message: 'Der Preis muss positiv sein' })
    .min(1, { message: 'Der Preis muss mindestens 1 sein' }),
  name: z.string().nonempty({ message: 'Der Name ist erforderlich' }),
  bookType: z.enum(['Kindle', 'Druckausgabe'], {
    errorMap: () => ({ message: 'Buchart ist erforderlich' }),
  }),
  keyword: z.array(z.enum(['TypeScript', 'JavaScript'])).optional(),
})

type BookFormValues = z.infer<typeof bookSchema>

export default function CreatePage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
  })

  const onSubmit: SubmitHandler<BookFormValues> = async (data) => {
    // eslint-disable-next-line security-node/detect-crlf
    console.log(data)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simuliere eine Verzögerung für den asynchronen Vorgang
    reset() // Formular zurücksetzen
  }

  return (
    <Container as="section" maxW="1920px" py="20px" ml="15">
      <Box display="flex" justifyContent="center">
        <Heading my="30px" p="20px" fontSize="60">
          Create Book
        </Heading>
      </Box>

      <form
        onSubmit={(e) => {
          void handleSubmit((data) => {
            onSubmit(data)
          })(e)
        }}
      >
        <VStack spacing={4} align="stretch">
          {/* ISBN Input */}
          <FormControl isInvalid={!!errors.isbn}>
            <FormLabel>ISBN</FormLabel>
            <Input type="text" placeholder="Enter ISBN" {...register('isbn')} />
            <FormErrorMessage>{errors.isbn?.message}</FormErrorMessage>
          </FormControl>

          {/* Price Input */}
          <FormControl isInvalid={!!errors.price}>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              placeholder="Enter Price"
              {...register('price', { valueAsNumber: true })}
            />
            <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
          </FormControl>

          {/* Name Input */}
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter Book Name"
              {...register('name')}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          {/* Book Type Radio Group */}
          <FormControl isInvalid={!!errors.bookType}>
            <FormLabel>Book Type</FormLabel>
            <RadioGroup>
              <HStack>
                <Radio
                  value="Kindle"
                  {...register('bookType')}
                  defaultChecked={false}
                >
                  Kindle
                </Radio>
                <Radio value="Druckausgabe" {...register('bookType')}>
                  Druckausgabe
                </Radio>
              </HStack>
            </RadioGroup>
            <FormErrorMessage>{errors.bookType?.message}</FormErrorMessage>
          </FormControl>

          {/* Keyword Checkbox Group */}
          <FormControl>
            <FormLabel>Schlagwort</FormLabel>
            <CheckboxGroup>
              <HStack spacing="24px">
                <Checkbox
                  value="TypeScript"
                  {...register('keyword')}
                  defaultChecked={false}
                >
                  TypeScript
                </Checkbox>
                <Checkbox
                  value="JavaScript"
                  {...register('keyword')}
                  defaultChecked={false}
                >
                  JavaScript
                </Checkbox>
              </HStack>
            </CheckboxGroup>
          </FormControl>

          {/* Submit Button */}
          <Button type="submit" colorScheme="blue">
            Create
          </Button>
        </VStack>
      </form>
    </Container>
  )
}
