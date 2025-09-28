import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Box,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface School {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  principalName: string;
  totalStudents: number;
  active: boolean;
}

const SchoolManagementPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    principalName: '',
    totalStudents: 0
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      // Load schools from localStorage (where they're saved when created)
      const savedSchools = localStorage.getItem('schools_data');
      
      if (savedSchools) {
        try {
          const parsedSchools = JSON.parse(savedSchools);
          setSchools(parsedSchools);
          console.log('Schools loaded from localStorage:', parsedSchools);
        } catch (parseError) {
          console.error('Error parsing saved schools:', parseError);
          // Clear corrupted data
          localStorage.removeItem('schools_data');
          setSchools([]);
        }
      } else {
        // Start with completely empty list - no default schools
        setSchools([]);
        console.log('No schools found - starting with clean empty list');
      }
    } catch (error) {
      console.error('Error loading schools:', error);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const openCreateDialog = () => {
    setEditingSchool(null);
    setFormData({
      name: '',
      code: '',
      address: '',
      city: '',
      state: '',
      phone: '',
      email: '',
      principalName: '',
      totalStudents: 0
    });
    setDialogOpen(true);
  };

  const openEditDialog = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      code: school.code,
      address: school.address,
      city: school.city,
      state: school.state,
      phone: school.phone,
      email: school.email,
      principalName: school.principalName,
      totalStudents: school.totalStudents
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSchool(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingSchool) {
        // Update existing school
        const updatedSchool = {
          ...editingSchool,
          ...formData,
          active: true
        };
        
        const updatedSchools = schools.map(s => 
          s.id === editingSchool.id ? updatedSchool : s
        );
        
        setSchools(updatedSchools);
        localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
        showSnackbar('School updated successfully!', 'success');
      } else {
        // Create new school
        const newSchool: School = {
          id: Date.now(),
          ...formData,
          active: true
        };
        
        const updatedSchools = [...schools, newSchool];
        setSchools(updatedSchools);
        localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
        showSnackbar('School created successfully!', 'success');
      }
      
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving school:', error);
      showSnackbar('Failed to save school', 'error');
    }
  };

  const handleDelete = async (schoolId: number) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        const updatedSchools = schools.filter(school => school.id !== schoolId);
        setSchools(updatedSchools);
        localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
        showSnackbar('School deleted successfully!', 'success');
      } catch (error) {
        console.error('Error deleting school:', error);
        showSnackbar('Failed to delete school', 'error');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'School Name', width: 250 },
    { field: 'code', headerName: 'Code', width: 120 },
    { field: 'city', headerName: 'City', width: 150 },
    { field: 'state', headerName: 'State', width: 150 },
    { field: 'principalName', headerName: 'Principal', width: 180 },
    { field: 'totalStudents', headerName: 'Students', width: 100 },
    {
      field: 'active',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => openEditDialog(params.row)}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          शाळा व्यवस्थापन (School Management)
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive school information and management system. संपूर्ण शाळा माहिती और व्यवस्थापन प्रणाली।
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          size="large"
        >
          Add New School
        </Button>
        
        <Typography variant="body2" color="text.secondary">
          Total Schools: {schools.length}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchoolIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">{schools.length}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Schools
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {schools.reduce((sum, school) => sum + school.totalStudents, 0)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Students
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SchoolIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {schools.filter(s => s.active).length}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Active Schools
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {schools.length > 0 ? Math.round(schools.reduce((sum, school) => sum + school.totalStudents, 0) / schools.length) : 0}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Avg Students/School
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={schools}
          columns={columns}
          loading={loading}
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSchool ? 'Edit School' : 'Add New School'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="School Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="School Code"
                fullWidth
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                fullWidth
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="State"
                fullWidth
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Principal Name"
                fullWidth
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Total Students"
                type="number"
                fullWidth
                value={formData.totalStudents}
                onChange={(e) => setFormData({ ...formData, totalStudents: Number(e.target.value) })}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name || !formData.code}
          >
            {editingSchool ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SchoolManagementPage;