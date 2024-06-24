/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { CacheProvider } from '@emotion/react'
import { RemixBrowser } from '@remix-run/react'
import {
  ReactNode,
  startTransition,
  StrictMode,
  useMemo,
  useState,
} from 'react'
import { hydrateRoot } from 'react-dom/client'
import { ClientStyleContext } from './utils/chakra-ui/context'
import createEmotionCache, {
  defaultCache,
} from './utils/chakra-ui/create-emotion-cache'

interface ClientCacheProviderProps {
  children: ReactNode
}

function ClientCacheProvider({ children }: Readonly<ClientCacheProviderProps>) {
  const [cache, setCache] = useState(defaultCache)

  const providerValue = useMemo(
    () => ({
      reset: () => setCache(createEmotionCache()),
    }),
    [],
  )

  return (
    <ClientStyleContext.Provider value={providerValue}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  )
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ClientCacheProvider>
        <RemixBrowser />
      </ClientCacheProvider>
    </StrictMode>,
  )
})
