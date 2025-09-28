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
import { CalendarToday, Event, Schedule } from '@mui/icons-material';

const CalendarPage: React.FC = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const sampleEvents = [
    {
      id: 1,
      date: '2024-09-28',
      title: 'Monthly Menu Review',
      type: 'meeting',
      description: 'Review and approve October menu plans'
    },
    {
      id: 2,
      date: '2024-09-30',
      title: 'Quality Audit - Zone 3',
      type: 'inspection',
      description: 'Food quality inspection for schools in Zone 3'
    },
    {
      id: 3,
      date: '2024-10-02',
      title: 'Gandhi Jayanti Holiday',
      type: 'holiday',
      description: 'National holiday - No meal service'
    },
    {
      id: 4,
      date: '2024-10-05',
      title: 'Supplier Meeting',
      type: 'meeting',
      description: 'Monthly supplier review and procurement planning'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'primary';
      case 'inspection': return 'warning';
      case 'holiday': return 'error';
      case 'training': return 'success';
      default: return 'default';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Event />;
      case 'inspection': return <Schedule />;
      case 'holiday': return <CalendarToday />;
      default: return <Event />;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        कैलेंडर व्यवस्थापन (Calendar Management)
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Schedule and manage meal program events, holidays, and important dates. भोजन कार्यक्रम की घटनाओं, छुट्टियों और महत्वपूर्ण तारीखों का प्रबंधन करें।
        </Typography>
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {currentMonth}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Current month overview and upcoming events
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Events
              </Typography>
              
              {sampleEvents.map((event) => (
                <Box key={event.id} sx={{ mb: 3, p: 2, border: 1, borderColor: 'grey.200', borderRadius: 2 }}>
                  <Box display="flex" justifyContent="between" alignItems="flex-start" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getEventIcon(event.type)}
                      <Typography variant="h6">
                        {event.title}
                      </Typography>
                    </Box>
                    <Chip 
                      label={event.type} 
                      color={getEventTypeColor(event.type) as any}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Date: {event.date}
                  </Typography>
                  
                  <Typography variant="body1">
                    {event.description}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Events This Month
                </Typography>
                <Typography variant="h4" color="primary">
                  12
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Holidays Remaining
                </Typography>
                <Typography variant="h4" color="secondary">
                  3
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Inspections Scheduled
                </Typography>
                <Typography variant="h4" color="warning.main">
                  5
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Event Types
              </Typography>
              
              <Box display="flex" flexDirection="column" gap={1}>
                <Chip label="Meetings" color="primary" size="small" />
                <Chip label="Inspections" color="warning" size="small" />
                <Chip label="Holidays" color="error" size="small" />
                <Chip label="Training" color="success" size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CalendarPage;