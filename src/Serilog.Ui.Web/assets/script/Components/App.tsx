import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  AppShell,
} from '@mantine/core';
import { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import SerilogResults from './Table/Table';
import Search from './Search/Search';
import { QueryClientProvider } from '@tanstack/react-query/build/lib/QueryClientProvider';
import { QueryClient } from '@tanstack/react-query/';

const App = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  const queryClient = new QueryClient();

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS>
        <QueryClientProvider client={queryClient}>
          <AppShell navbar={<Sidebar></Sidebar>}>
            <Search />
            <SerilogResults />
          </AppShell>
        </QueryClientProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
