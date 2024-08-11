'use client'

import { Box, Button, Stack, TextField, createTheme, ThemeProvider, Typography } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

// Define the custom theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00b4d8',  // Example blue color for assistant messages
    },
    secondary: {
      main: '#03dac6',  // Example teal color for user messages
    },
    background: {
      default: '#FF7F50',  // Adjusted darker blue background color for overall UI
      paper: '#FFFFFF',    // Slightly different shade for paper elements, adjust as needed
    },
    text: {
      primary: '#FF7F50',  // Primary text color
      secondary: '#FFFFFF' // Secondary text color (less emphasis)
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          input: {
            color: '#FFFFFF', // Ensures text field text is also light
          },
          label: {
            color: '#FFFFFF' // Ensures label color is light
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#FFFFFF', // Button text color
        }
      }
    }
  }
});

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I’m Auditor AI, your personal AI therapist. How can I support and comfort you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ThemeProvider theme={darkTheme}>
     <Box
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography
        variant="h1"
        component="h1"
        color="coral"
      >
        Welcome to Auditor AI
      </Typography>
      <Typography
        variant="h5"
        color="coral"
      >
        Your friendly AI chatbot ready to listen to your problems and provide
      </Typography>
      <Typography
        variant="h3"
        color="coral"
        style={{ fontWeight: 'bold' }}
      >
         SUPPORT
      </Typography>
    </Box>
      <Box
        sx={{
          bgcolor: 'background.default',
          color: 'text.secondary',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >

  <Typography
        variant="h3"
        color="white"
      >
         Your Personal Therapist
      </Typography>
      <Typography
        variant="h3"
        color="white"
        style={{ fontWeight: 'bold' }}
      >
         'Auditor'
      </Typography>


        <Stack
          direction={'column'}
          width="500px"
          height="700px"
          border="1px solid #FFFFFF"
          p={3}
          spacing={5}
        >
          <Stack
            direction={'column'}
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
            sx={{ backgroundColor: '#FF7F50' }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  bgcolor={
                    message.role === 'assistant'
                      ? 'primary.main'
                      : 'secondary.main'
                  }
                  color="white"
                  borderRadius={5}
                  p={2}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
          <Stack direction={'row'} spacing={2}>
            <TextField
              label="Message"
              fullWidth
              borderRadius={12}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <Button variant="contained"
              onClick={sendMessage}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}