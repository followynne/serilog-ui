import { createRoot } from 'react-dom/client';
import App from './Components/App';

// Render your React component
const main = async () => {
  const root = createRoot(document.getElementById('serilog-ui-app'));

  if (process.env.NODE_ENV === 'development') {
    // mock fetch for development

    const { worker } = await import('../__tests__/util/mocks/msw-worker');
    try {
      await worker.start();
    } catch (err) {
      console.error(err);
    }
  }

  root.render(<App />);
};

main();
