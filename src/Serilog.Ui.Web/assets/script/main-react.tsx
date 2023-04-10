import { createRoot } from 'react-dom/client';
import App from './Components/App';

// Render your React component instead
const root = createRoot(document.getElementById('serilog-ui-app'));

root.render(<App />);
