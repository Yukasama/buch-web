import { ChakraProvider, cookieStorageManagerSSR, Flex } from '@chakra-ui/react'
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react'
import { withEmotionCache } from '@emotion/react'
import { useContext, useEffect, useMemo } from 'react'
import { ServerStyleContext, ClientStyleContext } from './context'
import { LoaderFunction } from '@remix-run/node'
import NavBar from './components/layout/navigation-bar'

export default function App() {
  return (
    <>
      <Outlet />
    </>
  )
}

export const loader: LoaderFunction = ({ request }) => {
  return request.headers.get('cookie') ?? ''
}

export const Layout = withEmotionCache(
  ({ children }: { children: React.ReactNode }, emotionCache) => {
    function getColorMode(cookies: string) {
      const match = RegExp(
        // eslint-disable-next-line security-node/non-literal-reg-expr
        new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`),
      ).exec(cookies)
      return match == null ? void 0 : match[2]
    }

    const DEFAULT_COLOR_MODE: 'dark' | 'light' | null = 'dark'
    const CHAKRA_COOKIE_COLOR_KEY = 'chakra-ui-color-mode'

    let cookies = useLoaderData()
    if (typeof document !== 'undefined') {
      cookies = document.cookie
    }

    const colorMode = useMemo(() => {
      if (typeof cookies === 'string') {
        let color = getColorMode(cookies)

        if (!color && DEFAULT_COLOR_MODE) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          cookies = `${cookies} ${CHAKRA_COOKIE_COLOR_KEY}=${DEFAULT_COLOR_MODE}`
          color = DEFAULT_COLOR_MODE
        }

        return color
      }

      return DEFAULT_COLOR_MODE
    }, [cookies])

    const serverStyleData = useContext(ServerStyleContext)
    const clientStyleData = useContext(ClientStyleContext)

    useEffect(() => {
      emotionCache.sheet.container = document.head
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      tags.forEach((tag) => (emotionCache.sheet as any)._insertTag(tag))
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
            colorModeManager={cookieStorageManagerSSR(cookies as string)}
          >
            <header>
              <NavBar />
            </header>
            {children}
          </ChakraProvider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    )
  },
)

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <html lang="en">
      <head>
        <title>Oops! | Buch Web</title>
        <meta name="description" content="Oops, something went wrong!." />
        <Meta />
        <Links />
      </head>
      <body>
        <Flex justifyContent="center" alignItems="center" pt={350}>
          <h1>
            {isRouteErrorResponse(error)
              ? `${error.status} ${error.statusText}`
              : error instanceof Error
                ? error.message
                : 'Unknown Error'}
          </h1>
        </Flex>
        <Scripts />
      </body>
    </html>
  )
}
