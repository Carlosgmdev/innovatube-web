import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './config/theme'
import Router from './Router'

import "@fontsource/quicksand"
import { Toaster } from 'sonner'
import useGlobalStore from './store/useGlobalStore'
import Spinner from './components/Spinner'

function App() {
  const { loading } = useGlobalStore()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router />
      <Toaster
        position='bottom-left'
        expand
        richColors
      />
      {loading && <Spinner />}
    </ThemeProvider>
  )
}

export default App
