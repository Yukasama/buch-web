import { ChakraProvider, cookieStorageManagerSSR, Flex } from '@chakra-ui/react'
import { withEmotionCache } from '@emotion/react'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import { ReactNode, useContext, useEffect, useMemo } from 'react'
import NavBar from './features/home/navigation-bar'
import authenticator from './services/auth.server'
import {
  ClientStyleContext,
  ServerStyleContext,
} from './utils/chakra-ui/context'

export default function App() {
  return <Outlet />
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request)
  const themeCookie = request.headers.get('cookie') ?? ''

  return json({ user, themeCookie })
}

export const Layout = withEmotionCache(
  ({ children }: { children: ReactNode }, emotionCache) => {
    function getColorMode(cookies: string) {
      // eslint-disable-next-line security/detect-non-literal-regexp
      const match = new RegExp(
        // eslint-disable-next-line security-node/non-literal-reg-expr
        new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`),
      ).exec(cookies)
      return match == undefined ? void 0 : match[2]
    }

    const DEFAULT_COLOR_MODE: 'dark' | 'light' | null = 'dark'
    const CHAKRA_COOKIE_COLOR_KEY = 'chakra-ui-color-mode'

    const loaderData = useLoaderData<typeof loader>() || {}
    let themeCookie = loaderData.themeCookie || ''
    const user = loaderData.user ?? undefined

    if (typeof document !== 'undefined') {
      themeCookie = document.cookie
    }

    const colorMode = useMemo(() => {
      if (typeof themeCookie === 'string') {
        let color = getColorMode(themeCookie)

        if (!color && DEFAULT_COLOR_MODE) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          themeCookie = `${themeCookie} ${CHAKRA_COOKIE_COLOR_KEY}=${DEFAULT_COLOR_MODE}`
          color = DEFAULT_COLOR_MODE
        }

        return color
      }

      return DEFAULT_COLOR_MODE
    }, [themeCookie])

    const serverStyleData = useContext(ServerStyleContext)
    const clientStyleData = useContext(ClientStyleContext)

    useEffect(() => {
      emotionCache.sheet.container = document.head
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      for (const tag of tags) (emotionCache.sheet as any)._insertTag(tag)
      clientStyleData?.reset()

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <html
        lang="en"
        {...(colorMode && {
          'data-theme': colorMode,
          style: { colorScheme: colorMode },
        })}
      >
        <head>
          <title>Buch-Web</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="On Buch-Web, you can buy books." />
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body
          {...(colorMode && {
            className: `chakra-ui-${colorMode}`,
          })}
        >
          <ChakraProvider
            colorModeManager={cookieStorageManagerSSR(themeCookie)}
          >
            <header>
              <NavBar user={user} />
            </header>
            {children}
          </ChakraProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    )
  },
)

export function ErrorBoundary() {
  const thrownError = useRouteError()

  let error
  if (isRouteErrorResponse(thrownError)) {
    error = `${thrownError.status} ${thrownError.statusText}`
  } else if (thrownError instanceof Error) {
    error = thrownError.message
  } else {
    error = 'Internal server error'
  }

  return (
    <html lang="en">
      <head>
        <title>Oops! | Buch-Web</title>
        <meta name="description" content="Oops, something went wrong!." />
        <Meta />
        <Links />
      </head>
      <body>
        <Flex justifyContent="center" alignItems="center" pt={350}>
          <h1>{error}</h1>
        </Flex>
        <Scripts />
      </body>
    </html>
  )
}
