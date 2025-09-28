import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  School,
  Restaurant,
  Assignment,
  Assessment,
  ExitToApp,
  AccountCircle,
  Logout,
  Settings,
  AdminPanelSettings
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

const getMenuItemsForRole = (role: string, isAdmin: boolean, isSchoolAdmin: boolean) => {
  // Admin: System setup and monitoring only
  const adminItems = [
    { text: 'सिस्टम डॅशबोर्ड (System Dashboard)', icon: <Dashboard />, path: '/dashboard', roles: ['ADMIN'] },
    { text: 'शाळा व्यवस्थापन (Schools Management)', icon: <School />, path: '/schools', roles: ['ADMIN'] },
    { text: 'शिक्षक व्यवस्थापन (Teacher Management)', icon: <AccountCircle />, path: '/teachers', roles: ['ADMIN'] },
    { text: 'सिस्टम अहवाल (System Reports)', icon: <Assessment />, path: '/reports', roles: ['ADMIN'] },
  ];

  // School-level users: Daily operations
  const schoolOperationalItems = [
    { text: 'डॅशबोर्ड (Dashboard)', icon: <Dashboard />, path: '/dashboard', roles: ['SCHOOL_ADMIN', 'TEACHER'] },
    { text: 'कॅलेंडर (Calendar)', icon: <Assignment />, path: '/calendar', roles: ['SCHOOL_ADMIN', 'TEACHER'] },
    { text: 'जेवण नोंदी (Meal Records)', icon: <Assignment />, path: '/meal-records', roles: ['SCHOOL_ADMIN', 'TEACHER'] },
    { text: 'अहवाल (Reports)', icon: <Assessment />, path: '/reports', roles: ['SCHOOL_ADMIN', 'TEACHER'] },
  ];

  // School Admin: Configuration + Operations
  const schoolConfigItems = [
    { text: 'सुट्टी व कॉन्फिगरेशन (Holiday & Config)', icon: <ExitToApp />, path: '/holidays', roles: ['SCHOOL_ADMIN'] },
    { text: 'खाद्यसामग्री (Food Items)', icon: <Restaurant />, path: '/food-items', roles: ['SCHOOL_ADMIN'] },
    { text: 'मेन्यू (Menus)', icon: <Restaurant />, path: '/menus', roles: ['SCHOOL_ADMIN'] },
  ];

  let allItems = [];
  
  if (isAdmin) {
    // Admin sees only system administration features
    allItems = [...adminItems];
  } else if (isSchoolAdmin) {
    // School Admin sees configuration + daily operations
    allItems = [...schoolOperationalItems, ...schoolConfigItems];
  } else {
    // Teachers see only daily operations
    allItems = [...schoolOperationalItems];
  }

  return allItems.filter(item => item.roles.includes(role));
};

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isAdmin, isSchoolAdmin, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      Loading...
    </Box>;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const menuItems = getMenuItemsForRole(user.role, isAdmin, isSchoolAdmin);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'SCHOOL_ADMIN': return 'primary';
      case 'TEACHER': return 'secondary';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'प्रशासक';
      case 'SCHOOL_ADMIN': return 'शाळा प्रशासक';
      case 'TEACHER': return 'शिक्षक';
      default: return role;
    }
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" color="primary">
          🍽️ Mid-Day Meal
        </Typography>
      </Toolbar>
      
      {/* User Info Section */}
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: getRoleColor(user.role) }}>
            {user.role === 'ADMIN' ? <AdminPanelSettings /> : <AccountCircle />}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {user.full_name}
            </Typography>
            <Chip 
              label={getRoleLabel(user.role)} 
              size="small" 
              color={getRoleColor(user.role) as any}
            />
          </Box>
        </Box>
        {user.school_name && (
          <Typography variant="caption" color="textSecondary">
            📍 {user.school_name}
          </Typography>
        )}
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Mid-Day Meal Management System
          </Typography>
          
          {/* User Menu */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box display={{ xs: 'none', sm: 'block' }}>
              <Typography variant="body2" color="inherit">
                {user.full_name}
              </Typography>
              <Typography variant="caption" color="inherit" display="block">
                {getRoleLabel(user.role)}
              </Typography>
            </Box>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.dark' }}>
                {user.role === 'ADMIN' ? <AdminPanelSettings /> : <AccountCircle />}
              </Avatar>
            </IconButton>
          </Box>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <Box sx={{ p: 2, minWidth: 200 }}>
              <Typography variant="subtitle2">{user.full_name}</Typography>
              <Typography variant="caption" color="textSecondary">{user.email}</Typography>
              <br />
              <Chip label={getRoleLabel(user.role)} size="small" color={getRoleColor(user.role) as any} sx={{ mt: 1 }} />
              {user.school_name && (
                <Typography variant="caption" display="block" color="textSecondary" mt={1}>
                  📍 {user.school_name}
                </Typography>
              )}
            </Box>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              लॉगआउट (Logout)
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;