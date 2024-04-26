import { ChakraProvider, cookieStorageManagerSSR } from '@chakra-ui/react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import { withEmotionCache } from '@emotion/react'
import { useContext, useEffect, useMemo } from 'react'
import { ServerStyleContext, ClientStyleContext } from './context'
import { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request }) => {
  return request.headers.get('cookie') ?? ''
}

export const Layout = withEmotionCache(
  ({ children }: { children: React.ReactNode }, emotionCache) => {
    function getColorMode(cookies: string) {
      const match = RegExp(
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
      let color = getColorMode(cookies as string)

      if (!color && DEFAULT_COLOR_MODE) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        cookies += ` ${CHAKRA_COOKIE_COLOR_KEY}=${DEFAULT_COLOR_MODE}`
        color = DEFAULT_COLOR_MODE
      }

      return color
    }, [cookies])

    const serverStyleData = useContext(ServerStyleContext)
    const clientStyleData = useContext(ClientStyleContext)

    useEffect(() => {
      emotionCache.sheet.container = document.head
      const tags = emotionCache.sheet.tags
      emotionCache.sheet.flush()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
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
            {children}
          </ChakraProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    )
  },
)

export default function App() {
  return <Outlet />
}
