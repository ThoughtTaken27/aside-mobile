import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './theme/tokens.css';
import './theme/base.css';
import './theme/components.css';
import App from './App';
import { ImageLightbox } from './components/ImageLightbox';
import { registerServiceWorker } from './standalone';

// Installability, and only from the standalone entry point. See standalone.ts.
registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/*
      Mounted beside the app rather than inside it: any image anywhere --
      an answer, a tool step, a subagent's card -- opens it by raising a
      window event, so it must not live inside a screen that unmounts when
      the user navigates.
    */}
    <ImageLightbox />
  </StrictMode>,
);
