import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SaveManagerProvider } from './context/SaveManagerContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SaveManagerProvider>
      <App />
    </SaveManagerProvider>
  </StrictMode>,
);
