import React, { useState, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import Sidebar from './Component/Sidebar';
import MainContent from './Component/MainContent';
import Input from './Component/Input';
import Navbar from './Component/Navbar';
import Login from './Component/Login';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authService } from './services/authService';


const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAuth = authService.isAuthenticated();

  React.useEffect(() => {
    if (!isAuth) {
      navigate('/login', { replace: true });
    }
  }, [isAuth, navigate]);

  return isAuth ? children : null;
};

const AppContent = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState({ default: [] });
  const [activeSessionId, setActiveSessionId] = useState('default');
  const [showInitialContent, setShowInitialContent] = useState(true);
  const [promptMessage, setPromptMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  const handleSignOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleMessageUpdate = useCallback(
    (updater) => {
      setMessages(prev => ({
        ...prev,
        [activeSessionId]: updater(prev[activeSessionId] || []),
      }));
      setShowInitialContent(false);
    },
    [activeSessionId]
  );

  const handleSetActiveSession = useCallback((sessionId) => {
    setActiveSessionId(sessionId);
    setShowInitialContent(true);
  }, []);

  const handleAddSession = useCallback((newSessionId) => {
    setMessages(prev => ({
      ...prev,
      [newSessionId]: [],
    }));
    setActiveSessionId(newSessionId);
    setShowInitialContent(true);
  }, []);

  const currentMessages = useMemo(() =>
    messages[activeSessionId] || [],
    [messages, activeSessionId]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Routes>
        <Route
          path="/login"
          element={
            authService.isAuthenticated() ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginClick={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                backgroundColor: '#edf4fa'
              }}>
                <Navbar
                  isAuthenticated={true}
                  onSignOut={handleSignOut}
                />
                <Box sx={{ display: 'flex', flexGrow: 1 }}>
                  <Sidebar
                    onAddSession={handleAddSession}
                    onSetActiveSession={handleSetActiveSession}
                  />
                  <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}
                  >
                    <MainContent
                      messages={currentMessages}
                      onCardClick={setPromptMessage}
                      showInitialContent={showInitialContent}
                      isActive={true}
                      onMessageUpdate={handleMessageUpdate}
                    />
                    <Input
                      onMessageUpdate={handleMessageUpdate}
                      promptMessage={promptMessage}
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      onSignOut={handleSignOut}
                    />
                  </Box>
                </Box>
              </Box>
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Box>
  );
};

export default App;
