import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import { Event, CalendarToday, School } from '@mui/icons-material';

const HolidayManagementPage: React.FC = () => {
  const sampleHolidays = [
    {
      id: 1,
      name: 'Gandhi Jayanti',
      nameMarathi: 'गांधी जयंती',
      date: '2024-10-02',
      type: 'national',
      description: 'Birth anniversary of Mahatma Gandhi',
      mealService: false
    },
    {
      id: 2,
      name: 'Dussehra',
      nameMarathi: 'दसरा',
      date: '2024-10-12',
      type: 'religious',
      description: 'Victory of good over evil',
      mealService: false
    },
    {
      id: 3,
      name: 'Diwali',
      nameMarathi: 'दिवाळी',
      date: '2024-11-01',
      type: 'religious',
      description: 'Festival of lights',
      mealService: false
    },
    {
      id: 4,
      name: 'Children\'s Day',
      nameMarathi: 'बाल दिन',
      date: '2024-11-14',
      type: 'national',
      description: 'Celebration of children',
      mealService: true
    },
    {
      id: 5,
      name: 'Christmas',
      nameMarathi: 'ख्रिसमस',
      date: '2024-12-25',
      type: 'religious',
      description: 'Birth of Jesus Christ',
      mealService: false
    }
  ];

  const getHolidayTypeColor = (type: string) => {
    switch (type) {
      case 'national': return 'primary';
      case 'religious': return 'secondary';
      case 'local': return 'success';
      case 'school': return 'warning';
      default: return 'default';
    }
  };

  const getMealServiceColor = (mealService: boolean) => {
    return mealService ? 'success' : 'error';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        सुट्टी व्यवस्थापन (Holiday Management)
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Manage holidays and their impact on meal service programs. सुट्टियों और भोजन सेवा कार्यक्रमों पर उनके प्रभाव का प्रबंधन करें।
        </Typography>
      </Alert>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {sampleHolidays.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Holidays
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <School color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="error">
                {sampleHolidays.filter(h => !h.mealService).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                No Meal Service
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Event color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {sampleHolidays.filter(h => h.mealService).length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                With Meal Service
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarToday color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                2
              </Typography>
              <Typography variant="body2" color="textSecondary">
                This Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {sampleHolidays.map((holiday) => (
          <Grid item xs={12} sm={6} md={4} key={holiday.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {holiday.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                      {holiday.nameMarathi}
                    </Typography>
                  </Box>
                  <Chip 
                    label={holiday.type} 
                    color={getHolidayTypeColor(holiday.type) as any}
                    size="small"
                  />
                </Box>

                <Typography variant="body1" gutterBottom>
                  <strong>Date:</strong> {holiday.date}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {holiday.description}
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <Typography variant="body2">
                    <strong>Meal Service:</strong>
                  </Typography>
                  <Chip 
                    label={holiday.mealService ? 'Available' : 'Suspended'} 
                    color={getMealServiceColor(holiday.mealService) as any}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HolidayManagementPage;