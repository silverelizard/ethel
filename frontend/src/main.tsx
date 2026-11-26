import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import theme, { COLOR_MODE_STORAGE_KEY, colorModeManager } from '@/theme'
import App from './App'
import { ApiError, setUnauthorizedHandler } from '@/api/client'
import { AUTH_QUERY_KEY, markLoggedOut } from '@/hooks/useAuth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // Retrying won't fix a missing session.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status === 401) && failureCount < 1,
    },
  },
})

// Session expired or cookie removed mid-use: drop cached data and show login.
setUnauthorizedHandler(() => {
  if (queryClient.getQueryData(AUTH_QUERY_KEY) === true) {
    markLoggedOut(queryClient)
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeScript
      initialColorMode={theme.config.initialColorMode}
      storageKey={COLOR_MODE_STORAGE_KEY}
    />
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
        <App />
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>,
)
