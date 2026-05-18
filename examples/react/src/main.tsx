import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@verdocs/web-sdk-react/dist/globals.css';
import './styles/verdocs-custom-theme.css';
import './styles/app.css';
import {App} from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
