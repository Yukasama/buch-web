import {
  Box,
  Button,
  Center,
  Flex,
  FormLabel,
  Image,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { useEffect } from 'react'
import { AuthorizationError } from 'remix-auth'
import authenticator from '~/services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  })
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate('form', request, {
      successRedirect: '/',
      throwOnError: true,
    })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof AuthorizationError) {
      return error
    }
  }
}

export default function Login() {
  const navigation = useNavigation()
  const toast = useToast()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const actionData = useActionData<typeof action>()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (actionData?.cause.status === 401) {
      toast({
        title: 'Sign in failed',
        description: 'Credentials are incorrect',
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData])

  return (
    <Center mt="120px">
      <Flex flexDir="column" width={400} gap={7}>
        <Flex flexDir="column" alignItems="center">
          <Image src="/logo.png" alt="Logo" boxSize="60px" />
          <Text fontSize="24px" fontWeight={600}>
            Sign in to your account
          </Text>
          <Text color="gray.500">
            Enter your credentials to sign in to your account.
          </Text>
        </Flex>
        <Form method="post">
          <Flex flexDir="column" gap={3}>
            <Box>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                disabled={navigation.state === 'submitting'}
                placeholder="Enter your username"
                required
              />
            </Box>
            <Box>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                disabled={navigation.state === 'submitting'}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </Box>
            <Button
              isLoading={navigation.state === 'submitting'}
              colorScheme="blue"
              mt="12px"
              type="submit"
            >
              Sign In
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Center>
  )
}
