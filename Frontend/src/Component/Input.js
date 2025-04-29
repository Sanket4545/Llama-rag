import React, { useState, useEffect, useCallback } from 'react';
import { Box, TextField, Button, IconButton, Typography, CircularProgress, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import Person2Icon from '@mui/icons-material/Person2';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ThinkingAnimation = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography>Thinking</Typography>
    {[0, 1, 2].map((dot) => (
      <Box
        key={dot}
        sx={{
          width: 8,
          height: 8,
          backgroundColor: 'primary.main',
          borderRadius: '50%',
          animation: 'blink 1.2s linear infinite',
          animationDelay: `${dot * 0.2}s`,
          '@keyframes blink': {
            '0%': { opacity: 0 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0 },
          },
        }}
      />
    ))}
  </Box>
);

const Input = ({ onMessageUpdate, promptMessage, isLoading, setIsLoading, onSignOut }) => {
  const [inputData, setInputData] = useState({
    message: '',
    uploadedFileName: '',
    error: '',
  });
  const { message, uploadedFileName } = inputData;
  const [openToast, setOpenToast] = useState(false);
  const navigate = useNavigate();

  const setField = useCallback((field, value) => {
    setInputData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSignOut = useCallback(async () => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    try {
      await axios.post(`${apiBaseUrl}/api/auth/logout`);
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      ['access_token', 'refresh_token', 'expiration_time'].forEach((key) => localStorage.removeItem(key));
      onSignOut();
    }
  }, [onSignOut]);

  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenToast(false);
  };

  const handleSendClick = useCallback(async () => {
    if (!message.trim()) return;

    const displayMessage = (
      <>
        {uploadedFileName && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F1F1F1',
              borderRadius: '8px',
              p: '8px 12px',
              mb: 1,
              maxWidth: '60%',
            }}
          >
            <InsertDriveFileRoundedIcon color="primary" />
            <Typography variant="body2" sx={{ ml: 1, color: '#1A1A1A' }}>{uploadedFileName}</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Person2Icon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ color: '#333' }}>{message.trim()}</Typography>
        </Box>
      </>
    );

    const finalMessage = uploadedFileName
      ? `Message: ${message.trim()}\nFile: ${uploadedFileName}`
      : message.trim();

    onMessageUpdate((prevMessages) => [
      ...prevMessages,
      { text: displayMessage, sender: 'user' }
    ]);

    setIsLoading(true);
    setField('error', '');

    onMessageUpdate((prevMessages) => [
      ...prevMessages,
      { isThinking: true, sender: 'assistant', component: ThinkingAnimation }
    ]);

    try {
      const response = await fetch('http://localhost:5000/api/pdf/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ query: finalMessage }),
      });

      if (response.status === 403) {
        setOpenToast(true);
        setTimeout(() => {
          handleSignOut();
          navigate('/login');
        }, 5000);
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch response from API');
      onMessageUpdate((prevMessages) => prevMessages.filter((msg) => !msg.isThinking));

      const assistantMessage = { text: '', sender: 'assistant', isMarkdown: true };
      onMessageUpdate((prevMessages) => [...prevMessages, assistantMessage]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let currentText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value).replace(/^data:\s*/gm, '').trim();
        if (chunk) currentText += chunk + '\n';
        console.log('API Response Chunk:', chunk);
        onMessageUpdate((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1].text = currentText;
          return updatedMessages;
        });
      }
      
    } catch (error) {
      setField('error', 'Failed to send message. Please try again later.');
      onMessageUpdate((prevMessages) => [
        ...prevMessages.filter((msg) => !msg.isThinking),
        { text: 'Error fetching response, please try again later.', sender: 'assistant', isError: true }
      ]);
    } finally {
      setIsLoading(false);
      setField('message', '');
      setField('uploadedFileName', '');
    }
  }, [message, uploadedFileName, onMessageUpdate, setIsLoading, setField, handleSignOut, navigate]);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) setField('uploadedFileName', file.name);
  }, [setField]);

  useEffect(() => {
    if (promptMessage) setField('message', promptMessage);
  }, [promptMessage, setField]);

  return (
    <>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'fixed',
          bottom: 0,
          left: 275,
          right: 0,
          backgroundColor: '#FFFFFF',  // Changed background color
          p: 2,
          borderTop: '1px solid #E0E0E0',
          boxShadow: '0px -2px 15px rgba(0, 0, 0, 0.1)', // Enhanced shadow for depth
          zIndex: 1000,
        }}
      >
        <IconButton
          component="label"
          sx={{
            mr: 1,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)', // Hover effect
            },
          }}
        >
          <UploadFileRoundedIcon color="primary" sx={{ fontSize: '28px' }} />
          <input type="file" hidden onChange={handleFileUpload} />
        </IconButton>

        {uploadedFileName && (
          <Box sx={{
            backgroundColor: '#F0F0F0',
            borderRadius: '12px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            mr: 1,
          }}>
            <Typography variant="body2" sx={{ color: '#333' }}>
              {uploadedFileName}
            </Typography>
          </Box>
        )}

        <TextField
          fullWidth
          placeholder="Type your message..."
          variant="outlined"
          value={message}
          onChange={(e) => setField('message', e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendClick()}
          disabled={isLoading}
          sx={{
            border: 'solid 1px lightgray',
            borderRadius: '20px',
            backgroundColor: '#F9F9F9',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
            },
          }}
        />

        <Button
          vvariant="contained"
          color="primary"
          onClick={handleSendClick}
          disabled={isLoading}
          sx={{
            marginLeft: 1,
            borderRadius: '20px',
            backgroundColor: '#1976d2',
            color: '#FFF',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
            },
            transition: 'background-color 0.3s',
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
        </Button>
      </Box>

      <Snackbar open={openToast} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity="error" sx={{ width: '100%' }}>
          Session expired! You will be redirected to the login page.
        </Alert>
      </Snackbar>
    </>
  );
};

export default Input;
