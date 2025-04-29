import React, { useState } from 'react';
import { Box, Typography, Button, TextField, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import yogaLoginImg from '../Assets/yoga_login.png';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';

const Auth = ({ onLoginClick }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };
    const handleAuth = async () => {
        try {
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const endpoint = isLogin ? `${apiBaseUrl}/api/auth/login` : `${apiBaseUrl}/api/auth/register`;

            const payload = isLogin
                ? { email: credentials.email, password: credentials.password }
                : { name: credentials.name, email: credentials.email, password: credentials.password };

            console.log('Payload:', payload);

            const response = await axios.post(endpoint, payload);

            const { accessToken, refreshToken, name } = response.data;

            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('username', name);
            console.log('username:', name);


            setError('');
            onLoginClick();

            console.log('Authenticated successfully!', { accessToken, refreshToken });
        } catch (err) {
            setError(isLogin ? 'Invalid email or password. Please try again.' : 'Error signing up. Please check your details.');
            console.error('Authentication error:', err);
        }
    };

    const toggleLoginSignUp = () => {
        setIsLogin((prev) => !prev);
        setCredentials({ name: '', email: '', password: '' });
        setError('');
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box
                sx={{
                    flex: 1,
                    bgcolor: 'light-green',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <Box
                    component="img"
                    src={yogaLoginImg}
                    alt="Meditating figure"
                    sx={{ width: '40%', borderRadius: '10%' }}
                />
                {['circle', 'square', 'diamond'].map((shape, index) => (
                    <Box
                        key={shape}
                        sx={{
                            position: 'absolute',
                            width: 10,
                            height: 10,
                            bgcolor: 'black',
                            borderRadius: shape === 'circle' ? '50%' : 0,
                            transform: shape === 'diamond' ? 'rotate(45deg)' : 'none',
                            top: `${20 + index * 30}%`,
                            left: `${10 + index * 20}%`,
                        }}
                    />
                ))}
            </Box>

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 4,
                    bgcolor: 'white',
                }}
            >
                {error && (
                    <Alert
                        severity="error"
                        sx={{
                            mt: 2,
                            mx: 'auto',
                            width: '50%',
                            padding: '5px 12px',
                            fontSize: '0.875rem',
                            textAlign: 'center',
                        }}
                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => setError('')}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        {error}
                    </Alert>
                )}
                <Typography variant="h3" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
                    Hey! Welcome to Yoga Chat
                </Typography>
                <Typography variant="h5" sx={{ mb: 4 }}>
                    {isLogin ? 'Login please' : 'Sign Up'}
                </Typography>
                {!isLogin && (
                    <TextField
                        label="Name"
                        variant="outlined"
                        name="name"
                        value={credentials.name}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        fullWidth
                    />
                )}
                <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={credentials.email}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    fullWidth
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={handleInputChange}
                    sx={{ mb: 3 }}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleAuth}
                    sx={{
                        mb: 2,
                        bgcolor: 'black',
                        color: 'white',
                        '&:hover': { bgcolor: '#333' },
                        textTransform: 'none',
                        borderRadius: 50,
                    }}
                >
                    {isLogin ? 'Login' : 'Sign Up'}
                </Button>
                <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <Typography
                        component="span"
                        onClick={toggleLoginSignUp}
                        sx={{
                            color: 'inherit',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: 'inherit',
                        }}
                    >
                        {isLogin ? ' Sign Up' : ' Login'}
                    </Typography>
                </Typography>

                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    <a href="#" style={{ color: 'inherit' }}>Forgot Password?</a>
                </Typography>
            </Box>
        </Box>
    );
};

export default Auth;
