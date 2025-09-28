import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CalendarPage from './pages/CalendarPage';
import HolidayManagementPage from './pages/HolidayManagementPage';
import SchoolsPage from './pages/SchoolsPage';
import FoodItemsPage from './pages/FoodItemsPage';
import MenusPage from './pages/MenusPage';
import MealRecordsPage from './pages/MealRecordsPage';
import ReportsPage from './pages/ReportsPage';
import TeacherManagementPage from './pages/TeacherManagementPage';
import SchoolManagementPage from './pages/SchoolManagementPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="holidays" element={<HolidayManagementPage />} />
              <Route path="schools" element={<SchoolsPage />} />
              <Route path="food-items" element={<FoodItemsPage />} />
              <Route path="menus" element={<MenusPage />} />
              <Route path="meal-records" element={<MealRecordsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="teachers" element={<TeacherManagementPage />} />
              <Route path="schools" element={<SchoolManagementPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;