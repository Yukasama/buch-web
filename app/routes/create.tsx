import {
  Container,
  Box,
  Heading,
  VStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  Badge,
  useToast,
} from '@chakra-ui/react'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { BuchCreateSchema } from '../lib/validators/book'
import { createBook } from '~/utils/rest/write-book'
import { FormMessage } from '~/features/book/form-message'
import { logger } from '~/lib/logger'
import authenticator from '~/services/auth.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request)
  if (!user) {
    return redirect('/login')
  }

  return json({ user })
}

export async function action({ request }: { request: Request }) {
  const user = await authenticator.isAuthenticated(request)
  if (!user) {
    throw new Response('Unauthorized', { status: 401 })
  }

  const formData = await request.formData()
  const data = Object.fromEntries(formData)
  const values = {
    ...data,
    preis: Number(data.preis),
    // rabatt: Number(data.rabatt),
    rating: Number(data.rating),
    lieferbar: data.lieferbar === 'true',
    //schlagwoerter: formData.getAll('schlagwoerter') as string[],
  }

  const validated = BuchCreateSchema.safeParse(values)
  if (!validated.success) {
    logger.debug('create [action] (invalid-fields): values=%o', validated)
    return json({ errors: validated.error.issues }, { status: 400 })
  }

  const { location, error } = await createBook({
    data: validated.data,
    access_token: user.access_token,
  })

  return json({ location, error })
}

export default function CreatePage() {
  const actionData = useActionData<typeof action>()
  const toast = useToast()
  const navigation = useNavigation()

  return (
    <Container as="section" maxW="1920px" py="20px" ml="15">
      <Box display="flex" justifyContent="center">
        <Heading my="30px" p="20px" fontSize="60">
          Create Book
        </Heading>
      </Box>

      <Form method="post">
        <VStack spacing={4} align="stretch">
          <Badge colorScheme="red" alignSelf="center">
            {actionData?.error}
          </Badge>
          {/* ISBN Input */}
          <FormControl>
            <FormLabel>ISBN</FormLabel>
            <Input
              disabled={navigation.state === 'submitting'}
              placeholder="Enter ISBN"
              name="isbn"
            />
            <FormMessage errors={actionData?.errors} field="isbn" />
          </FormControl>

          {/* Price Input */}
          <FormControl>
            <FormLabel>Price</FormLabel>
            <Input type="number" placeholder="Enter Price" name="preis" />
            <FormMessage errors={actionData?.errors} field="preis" />
          </FormControl>

          <FormControl>
            <FormLabel>Titel</FormLabel>
            <Input placeholder="Enter Book Title" name="titelwrapper" />
          </FormControl>

          <FormControl>
            <FormLabel>Untertitel</FormLabel>
            <Input
              type="text"
              placeholder="Enter Book Subtitle"
              name="untertitelwrapper"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Book Type</FormLabel>
            <Select placeholder="Select book type" name="art">
              <option value="KINDLE">KINDLE</option>
              <option value="DRUCKAUSGABE">DRUCKAUSGABE</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Rating</FormLabel>
            <Input
              type="number"
              placeholder="Enter Rating (1-5)"
              name="rating"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Lieferbar</FormLabel>
            <Select placeholder="Is it available?" name="lieferbar">
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Homepage</FormLabel>
            <Input
              type="url"
              placeholder="Enter Homepage URL"
              name="homepage"
            />
          </FormControl>

          <Button
            isLoading={navigation.state === 'submitting'}
            type="submit"
            colorScheme="blue"
          >
            Create
          </Button>
        </VStack>
      </Form>
    </Container>
  )
}
