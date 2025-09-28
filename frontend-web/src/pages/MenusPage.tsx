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
import { Restaurant, CalendarToday } from '@mui/icons-material';

const MenusPage: React.FC = () => {
  const sampleMenus = [
    {
      id: 1,
      date: '2024-09-28',
      day: 'Saturday',
      mealType: 'Lunch',
      description: 'Rice, Tur Dal, Mixed Vegetables, Chapati',
      descriptionMarathi: 'तांदूळ, तूर डाळ, मिक्स भाजी, चपाती',
      items: [
        { name: 'Rice', quantity: '150g' },
        { name: 'Tur Dal', quantity: '30g' },
        { name: 'Mixed Vegetables', quantity: '50g' },
        { name: 'Chapati', quantity: '2 pieces' }
      ]
    },
    {
      id: 2,
      date: '2024-09-27',
      day: 'Friday',
      mealType: 'Lunch',
      description: 'Rice, Moong Dal, Potato Curry, Chapati',
      descriptionMarathi: 'तांदूळ, मूग डाळ, बटाटा भाजी, चपाती',
      items: [
        { name: 'Rice', quantity: '150g' },
        { name: 'Moong Dal', quantity: '30g' },
        { name: 'Potato Curry', quantity: '80g' },
        { name: 'Chapati', quantity: '2 pieces' }
      ]
    },
    {
      id: 3,
      date: '2024-09-26',
      day: 'Thursday',
      mealType: 'Lunch',
      description: 'Rice, Tur Dal, Cabbage Sabzi, Chapati',
      descriptionMarathi: 'तांदूळ, तूर डाळ, कोबी भाजी, चपाती',
      items: [
        { name: 'Rice', quantity: '150g' },
        { name: 'Tur Dal', quantity: '30g' },
        { name: 'Cabbage Sabzi', quantity: '60g' },
        { name: 'Chapati', quantity: '2 pieces' }
      ]
    }
  ];

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast': return 'warning';
      case 'lunch': return 'primary';
      case 'snack': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        मेनू नियोजन (Menu Planning)
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Weekly and monthly meal menu planning for schools. साप्ताहिक और मासिक भोजन मेनू योजना।
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {sampleMenus.map((menu) => (
          <Grid item xs={12} md={6} lg={4} key={menu.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CalendarToday color="primary" />
                    <Box>
                      <Typography variant="h6">
                        {menu.day}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {menu.date}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={menu.mealType} 
                    color={getMealTypeColor(menu.mealType) as any}
                    size="small"
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Restaurant color="secondary" />
                  <Typography variant="body1">
                    Today's Menu
                  </Typography>
                </Box>

                <Typography variant="body1" gutterBottom>
                  <strong>English:</strong> {menu.description}
                </Typography>
                
                <Typography variant="body1" gutterBottom sx={{ fontStyle: 'italic' }}>
                  <strong>मराठी:</strong> {menu.descriptionMarathi}
                </Typography>

                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Items & Quantities:
                </Typography>
                
                <Grid container spacing={1}>
                  {menu.items.map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Box sx={{ 
                        p: 1, 
                        backgroundColor: 'grey.50', 
                        borderRadius: 1,
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {item.quantity}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MenusPage;