import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import theme from '@/theme'
import App from './App'
import { ApiError, setUnauthorizedHandler } from '@/api/client'
import { AUTH_QUERY_KEY } from '@/hooks/useAuth'

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
    queryClient.clear()
    queryClient.setQueryData(AUTH_QUERY_KEY, false)
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>,
)
