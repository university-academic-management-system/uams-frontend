import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { Provider as ChakraProvider } from '@components/ui/provider'
import { Toaster } from '@components/ui/toaster'


// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    },
})

const AppProviders = ({ children }: { children: React.ReactNode }) => {

    return (
        <ChakraProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster />
            </QueryClientProvider>
        </ChakraProvider>
    )
}

export default AppProviders;    