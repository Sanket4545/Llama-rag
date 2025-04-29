import React, { useState, useCallback, useMemo } from 'react';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Avatar,
  IconButton, Button, Divider, Typography, useTheme, alpha
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import AssistantIcon from '@mui/icons-material/Assistant';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import llama from '../Assets/llama.jpeg';

const drawerWidth = 280;

const Sidebar = ({ onAddSession, onSetActiveSession }) => {
  const theme = useTheme();
  const [sessions, setSessions] = useState([{ id: 'default', name: 'Default Assistant', active: true }]);

  const activeSessionId = useMemo(
    () => sessions.find(session => session.active)?.id || 'default',
    [sessions]
  );

  const handleAddSession = useCallback(() => {
    const newSession = { id: uuidv4(), name: `New Session ${sessions.length + 1}`, active: true };
    setSessions(prevSessions =>
      prevSessions.map(session => ({ ...session, active: false })).concat(newSession)
    );
    onSetActiveSession(newSession.id);
    onAddSession(newSession.id);
  }, [onAddSession, onSetActiveSession, sessions.length]);

  const handleDeleteSession = useCallback((id) => {
    setSessions(prevSessions => {
      const updatedSessions = prevSessions.filter(session => session.id !== id);
      if (id === activeSessionId && updatedSessions.length > 0) {
        onSetActiveSession(updatedSessions[0].id);
      }
      return updatedSessions;
    });
  }, [activeSessionId, onSetActiveSession]);

  const handleSetActiveSession = useCallback((id) => {
    setSessions(prevSessions => prevSessions.map(session => ({
      ...session, active: session.id === id
    })));
    onSetActiveSession(id);
  }, [onSetActiveSession]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.default,
          boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: '24px',
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        }}
      >
        <Avatar
          alt="Model Icon"
          src={llama}
          sx={{ 
            width: 56, 
            height: 56,
            border: `3px solid ${theme.palette.common.white}`,
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          }}
        />
        <Typography variant="h5" sx={{ paddingLeft: 2, color: theme.palette.common.white, fontWeight: 'bold' }}>
          Llamaste
        </Typography>
      </Box>
      <Divider />
      <List sx={{ padding: '16px' }}>
        <AnimatePresence>
          {sessions.map(session => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ListItem
                button
                selected={session.id === activeSessionId}
                onClick={() => handleSetActiveSession(session.id)}
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  backgroundColor: session.id === activeSessionId 
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                  '&:hover': {
                    backgroundColor: session.id === activeSessionId 
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha(theme.palette.primary.main, 0.05),
                  },
                  transition: 'background-color 0.3s, transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <ListItemIcon>
                  {session.id === activeSessionId ? (
                    <AssistantIcon color="primary" />
                  ) : (
                    <ChatIcon color="action" />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={session.name} 
                  primaryTypographyProps={{
                    fontWeight: session.id === activeSessionId ? 'bold' : 'normal',
                  }}
                />
                {session.id !== 'default' && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                    sx={{
                      color: theme.palette.error.main,
                      opacity: 0.7,
                      '&:hover': {
                        opacity: 1,
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
      <Box sx={{ 
        padding: '16px', 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0,
        backgroundColor: theme.palette.background.paper,
      }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddSession}
          fullWidth
          sx={{
            borderRadius: '24px',
            padding: '12px',
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 8px rgba(0,0,0,0.15)',
            },
          }}
        >
          Add New Session
        </Button>
      </Box>
    </Drawer>
  );
};

export default React.memo(Sidebar);