import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
  AppShell,
} from '@mantine/core';
import { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import SerilogResults from './Table/Table';

const App = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS>
        <AppShell navbar={<Sidebar></Sidebar>}>
          <SerilogResults />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default App;
