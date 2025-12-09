import RootLayout from '@/components/layouts/RootLayout';
import Demo from '@/pages/Index';
import { createBrowserRouter } from 'react-router'

const appRoutes = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <Demo />,
            },
            {
                path: '/payments',
                element: <Demo />,
            },
            {
                path: '/settings',
                element: <Demo />,
            },
        ],
    },
])

export default appRoutes;
