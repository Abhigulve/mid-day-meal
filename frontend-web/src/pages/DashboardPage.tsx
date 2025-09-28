import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  School,
  Restaurant,
  Assignment,
  TrendingUp,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user, isAdmin, isSchoolAdmin } = useAuth();

  const getStatsForRole = () => {
    if (isAdmin) {
      return [
        {
          title: 'Total Schools in System',
          value: '24',
          icon: <School />,
          color: '#4CAF50',
          change: '+2 schools added this month',
        },
        {
          title: 'Active Users',
          value: '156',
          icon: <AdminPanelSettings />,
          color: '#2196F3',
          change: '48 school admins, 108 teachers',
        },
        {
          title: 'System Alerts',
          value: '3',
          icon: <Assignment />,
          color: '#FF9800',
          change: '2 schools need attention',
        },
        {
          title: 'Monthly System Health',
          value: '98%',
          icon: <TrendingUp />,
          color: '#9C27B0',
          change: 'All systems operational',
        },
      ];
    } else {
      // School-level dashboard
      return [
        {
          title: user?.school_name ? 'Your School' : 'Total Students',
          value: '155',
          icon: <School />,
          color: '#4CAF50',
          change: '121 (1-5) + 34 (6-8)',
        },
        {
          title: 'Meals Served Today',
          value: '149',
          icon: <Restaurant />,
          color: '#2196F3',
          change: '+3% from yesterday',
        },
        {
          title: 'This Month',
          value: '3,200',
          icon: <Assignment />,
          color: '#FF9800',
          change: '22 meal days completed',
        },
        {
          title: 'Budget Status',
          value: '87%',
          icon: <TrendingUp />,
          color: '#9C27B0',
          change: 'Within allocation',
        },
      ];
    }
  };

  const stats = getStatsForRole();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isAdmin ? 'सिस्टम डॅशबोर्ड (System Dashboard)' : 'डॅशबोर्ड (Dashboard)'}
      </Typography>
      
      {user && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>स्वागत {user.full_name}!</strong><br/>
            Role: {isAdmin ? 'सिस्टम प्रशासक (System Administrator)' : isSchoolAdmin ? 'शाळा प्रशासक (School Administrator)' : 'शिक्षक (Teacher)'}
            {user.school_name && <><br/>School: {user.school_name}</>}
          </Typography>
        </Alert>
      )}

      <Typography variant="body1" color="textSecondary" gutterBottom>
        {isAdmin 
          ? 'System-wide overview and administration tools.' 
          : 'Your school\'s mid-day meal program overview.'}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="h2">
                      {stat.value}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {stat.change}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Progress
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Breakfast Distribution</Typography>
                  <Typography variant="body2">78%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={78} sx={{ mb: 2 }} />
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Lunch Preparation</Typography>
                  <Typography variant="body2">45%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={45} sx={{ mb: 2 }} />
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Attendance Recording</Typography>
                  <Typography variant="body2">92%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={92} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <Box sx={{ mt: 2 }}>
                {[
                  'Updated menu for Gandhi Primary School',
                  'Recorded breakfast for 156 students',
                  'New supplier added: Fresh Foods Pvt Ltd',
                  'Weekly report generated for Zone 3',
                ].map((activity, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                    • {activity}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;