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
  Flex,
} from '@chakra-ui/react'
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from '@remix-run/react'
import { BuchCreateSchema } from '../lib/validators/book'
import { createBook } from '~/utils/rest/write-book'
import { FormMessage } from '~/features/book/form-message'
import { logger } from '~/lib/logger'
import authenticator from '~/services/auth.server'
import { useEffect } from 'react'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request)
  if (!user || !user.role.includes('admin')) {
    return redirect('/login')
  }

  return json({ remixUrl: process.env.REMIX_URL })
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
    rabatt: Number(data.rabatt),
    rating: Number(data.rating),
    lieferbar: data.lieferbar === 'true',
    //schlagwoerter: formData.getAll('schlagwoerter') as string[],
  }

  const validated = BuchCreateSchema.safeParse(values)
  if (!validated.success) {
    logger.debug('create [action] (invalid-fields): values=%o', validated)
    return json(
      { errors: validated.error.issues, error: '', id: '' },
      { status: 400 },
    )
  }

  const { id, error } = await createBook({
    insertData: validated.data,
    access_token: user.access_token,
  })

  return json({ id, error, errors: [] })
}

export default function CreatePage() {
  const actionData = useActionData<typeof action>()
  const { remixUrl } = useLoaderData<typeof loader>()

  const toast = useToast()
  const navigation = useNavigation()

  useEffect(() => {
    if (actionData?.id) {
      toast({
        title: 'Book created.',
        description: (
          <a
            href={`${remixUrl}/book/${actionData?.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Book at: {remixUrl}/book/{actionData?.id}
          </a>
        ),
        status: 'success',
        duration: 6000,
        isClosable: true,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <Container flexDir="column">
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

          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              disabled={navigation.state === 'submitting'}
              placeholder="Enter Book Title"
              name="titelwrapper"
            />
            {/* @ts-expect-error ts-remix-type-issue */}
            <FormMessage errors={actionData?.errors} field="titelwrapper" />
          </FormControl>

          <FormControl>
            <FormLabel>Subtitle</FormLabel>
            <Input
              disabled={navigation.state === 'submitting'}
              placeholder="Enter Book Subtitle"
              name="untertitelwrapper"
            />
            <FormMessage
              // @ts-expect-error ts-remix-type-issue
              errors={actionData?.errors}
              field="untertitelwrapper"
            />
          </FormControl>

          <FormControl>
            <FormLabel>ISBN</FormLabel>
            <Input
              disabled={navigation.state === 'submitting'}
              placeholder="Enter ISBN"
              name="isbn"
            />
            {/* @ts-expect-error ts-remix-type-issue */}
            <FormMessage errors={actionData?.errors} field="isbn" />
          </FormControl>

          <Flex gap={4}>
            <FormControl>
              <FormLabel>Price</FormLabel>
              <Input
                disabled={navigation.state === 'submitting'}
                type="number"
                placeholder="Enter Price"
                name="preis"
                step="any"
              />
              {/* @ts-expect-error ts-remix-type-issue */}
              <FormMessage errors={actionData?.errors} field="preis" />
            </FormControl>

            <FormControl>
              <FormLabel>Discount in %</FormLabel>
              <Input
                disabled={navigation.state === 'submitting'}
                type="number"
                placeholder="Enter Discount"
                name="rabatt"
                defaultValue={0}
                step="any"
              />
              {/* @ts-expect-error ts-remix-type-issue */}
              <FormMessage errors={actionData?.errors} field="rabatt" />
            </FormControl>
          </Flex>

          <FormControl>
            <FormLabel>Available</FormLabel>
            <Select
              disabled={navigation.state === 'submitting'}
              placeholder="Is it available?"
              name="lieferbar"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
          </FormControl>

          <Flex gap={4}>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select
                disabled={navigation.state === 'submitting'}
                placeholder="Select book type"
                name="art"
              >
                <option value="KINDLE">KINDLE</option>
                <option value="DRUCKAUSGABE">DRUCKAUSGABE</option>
              </Select>
              {/* @ts-expect-error ts-remix-type-issue */}
              <FormMessage errors={actionData?.errors} field="art" />
            </FormControl>

            <FormControl>
              <FormLabel>Rating</FormLabel>
              <Input
                type="number"
                disabled={navigation.state === 'submitting'}
                placeholder="Enter Rating (1-5)"
                name="rating"
              />
              {/* @ts-expect-error ts-remix-type-issue */}
              <FormMessage errors={actionData?.errors} field="rating" />
            </FormControl>
          </Flex>

          <FormControl>
            <FormLabel>Homepage</FormLabel>
            <Input
              type="url"
              disabled={navigation.state === 'submitting'}
              placeholder="Enter Homepage URL"
              name="homepage"
            />
            {/* @ts-expect-error ts-remix-type-issue */}
            <FormMessage errors={actionData?.errors} field="homepage" />
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
