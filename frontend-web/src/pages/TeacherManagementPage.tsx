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
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ApiService from '../services/ApiService';
import { useAuth } from '../contexts/AuthContext';

interface Teacher {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'TEACHER' | 'SCHOOL_ADMIN' | 'COOK' | 'SUPERVISOR';
  school: {
    id: number;
    name: string;
    code: string;
  } | null;
  active: boolean;
  createdAt: string;
}

interface School {
  id: number;
  name: string;
  code: string;
  city: string;
  state: string;
}

interface CreateTeacherForm {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'TEACHER' | 'SCHOOL_ADMIN' | 'COOK' | 'SUPERVISOR';
  schoolId: number | null;
}

const TeacherManagementPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [schoolDialogOpen, setSchoolDialogOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: '', code: '', city: '', state: '', address: '', phone: '', email: '', principalName: '' });
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<CreateTeacherForm>({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'TEACHER',
    schoolId: null,
  });

  const roleLabels = {
    TEACHER: 'Teacher',
    SCHOOL_ADMIN: 'Principal/School Admin',
    COOK: 'Cook',
    SUPERVISOR: 'Supervisor',
  };

  const roleColors = {
    TEACHER: 'primary',
    SCHOOL_ADMIN: 'secondary',
    COOK: 'success',
    SUPERVISOR: 'warning',
  } as const;

  useEffect(() => {
    fetchTeachers();
    fetchSchools();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      // Start with empty teachers list - admin will create teachers as needed
      setTeachers([]);
      console.log('Teachers initialized as empty - ready for admin to create teachers');
    } catch (error) {
      console.error('Error loading teachers:', error);
      showSnackbar('Failed to load teachers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchools = async () => {
    try {
      // Load schools from localStorage (where they're saved when created)
      const savedSchools = localStorage.getItem('schools_data');
      
      if (savedSchools) {
        const parsedSchools = JSON.parse(savedSchools);
        setSchools(parsedSchools);
        console.log('Schools loaded from localStorage:', parsedSchools);
        return;
      }

      // If no saved schools, start with empty list (clean production start)
      setSchools([]);
      console.log('No schools found - starting with empty list');
    } catch (error) {
      console.error('Error loading schools:', error);
      setSchools([]);
    }
  };

  const createSchool = async () => {
    try {
      // Create school data
      const schoolData = {
        id: Date.now(),
        name: newSchool.name,
        code: newSchool.code,
        address: newSchool.address,
        city: newSchool.city,
        state: newSchool.state,
        phone: newSchool.phone,
        email: newSchool.email,
        principalName: newSchool.principalName,
        totalStudents: 0,
        active: true
      };
      
      // Add to local schools list
      const updatedSchools = [...schools, schoolData];
      setSchools(updatedSchools);
      
      // Save to localStorage for persistence
      localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
      
      showSnackbar(`School created successfully!`, 'success');
      setSchoolDialogOpen(false);
      setNewSchool({ name: '', code: '', city: '', state: '', address: '', phone: '', email: '', principalName: '' });
    } catch (error: any) {
      console.error('Error creating school:', error);
      showSnackbar('Failed to create school', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const openCreateDialog = () => {
    setEditingTeacher(null);
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'TEACHER',
      schoolId: null,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      username: teacher.username,
      password: '',
      fullName: teacher.fullName,
      email: teacher.email,
      phone: teacher.phone,
      role: teacher.role,
      schoolId: teacher.school?.id || null,
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTeacher(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingTeacher) {
        // Update existing teacher (simulated)
        showSnackbar('Teacher updated successfully (demo mode)', 'success');
      } else {
        // Create new teacher (simulated)
        const schoolInfo = formData.schoolId ? schools.find(s => s.id === formData.schoolId) : null;
        
        const newTeacher = {
          id: Date.now(),
          username: formData.username,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          school: schoolInfo,
          active: true,
          createdAt: new Date().toISOString()
        };
        
        // Add to display list
        setTeachers(prev => [...prev, newTeacher as Teacher]);
        
        // Save to localStorage for authentication
        const savedTeachers = localStorage.getItem('created_teachers');
        const teachersList = savedTeachers ? JSON.parse(savedTeachers) : [];
        teachersList.push({
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
          schoolName: schoolInfo?.name || null
        });
        localStorage.setItem('created_teachers', JSON.stringify(teachersList));
        
        console.log('Teacher created and saved to localStorage:', {
          username: formData.username,
          password: formData.password,
          fullName: formData.fullName
        });
        
        showSnackbar(`Teacher created successfully! Login: ${formData.username} / ${formData.password}`, 'success');
      }
      
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving teacher:', error);
      showSnackbar('Failed to save teacher', 'error');
    }
  };

  const handleDelete = async (teacherId: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        // Remove teacher from local state (simulated delete)
        setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
        showSnackbar('Teacher deleted successfully (demo mode)', 'success');
      } catch (error) {
        console.error('Error deleting teacher:', error);
        showSnackbar('Failed to delete teacher', 'error');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'fullName', headerName: 'Full Name', width: 200 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={roleLabels[params.value as keyof typeof roleLabels]}
          color={roleColors[params.value as keyof typeof roleColors]}
          size="small"
        />
      ),
    },
    {
      field: 'school',
      headerName: 'School',
      width: 200,
      renderCell: (params) => params.value?.name || 'Not Assigned',
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
          Teacher & Staff Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage teachers, principals, cooks, and supervisors in your schools
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
            size="large"
          >
            Add New Teacher/Staff
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<SchoolIcon />}
            onClick={() => setSchoolDialogOpen(true)}
            size="large"
          >
            Add School
          </Button>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          Total: {teachers.length} staff members | Schools: {schools.length}
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(roleLabels).map(([role, label]) => {
          const count = teachers.filter(t => t.role === role).length;
          return (
            <Grid item xs={12} sm={6} md={3} key={role}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">{count}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={teachers}
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
          {editingTeacher ? 'Edit Teacher/Staff' : 'Add New Teacher/Staff'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Username"
                fullWidth
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={!!editingTeacher}
                helperText={editingTeacher ? "Username cannot be changed" : ""}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                helperText={editingTeacher ? "Leave blank to keep current password" : "Minimum 6 characters"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                fullWidth
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                select
                label="Role"
                fullWidth
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="School (Optional)"
                fullWidth
                value={formData.schoolId || ''}
                onChange={(e) => setFormData({ ...formData, schoolId: e.target.value ? Number(e.target.value) : null })}
                helperText={schools.length === 0 ? "No schools available - add schools first" : ""}
              >
                <MenuItem value="">No School Assigned</MenuItem>
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.name} ({school.code})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.username || !formData.fullName || (!editingTeacher && !formData.password)}
          >
            {editingTeacher ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* School Creation Dialog */}
      <Dialog open={schoolDialogOpen} onClose={() => setSchoolDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New School</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="School Name"
                fullWidth
                value={newSchool.name}
                onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="School Code"
                fullWidth
                value={newSchool.code}
                onChange={(e) => setNewSchool({ ...newSchool, code: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                fullWidth
                value={newSchool.city}
                onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="State"
                fullWidth
                value={newSchool.state}
                onChange={(e) => setNewSchool({ ...newSchool, state: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                value={newSchool.address}
                onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                fullWidth
                value={newSchool.phone}
                onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                fullWidth
                value={newSchool.email}
                onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Principal Name"
                fullWidth
                value={newSchool.principalName}
                onChange={(e) => setNewSchool({ ...newSchool, principalName: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSchoolDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={createSchool} 
            variant="contained"
            disabled={!newSchool.name || !newSchool.code}
          >
            Create School
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

export default TeacherManagementPage;