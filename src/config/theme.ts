import { createTheme } from "@mui/material"

const theme = createTheme({
  typography: {
    fontFamily: 'Quicksand, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#f51587'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 32,
        }
      }
    },
  }
})

export default theme