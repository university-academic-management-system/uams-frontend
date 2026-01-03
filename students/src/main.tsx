
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import router from './router';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
