import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  LinearProgress,
} from '@mui/material';
import { BarChart, Assessment, TrendingUp, PieChart } from '@mui/icons-material';

const ReportsPage: React.FC = () => {
  const reportStats = [
    {
      title: 'Total Meals Served This Month',
      value: '8,750',
      change: '+12% from last month',
      color: 'primary',
      icon: <BarChart />
    },
    {
      title: 'Average Daily Attendance',
      value: '92%',
      change: '+3% improvement',
      color: 'success',
      icon: <TrendingUp />
    },
    {
      title: 'Schools Reporting',
      value: '24/25',
      change: '96% compliance rate',
      color: 'info',
      icon: <Assessment />
    },
    {
      title: 'Budget Utilization',
      value: '87%',
      change: 'Within allocated budget',
      color: 'warning',
      icon: <PieChart />
    }
  ];

  const schoolPerformance = [
    { name: 'Government Primary School Pimpri', attendance: 96, meals: 340 },
    { name: 'Municipal School Avaghad', attendance: 89, meals: 275 },
    { name: 'Zilla Parishad School Dehu', attendance: 94, meals: 420 },
    { name: 'Government High School Chinchwad', attendance: 91, meals: 650 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        अहवाल और विश्लेषण (Reports & Analytics)
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Comprehensive reporting and analytics for mid-day meal programs. मध्याह्न भोजन कार्यक्रमों के लिए व्यापक रिपोर्टिंग और विश्लेषण।
        </Typography>
      </Alert>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {reportStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box sx={{ color: `${stat.color}.main` }}>
                    {stat.icon}
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h4" color={stat.color}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                School Performance Overview
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Attendance rates and meal service statistics by school
              </Typography>
              
              {schoolPerformance.map((school, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1" fontWeight="medium">
                      {school.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {school.attendance}% • {school.meals} meals
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={school.attendance} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Statistics
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Total Students Enrolled
                </Typography>
                <Typography variant="h5" color="primary">
                  1,845
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Average Daily Meals
                </Typography>
                <Typography variant="h5" color="secondary">
                  1,685
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Food Wastage Rate
                </Typography>
                <Typography variant="h5" color="error">
                  3.2%
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Nutritional Score
                </Typography>
                <Typography variant="h5" color="success.main">
                  A-
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              {[
                'Monthly report generated',
                'New school added to system',
                'Menu updated for Zone 3',
                'Quality audit completed',
              ].map((activity, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  • {activity}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;