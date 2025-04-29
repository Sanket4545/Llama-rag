// src/Component/AuthDialog.js

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';

const AuthDialog = ({ open, mode, credentials, error, onInputChange, onClose, onSubmit }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{mode === 'signIn' ? 'Login' : 'Sign Up'}</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                {mode === 'signUp' && (
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={credentials.name}
                        onChange={onInputChange}
                    />
                )}
                <TextField
                    margin="dense"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={credentials.email}
                    onChange={onInputChange}
                />
                <TextField
                    margin="dense"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={credentials.password}
                    onChange={onInputChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={onSubmit} color="primary">{mode === 'signIn' ? 'Login' : 'Sign Up'}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AuthDialog;
