import {
  Box,
  Button,
  FormLabel,
  Input,
  Text,
  Center,
  Image,
  Flex,
} from '@chakra-ui/react'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form, useNavigation } from '@remix-run/react'
import authenticator from '~/services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  })
}

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate('form', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  })
}

export default function Login() {
  const navigation = useNavigation()

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
