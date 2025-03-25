import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';

import { StateContextProvider } from './context';
import App from './App';
import './index.css';

// Grab the root element and ensure it exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element not found");
}

// Create the React root
const root = ReactDOM.createRoot(rootElement as HTMLElement);

// Render your app wrapped with the ThirdwebProvider
root.render(
  <ThirdwebProvider activeChain={11155111}> 
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider>
);