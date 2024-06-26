// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { useEffect, useState } from 'react'
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

  const [inputUsername, setInputUsername] = useState()
  const [inputPassword, setInputPassword] = useState()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const handleInputChangeUsername = (e: any) => setInputUsername(e.target.value)

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  const handleInputChangePassword = (e: any) => setInputPassword(e.target.value)

  const usernameError = inputUsername === ''
  const passwordError = inputPassword === ''

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
  }, [actionData, toast])

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
              <FormControl isInvalid={usernameError}>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  value={inputUsername}
                  onChange={handleInputChangeUsername}
                  disabled={navigation.state === 'submitting'}
                  placeholder="Enter your username"
                />
                {usernameError ? (
                  <FormErrorMessage>Username is required</FormErrorMessage>
                ) : (
                  <></>
                )}
              </FormControl>
            </Box>
            <Box>
              <FormControl isInvalid={passwordError}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  name="password"
                  value={inputPassword}
                  onChange={handleInputChangePassword}
                  disabled={navigation.state === 'submitting'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                {passwordError ? (
                  <FormErrorMessage>Password is required</FormErrorMessage>
                ) : (
                  <></>
                )}
              </FormControl>
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
