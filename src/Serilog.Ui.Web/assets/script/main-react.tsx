import { createRoot } from 'react-dom/client';
import App from './Components/App.tsx';

// Render your React component
const main = async () => {
  const rootItem = document.getElementById('serilog-ui-app');
  if (rootItem == null)
    throw new Error(
      'React app item not found. Are you sure you loaded correctly the HTML content?',
    );

  const root = createRoot(rootItem);

  if (process.env.NODE_ENV === 'development') {
    // mock fetch for development

    const { worker } = await import('../__tests__/util/mocks/msw-worker.ts');
    try {
      await worker.start();
    } catch (err) {
      console.error(err);
    }
  }

  root.render(<App />);
};

void main();
