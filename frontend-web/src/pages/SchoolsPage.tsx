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
import { School, People, LocationOn, Phone, Email } from '@mui/icons-material';

const SchoolsPage: React.FC = () => {
  const sampleSchools = [
    {
      id: 1,
      name: 'Government Primary School Pimpri',
      code: 'GPS001',
      address: 'Pimpri Colony, Near Bus Stand',
      city: 'Pimpri',
      state: 'Maharashtra',
      pincode: '411018',
      phone: '020-27651234',
      email: 'gps.pimpri@education.gov.in',
      principalName: 'Mrs. Sunita Sharma',
      totalStudents: 350,
      active: true
    },
    {
      id: 2,
      name: 'Municipal School Avaghad',
      code: 'MS002',
      address: 'Avaghad Village, Main Road',
      city: 'Avaghad',
      state: 'Maharashtra',
      pincode: '411025',
      phone: '020-27652345',
      email: 'ms.avaghad@pcmc.gov.in',
      principalName: 'Mr. Rajesh Patil',
      totalStudents: 280,
      active: true
    },
    {
      id: 3,
      name: 'Zilla Parishad School Dehu',
      code: 'ZPS003',
      address: 'Dehu Road, Near Temple',
      city: 'Dehu',
      state: 'Maharashtra',
      pincode: '412101',
      phone: '020-27653456',
      email: 'zps.dehu@zp.gov.in',
      principalName: 'Mrs. Kavita Desai',
      totalStudents: 420,
      active: true
    }
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        शाळा व्यवस्थापन (School Management)
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Comprehensive school information and management system. संपूर्ण शाळा माहिती और व्यवस्थापन प्रणाली।
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {sampleSchools.map((school) => (
          <Grid item xs={12} md={6} lg={4} key={school.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <School color="primary" />
                    <Box>
                      <Typography variant="h6">
                        {school.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Code: {school.code}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={school.active ? 'Active' : 'Inactive'} 
                    color={school.active ? 'success' : 'error'}
                    size="small"
                  />
                </Box>

                <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
                  <LocationOn color="action" fontSize="small" />
                  <Typography variant="body2">
                    {school.address}, {school.city}, {school.state} {school.pincode}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <People color="secondary" />
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Total Students
                    </Typography>
                    <Typography variant="h6">
                      {school.totalStudents}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" gutterBottom>
                  <strong>Principal:</strong> {school.principalName}
                </Typography>

                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">
                    {school.phone}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body2">
                    {school.email}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SchoolsPage;