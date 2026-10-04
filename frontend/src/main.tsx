import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import App from './App'
import './app.css'

const theme = createTheme({
	palette: {
		primary: { main: '#245c49' },
		secondary: { main: '#df684d' },
		background: { default: '#f4f3ee', paper: '#fffefa' },
		text: { primary: '#202820', secondary: '#69716a' },
	},
	typography: {
		fontFamily: '"DM Sans", "Segoe UI", sans-serif',
		button: { textTransform: 'none', fontWeight: 700 },
	},
	shape: { borderRadius: 8 },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<App />
		</ThemeProvider>
	</React.StrictMode>,
)
