import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Button, useTheme, useMediaQuery } from '@mui/material';
import YogaIcon from '@mui/icons-material/HealthAndSafety';
import MeditationIcon from '@mui/icons-material/SelfImprovement';
import HealthIcon from '@mui/icons-material/EmojiNature';
import ContentCopySharpIcon from '@mui/icons-material/ContentCopySharp';
import ReactMarkdown from 'react-markdown';

const getGreeting = () => {
  try {
    const date = new Date();
    const hour = date.getUTCHours() + 5.5;
    if (hour < 12) return "🌅 Good Morning";
    if (hour < 17) return "☀️ Good Afternoon";
    return "🌙 Good Evening";
  } catch (error) {
    console.error('Error calculating greeting:', error);
    return "🌟 Welcome";
  }
};

const InfoCard = React.memo(({ icon: Icon, title, description, onClick }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        onClick={onClick}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
          borderRadius: 4,
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <CardContent>
          <Icon sx={{ fontSize: 40, color: '#4A90E2' }} />
          <Typography variant="h6" sx={{ mt: 2, color: '#333' }}>{title}</Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>{description}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
});

const MainContent = React.memo(({ messages, onCardClick, isActive, isGenerating }) => {
  const [greeting, setGreeting] = useState(getGreeting);
  const [copySuccess, setCopySuccess] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      },
      () => {
        setCopySuccess('Failed to copy!');
        setTimeout(() => setCopySuccess(''), 2000);
      }
    );
  };

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const handleCardClick = useCallback(
    (message) => {
      if (onCardClick) onCardClick(message);
    },
    [onCardClick]
  );

  const cardData = useMemo(
    () => [
      {
        icon: YogaIcon,
        title: 'Yoga Poses Guide',
        description: 'Explore various Yoga poses for flexibility, strength, and relaxation.',
        message: 'Explore various Yoga poses for flexibility, strength, and relaxation.',
      },
      {
        icon: MeditationIcon,
        title: 'Meditation Techniques',
        description: 'Discover meditation practices to reduce stress. ',
        message: 'Discover meditation practices to reduce stress and improve mindfulness.',
      },
      {
        icon: HealthIcon,
        title: 'Health and Wellness Tips',
        description: 'Tips on maintaining a balanced lifestyle through diet and exercise.',
        message: 'Tips on maintaining a balanced lifestyle through diet and exercise.',
      },
    ],
    []
  );

  return (
    <Box
      sx={{
        // marginTop: 4,
        paddingBottom: 8,
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {messages.length > 0 ? (
        messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 2,
              padding: 0,
              opacity: 0,
              animation: 'fadeIn 0.5s ease forwards',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Box
              sx={{
                position: 'relative',
                maxWidth: isMobile ? '90%' : '70%',
                backgroundColor: msg.sender === 'user' ? '#d7e7fa' : '#FFFFFF',
                color: msg.sender === 'user' ? '#FFFFFF' : '#333333',
                padding: 2,
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              {msg.sender !== 'user' && !msg.isThinking && (
                <Button
                  onClick={() => copyToClipboard(msg.text)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    minWidth: 'auto',
                    padding: '4px',
                    color: '#4A90E2',
                    '&:hover': { backgroundColor: 'rgba(74, 144, 226, 0.1)' },
                  }}
                >
                  <ContentCopySharpIcon />
                </Button>
              )}

              {msg.isThinking ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography>Thinking...</Typography>
                </Box>
              ) : msg.isMarkdown ? (
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <Typography variant="h4" gutterBottom {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <Typography variant="h5" gutterBottom {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <Typography variant="h6" gutterBottom {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <Typography variant="body1" paragraph {...props} />
                    ),
                    ul: ({ node, ...props }) => <ul style={{ marginBottom: '1em' }} {...props} />,
                    ol: ({ node, ...props }) => <ol style={{ marginBottom: '1em' }} {...props} />,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              ) : (
                <Typography>{msg.text}</Typography>
              )}
            </Box>
          </Box>
        ))
      ) : (
        <Box sx={{ textAlign: 'center', p: 6 }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 48 }, fontWeight: 700, color: '#4A90E2', mb: 2 }}>
            {greeting}, Welcome to Llamaste Chat!
          </Typography>
          <Typography variant="h5" sx={{ color: '#666', mb: 4 }}>
            I am your personal intelligent assistant, Llama. How can I assist you today?
          </Typography>
          <Typography variant="h6" sx={{ color: '#4A90E2', mb: 3 }}>
            Yoga and Wellness Recommendations
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {cardData.map((card, index) => (
              <InfoCard
                key={index}
                icon={card.icon}
                title={card.title}
                description={card.description}
                onClick={() => handleCardClick(card.message)}
              />
            ))}
          </Grid>

          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" sx={{ color: '#4A90E2', mb: 3 }}>
              Frequently Asked Questions (FAQ):
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {[
                "What are the benefits of Yoga?",
                "How often should I meditate?",
                "Can Yoga help with stress?",
              ].map((faq, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    onClick={() => handleCardClick(faq)}
                    sx={{
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
                      borderRadius: 4,
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1" sx={{ color: '#333' }}>{faq}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
      {copySuccess && (
        <Typography
          sx={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '8px 16px',
            borderRadius: 4,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 1000,
            animation: 'fadeIn 0.5s ease forwards',
          }}
        >
          {copySuccess}
        </Typography>
      )}

    </Box>
  );
});

export default MainContent;