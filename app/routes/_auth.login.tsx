import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  VStack,
  Text,
  Center,
} from '@chakra-ui/react'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { logger } from '~/lib/logger'
import authenticator from '~/services/auth.server'

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate('form', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  })
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  })
}

export default function Login() {
  logger.debug('login site opened')
  return (
    <Center mt="120px">
      <Box borderWidth="1px" borderRadius="lg" p="20px">
        <Text fontSize="40px" textDecoration="underline" textAlign="left">
          Login
        </Text>
        <Form method="post">
          <FormControl>
            <VStack align="left" m="32px">
              <FormLabel mb="-4px">Username</FormLabel>
              <Input
                type="username"
                name="username"
                placeholder="username"
                required
              />
              <FormLabel mb="-4px">Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="password"
                autoComplete="current-password"
                required
              />
            </VStack>
          </FormControl>
          <Box display="flex" justifyContent="flex-end">
            <Spacer />
            <Button variant="solid" mt="12px" type="submit">
              Log in
            </Button>
          </Box>
        </Form>
      </Box>
    </Center>
  )
}

// {/* {loaderData?.error ? <p>ERROR: {loaderData?.error?.message}</p> : null} */}
