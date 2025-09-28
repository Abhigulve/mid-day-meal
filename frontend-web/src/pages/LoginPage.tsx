import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Login as LoginIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('कृपया वापरकर्ता नाव आणि पासवर्ड प्रविष्ट करा (Please enter username and password)');
      return;
    }

    const success = await login(username, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('चुकीचे वापरकर्ता नाव किंवा पासवर्ड (Invalid username or password)');
    }
  };

  const handleDemoLogin = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setError('');
  };

  const demoAccounts = [
    {
      username: 'admin',
      password: 'admin123',
      role: 'System Administrator',
      description: 'Full system access - Add schools, manage teachers',
      icon: <AdminIcon color="error" />
    },
    {
      username: 'sunita.patel',
      password: 'teacher123',
      role: 'School Admin',
      description: 'पिंप्री अवघड शाळा - Manage daily meals, view reports',
      icon: <SchoolIcon color="primary" />
    },
    {
      username: 'rajesh.sharma',
      password: 'teacher123',
      role: 'School Admin',
      description: 'नेहरू माध्यमिक शाळा - Manage daily meals, view reports',
      icon: <SchoolIcon color="secondary" />
    }
  ];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 64, height: 64 }}>
                <LoginIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" gutterBottom>
                🍽️ Mid-Day Meal System
              </Typography>
              <Typography variant="h6" color="textSecondary">
                मध्याह्न भोजन व्यवस्थापन प्रणाली
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Please login to access the system
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="वापरकर्ता नाव (Username)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                variant="outlined"
                disabled={loading}
                autoComplete="username"
              />
              
              <TextField
                fullWidth
                type="password"
                label="पासवर्ड (Password)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                disabled={loading}
                autoComplete="current-password"
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
              >
                {loading ? 'लॉगिन करत आहे...' : 'लॉगिन (Login)'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Demo Accounts */}
            <Box textAlign="center">
              <Button
                variant="outlined"
                onClick={() => setShowDemo(!showDemo)}
                size="small"
              >
                {showDemo ? 'डेमो बंद करा' : 'डेमो अकाउंट्स पहा (View Demo Accounts)'}
              </Button>

              {showDemo && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    डेमो अकाउंट्स (Demo Accounts):
                  </Typography>
                  <List dense>
                    {demoAccounts.map((account, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleDemoLogin(account.username, account.password)}
                        sx={{ 
                          border: '1px solid #ddd', 
                          borderRadius: 1, 
                          mb: 1,
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <ListItemIcon>
                          {account.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" fontWeight="bold">
                                {account.username}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {account.role}
                              </Typography>
                            </Box>
                          }
                          secondary={account.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
                    <Typography variant="body2">
                      <strong>Demo Instructions:</strong><br/>
                      • Click any account above to auto-fill login<br/>
                      • <strong>Admin:</strong> Can add schools, create teachers, view all data<br/>
                      • <strong>School Admin:</strong> Can record meals, view reports for their school<br/>
                      • All demo passwords: <code>admin123</code> or <code>teacher123</code>
                    </Typography>
                  </Alert>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="white">
            © 2025 Mid-Day Meal Management System • Government of Maharashtra
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;