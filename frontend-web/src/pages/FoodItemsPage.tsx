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
import { Restaurant, Category, Scale } from '@mui/icons-material';

const FoodItemsPage: React.FC = () => {
  const sampleFoodItems = [
    {
      id: 1,
      name: 'Rice',
      nameMarathi: 'तांदूळ',
      category: 'GRAINS',
      unit: 'KG',
      costPerUnit: 45.00,
      nutritionalInfo: 'Carbohydrates: 80g per 100g'
    },
    {
      id: 2,
      name: 'Tur Dal',
      nameMarathi: 'तूर डाळ',
      category: 'PROTEINS',
      unit: 'KG',
      costPerUnit: 120.00,
      nutritionalInfo: 'Protein: 22g per 100g'
    },
    {
      id: 3,
      name: 'Potatoes',
      nameMarathi: 'बटाटे',
      category: 'VEGETABLES',
      unit: 'KG',
      costPerUnit: 25.00,
      nutritionalInfo: 'Vitamin C, Potassium'
    },
    {
      id: 4,
      name: 'Cooking Oil',
      nameMarathi: 'स्वयंपाकाचं तेल',
      category: 'OIL',
      unit: 'LITRE',
      costPerUnit: 180.00,
      nutritionalInfo: 'Essential fatty acids'
    },
    {
      id: 5,
      name: 'Onions',
      nameMarathi: 'कांदे',
      category: 'VEGETABLES',
      unit: 'KG',
      costPerUnit: 30.00,
      nutritionalInfo: 'Vitamin C, Antioxidants'
    },
    {
      id: 6,
      name: 'Turmeric Powder',
      nameMarathi: 'हळद पावडर',
      category: 'SPICES',
      unit: 'KG',
      costPerUnit: 250.00,
      nutritionalInfo: 'Anti-inflammatory properties'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GRAINS': return 'primary';
      case 'VEGETABLES': return 'success';
      case 'PROTEINS': return 'secondary';
      case 'SPICES': return 'warning';
      case 'OIL': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        खाद्य सामग्री व्यवस्थापन (Food Items Management)
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Manage food items, their categories, costs, and nutritional information. खाद्य सामग्री, उनकी श्रेणियों, लागत और पोषण संबंधी जानकारी का प्रबंधन करें।
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {sampleFoodItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Restaurant color="primary" />
                    <Box>
                      <Typography variant="h6">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                        {item.nameMarathi}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={item.category} 
                    color={getCategoryColor(item.category) as any}
                    size="small"
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Scale color="secondary" fontSize="small" />
                  <Typography variant="body1">
                    <strong>Unit:</strong> {item.unit}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Category color="action" fontSize="small" />
                  <Typography variant="body1">
                    <strong>Cost:</strong> ₹{item.costPerUnit.toFixed(2)} per {item.unit}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary">
                  <strong>Nutrition:</strong> {item.nutritionalInfo}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Category Summary
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center" p={2}>
                <Typography variant="h4" color="primary">
                  2
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Grains
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center" p={2}>
                <Typography variant="h4" color="success.main">
                  2
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Vegetables
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center" p={2}>
                <Typography variant="h4" color="secondary.main">
                  1
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Proteins
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center" p={2}>
                <Typography variant="h4" color="warning.main">
                  1
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Spices & Oil
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FoodItemsPage;