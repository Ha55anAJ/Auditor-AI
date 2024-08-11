import { Button, Typography, Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'background.default' }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Auditor AI
        </Typography>
        <Typography sx={{ mb: 4 }}>
          Explore our AI capabilities
        </Typography>
        <Link href="/chat" passHref>
          <Button variant="contained" color="primary">
            Go to Chatbot
            </Button>
        </Link>
      </Box>
    </ThemeProvider>
  );
}