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
import authenticator from '~/services/auth.server'

// export const action: ActionFunction = async ({ request, context }) => {
//   // call my authenticator
//   return await authenticator.authenticate('form', request, {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     throwOnError: true,
//     context,
//   })
// }

export async function action({ request }: ActionFunctionArgs) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
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

/**
 * get the cookie and see if there are any errors that werey
 * generated when attempting to login
 *
 * @param param0
 * @returns
 */
// export const loader: LoaderFunction = async ({ request }) => {
//   await authenticator.isAuthenticated(request, {
//     successRedirect: '/',
//   })

//   const session = await sessionStorage.getSession(request.headers.get('Cookie'))

//   const error = session.get('sessionErrorKey')
//   return json<any>({ error })
// }

export default function Login() {
  return (
    <Center mt="120px">
      <Box borderWidth="1px" borderRadius="lg" p="20px">
        <Text fontSize="40px" textDecoration="underline" textAlign="left">
          Login
        </Text>
        <Form action="/auth/keycloak" method="post">
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
            <Button variant="solid" mt="12px">
              Log in
            </Button>
          </Box>
        </Form>
      </Box>
    </Center>
  )
}

// {/* {loaderData?.error ? <p>ERROR: {loaderData?.error?.message}</p> : null} */}
