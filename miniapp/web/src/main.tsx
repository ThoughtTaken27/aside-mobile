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
import { warmMarkdown } from './components/MarkdownAsync';

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

/*
 * Fetch the markdown renderer once the first screen is up.
 *
 * It is deliberately not on the critical path (see MarkdownAsync.tsx), but
 * it is needed the moment a thread has content, and the app restores the
 * last session on launch. This fires after the first paint has been handed
 * to the compositor, so it competes with nothing, and it overlaps the
 * `/api/thread` round trip that has to happen anyway.
 */
requestAnimationFrame(() => {
  const warm = () => warmMarkdown();
  if ('requestIdleCallback' in window) {
    (window as unknown as {
      requestIdleCallback: (cb: () => void, o?: { timeout: number }) => void;
    }).requestIdleCallback(warm, { timeout: 500 });
  } else {
    setTimeout(warm, 0);
  }
});
