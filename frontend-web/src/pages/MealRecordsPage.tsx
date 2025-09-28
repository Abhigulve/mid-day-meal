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
import { Assignment, Restaurant, People } from '@mui/icons-material';

const MealRecordsPage: React.FC = () => {
  const sampleRecords = [
    {
      id: 1,
      date: '2024-09-28',
      school: 'Government Primary School Pimpri',
      studentsPresent: 340,
      mealsServed: 340,
      mealType: 'Lunch',
      menu: 'Rice, Dal, Mixed Vegetables, Chapati',
      quality: 'Excellent',
      teacher: 'Mr. Ganesh Bhosale'
    },
    {
      id: 2,
      date: '2024-09-27',
      school: 'Municipal School Avaghad',
      studentsPresent: 275,
      mealsServed: 275,
      mealType: 'Lunch',
      menu: 'Rice, Moong Dal, Potato Curry, Chapati',
      quality: 'Good',
      teacher: 'Mrs. Lata Jadhav'
    }
  ];

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'excellent': return 'success';
      case 'good': return 'primary';
      case 'average': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        भोजन रेकॉर्ड (Meal Records)
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Daily meal serving records and attendance tracking. रोज के भोजन सेवा रिकॉर्ड और उपस्थिति ट्रैकिंग।
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {sampleRecords.map((record) => (
          <Grid item xs={12} key={record.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {record.school}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {record.date} • {record.mealType}
                    </Typography>
                  </Box>
                  <Chip 
                    label={record.quality} 
                    color={getQualityColor(record.quality) as any}
                    size="small"
                  />
                </Box>

                <Typography variant="body1" gutterBottom>
                  <strong>Menu:</strong> {record.menu}
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={4}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <People color="primary" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Students Present
                        </Typography>
                        <Typography variant="h6">
                          {record.studentsPresent}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Restaurant color="secondary" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Meals Served
                        </Typography>
                        <Typography variant="h6">
                          {record.mealsServed}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Assignment color="action" />
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Teacher in Charge
                        </Typography>
                        <Typography variant="body1">
                          {record.teacher}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MealRecordsPage;