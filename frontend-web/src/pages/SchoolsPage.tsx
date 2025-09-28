import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Switch,
  FormControlLabel,
  Avatar,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Visibility as ViewIcon,
  VpnKey as KeyIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface School {
  id: number;
  code: string;
  name: string;
  name_english: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  principal_name: string;
  total_students: number;
  grade_1_5_count: number;
  grade_6_8_count: number;
  active: boolean;
  created_date: string;
}

interface Teacher {
  id: number;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  school_id: number;
  role: 'SCHOOL_ADMIN' | 'TEACHER';
  active: boolean;
  last_login?: string;
}

const SchoolsPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [schools, setSchools] = useState<School[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [openSchoolDialog, setOpenSchoolDialog] = useState(false);
  const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [selectedSchoolForTeacher, setSelectedSchoolForTeacher] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Only allow access to system admins
  if (!isAdmin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="error">
          <Typography variant="h6">Access Denied</Typography>
          <Typography variant="body2">
            केवळ सिस्टम प्रशासकांना ही पानाची परवानगी आहे.<br/>
            Only System Administrators can access this page.
          </Typography>
        </Alert>
      </Box>
    );
  }

  const [schoolForm, setSchoolForm] = useState<Partial<School>>({
    code: '',
    name: '',
    name_english: '',
    address: '',
    city: '',
    state: 'महाराष्ट्र',
    pincode: '',
    phone: '',
    email: '',
    principal_name: '',
    total_students: 0,
    grade_1_5_count: 0,
    grade_6_8_count: 0,
    active: true
  });

  const [teacherForm, setTeacherForm] = useState<Partial<Teacher>>({
    username: '',
    full_name: '',
    email: '',
    phone: '',
    school_id: 0,
    role: 'TEACHER',
    active: true
  });

  useEffect(() => {
    // Default teacher data for initialization
    const defaultTeachers: Teacher[] = [
      {
        id: 1,
        username: 'sunita.patel',
        full_name: 'श्रीमती सुनिता पाटेल',
        email: 'sunita.patel@school.gov.in',
        phone: '9876543210',
        school_id: 1,
        role: 'SCHOOL_ADMIN',
        active: true,
        last_login: '2025-09-27'
      },
      {
        id: 2,
        username: 'rajesh.sharma',
        full_name: 'श्री राजेश शर्मा',
        email: 'rajesh.sharma@school.gov.in',
        phone: '9876543211',
        school_id: 2,
        role: 'SCHOOL_ADMIN',
        active: true,
        last_login: '2025-09-26'
      }
    ];

    // Load schools and teachers from localStorage
    const savedSchools = localStorage.getItem('schools_data');
    const savedTeachers = localStorage.getItem('teachers_data');

    if (savedSchools) {
      setSchools(JSON.parse(savedSchools));
    } else {
      // Default school data
      const defaultSchools: School[] = [
        {
          id: 1,
          code: 'PIMPRI_AVAGHAD_001',
          name: 'जिल्हा परिषद प्राथमिक शाळा पिंप्री अवघड',
          name_english: 'District Council Primary School Pimpri Avaghad',
          address: 'पिंप्री अवघड, केंद्र- सडे',
          city: 'राहुरी',
          state: 'महाराष्ट्र',
          pincode: '413705',
          phone: '9876543210',
          email: 'pimpri.avaghad@education.gov.in',
          principal_name: 'श्रीमती सुनिता पाटेल',
          total_students: 155,
          grade_1_5_count: 121,
          grade_6_8_count: 34,
          active: true,
          created_date: '2025-01-01'
        },
        {
          id: 2,
          code: 'NEHRU_SEC_001',
          name: 'नेहरू माध्यमिक शाळा',
          name_english: 'Nehru Secondary School',
          address: 'चिंचवड',
          city: 'पुणे',
          state: 'महाराष्ट्र',
          pincode: '411019',
          phone: '9876543211',
          email: 'nehru.secondary@education.gov.in',
          principal_name: 'श्री राजेश शर्मा',
          total_students: 300,
          grade_1_5_count: 180,
          grade_6_8_count: 120,
          active: true,
          created_date: '2025-01-01'
        }
      ];
      setSchools(defaultSchools);
      localStorage.setItem('schools_data', JSON.stringify(defaultSchools));
    }

    if (savedTeachers) {
      setTeachers(JSON.parse(savedTeachers));
    } else {
      setTeachers(defaultTeachers);
      localStorage.setItem('teachers_data', JSON.stringify(defaultTeachers));
    }

    // Ensure users_data exists for authentication
    const savedUsers = localStorage.getItem('users_data');
    if (!savedUsers) {
      const currentTeachers = savedTeachers ? JSON.parse(savedTeachers) : defaultTeachers;
      localStorage.setItem('users_data', JSON.stringify(currentTeachers));
    }
  }, []);

  const handleCreateSchool = () => {
    setEditingSchool(null);
    setSchoolForm({
      code: '',
      name: '',
      name_english: '',
      address: '',
      city: '',
      state: 'महाराष्ट्र',
      pincode: '',
      phone: '',
      email: '',
      principal_name: '',
      total_students: 0,
      grade_1_5_count: 0,
      grade_6_8_count: 0,
      active: true
    });
    setOpenSchoolDialog(true);
  };

  const handleEditSchool = (school: School) => {
    setEditingSchool(school);
    setSchoolForm({ ...school });
    setOpenSchoolDialog(true);
  };

  const handleSaveSchool = () => {
    const newSchool: School = {
      ...schoolForm as School,
      id: editingSchool?.id || Date.now(),
      created_date: editingSchool?.created_date || new Date().toISOString().split('T')[0]
    };

    let updatedSchools;
    if (editingSchool) {
      updatedSchools = schools.map(s => s.id === editingSchool.id ? newSchool : s);
    } else {
      updatedSchools = [...schools, newSchool];
    }

    setSchools(updatedSchools);
    localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
    setOpenSchoolDialog(false);
  };

  const handleCreateTeacher = (schoolId?: number) => {
    setEditingTeacher(null);
    setTeacherForm({
      username: '',
      full_name: '',
      email: '',
      phone: '',
      school_id: schoolId || 0,
      role: 'TEACHER',
      active: true
    });
    setSelectedSchoolForTeacher(schoolId || 0);
    setOpenTeacherDialog(true);
  };

  const handleSaveTeacher = () => {
    const newTeacher: Teacher = {
      ...teacherForm as Teacher,
      id: editingTeacher?.id || Date.now()
    };

    let updatedTeachers;
    if (editingTeacher) {
      updatedTeachers = teachers.map(t => t.id === editingTeacher.id ? newTeacher : t);
    } else {
      updatedTeachers = [...teachers, newTeacher];
    }

    setTeachers(updatedTeachers);
    localStorage.setItem('teachers_data', JSON.stringify(updatedTeachers));
    setOpenTeacherDialog(false);
  };

  const handleDeleteSchool = (schoolId: number) => {
    const school = schools.find(s => s.id === schoolId);
    if (!school) return;

    if (window.confirm(`या शाळा डिलीट करायची आहे का?\n\n${school.name}\n${school.name_english}\n\nसर्व संबंधित शिक्षक आणि डेटा देखील डिलीट होईल.`)) {
      const updatedSchools = schools.filter(s => s.id !== schoolId);
      const updatedTeachers = teachers.filter(t => t.school_id !== schoolId);
      
      setSchools(updatedSchools);
      setTeachers(updatedTeachers);
      localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
      localStorage.setItem('teachers_data', JSON.stringify(updatedTeachers));
    }
  };

  const handleToggleSchoolActive = (schoolId: number) => {
    const updatedSchools = schools.map(s => 
      s.id === schoolId ? { ...s, active: !s.active } : s
    );
    setSchools(updatedSchools);
    localStorage.setItem('schools_data', JSON.stringify(updatedSchools));
  };

  const getSchoolTeachers = (schoolId: number) => {
    return teachers.filter(t => t.school_id === schoolId);
  };

  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.name_english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" display="flex" alignItems="center" gap={1}>
          <SchoolIcon /> शाळा व्यवस्थापन (Schools Administration)
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => handleCreateTeacher()}
          >
            नवे शिक्षक जोडा (Add Teacher)
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateSchool}
            color="primary"
          >
            नवी शाळा जोडा (Add New School)
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Search & Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="शाळा शोधा (Search Schools)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    placeholder="शाळेचे नाव, कोड किंवा इंग्रजी नाव..."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" gap={2}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">{schools.length}</Typography>
                      <Typography variant="caption">एकूण शाळा</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" color="secondary">{teachers.length}</Typography>
                      <Typography variant="caption">एकूण शिक्षक</Typography>
                    </Box>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {schools.reduce((sum, s) => sum + s.total_students, 0)}
                      </Typography>
                      <Typography variant="caption">एकूण विद्यार्थी</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Schools List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                शाळांची यादी (Schools List) - {filteredSchools.length} शाळा
              </Typography>
              
              {filteredSchools.map((school) => {
                const schoolTeachers = getSchoolTeachers(school.id);
                
                return (
                  <Card key={school.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Box display="flex" alignItems="center" gap={2} mb={1}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <SchoolIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h6">
                                {school.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {school.name_english} • {school.code}
                              </Typography>
                            </Box>
                            <Box>
                              <Chip 
                                label={school.active ? 'सक्रिय' : 'निष्क्रिय'} 
                                color={school.active ? 'success' : 'default'}
                                size="small"
                              />
                            </Box>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2">
                                <strong>मुख्याध्यापक:</strong> {school.principal_name}
                              </Typography>
                              <Typography variant="body2">
                                <strong>पत्ता:</strong> {school.address}, {school.city}
                              </Typography>
                              <Typography variant="body2">
                                <strong>फोन:</strong> {school.phone} • <strong>ईमेल:</strong> {school.email}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2">
                                <strong>एकूण विद्यार्थी:</strong> {school.total_students}
                              </Typography>
                              <Typography variant="body2">
                                <strong>वर्ग 1-5:</strong> {school.grade_1_5_count} • <strong>वर्ग 6-8:</strong> {school.grade_6_8_count}
                              </Typography>
                              <Typography variant="body2">
                                <strong>शिक्षक:</strong> {schoolTeachers.length} • <strong>सक्रिय:</strong> {schoolTeachers.filter(t => t.active).length}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Box display="flex" flexDirection="column" gap={1}>
                            <Box display="flex" gap={1}>
                              <Tooltip title="शाळा संपादित करा">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditSchool(school)}
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="शिक्षक जोडा">
                                <IconButton
                                  size="small"
                                  onClick={() => handleCreateTeacher(school.id)}
                                  color="secondary"
                                >
                                  <PersonAddIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="शाळा डिलीट करा">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteSchool(school.id)}
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={school.active}
                                  onChange={() => handleToggleSchoolActive(school.id)}
                                  size="small"
                                />
                              }
                              label="सक्रिय"
                            />

                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<ViewIcon />}
                              onClick={() => handleCreateTeacher(school.id)}
                            >
                              शिक्षक पहा ({schoolTeachers.length})
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredSchools.length === 0 && (
                <Alert severity="info">
                  {searchTerm 
                    ? 'या शोधानुसार कोणत्याही शाळा सापडल्या नाहीत.' 
                    : 'अजून कोणत्याही शाळा जोडल्या नाहीत. नवी शाळा जोडण्यासाठी वरील बटण दाबा.'
                  }
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit School Dialog */}
      <Dialog open={openSchoolDialog} onClose={() => setOpenSchoolDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSchool ? 'शाळा संपादित करा' : 'नवी शाळा जोडा'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="शाळा कोड (School Code) *"
                  value={schoolForm.code}
                  onChange={(e) => setSchoolForm({...schoolForm, code: e.target.value.toUpperCase()})}
                  fullWidth
                  required
                  placeholder="SCHOOL_CODE_001"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={schoolForm.active}
                      onChange={(e) => setSchoolForm({...schoolForm, active: e.target.checked})}
                    />
                  }
                  label="सक्रिय (Active)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="शाळेचे नाव (मराठी) *"
                  value={schoolForm.name}
                  onChange={(e) => setSchoolForm({...schoolForm, name: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="School Name (English) *"
                  value={schoolForm.name_english}
                  onChange={(e) => setSchoolForm({...schoolForm, name_english: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="मुख्याध्यापक नाव *"
                  value={schoolForm.principal_name}
                  onChange={(e) => setSchoolForm({...schoolForm, principal_name: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="फोन नंबर *"
                  value={schoolForm.phone}
                  onChange={(e) => setSchoolForm({...schoolForm, phone: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ईमेल पत्ता *"
                  type="email"
                  value={schoolForm.email}
                  onChange={(e) => setSchoolForm({...schoolForm, email: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="पत्ता (Address) *"
                  value={schoolForm.address}
                  onChange={(e) => setSchoolForm({...schoolForm, address: e.target.value})}
                  fullWidth
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="शहर (City) *"
                  value={schoolForm.city}
                  onChange={(e) => setSchoolForm({...schoolForm, city: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="राज्य (State)"
                  value={schoolForm.state}
                  onChange={(e) => setSchoolForm({...schoolForm, state: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="पिन कोड"
                  value={schoolForm.pincode}
                  onChange={(e) => setSchoolForm({...schoolForm, pincode: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="एकूण विद्यार्थी *"
                  type="number"
                  value={schoolForm.total_students}
                  onChange={(e) => setSchoolForm({...schoolForm, total_students: parseInt(e.target.value) || 0})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="वर्ग 1-5 विद्यार्थी *"
                  type="number"
                  value={schoolForm.grade_1_5_count}
                  onChange={(e) => setSchoolForm({...schoolForm, grade_1_5_count: parseInt(e.target.value) || 0})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="वर्ग 6-8 विद्यार्थी *"
                  type="number"
                  value={schoolForm.grade_6_8_count}
                  onChange={(e) => setSchoolForm({...schoolForm, grade_6_8_count: parseInt(e.target.value) || 0})}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSchoolDialog(false)} startIcon={<CancelIcon />}>
            रद्द करा (Cancel)
          </Button>
          <Button 
            onClick={handleSaveSchool}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!schoolForm.name || !schoolForm.code || !schoolForm.name_english}
          >
            {editingSchool ? 'अपडेट करा (Update)' : 'जतन करा (Save)'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Teacher Dialog */}
      <Dialog open={openTeacherDialog} onClose={() => setOpenTeacherDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTeacher ? 'शिक्षक संपादित करा' : 'नवे शिक्षक जोडा'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={3}>
              {!selectedSchoolForTeacher && (
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>शाळा निवडा (Select School) *</InputLabel>
                    <Select
                      value={teacherForm.school_id}
                      onChange={(e) => setTeacherForm({...teacherForm, school_id: e.target.value as number})}
                      label="शाळा निवडा (Select School) *"
                      required
                    >
                      {schools.filter(s => s.active).map(school => (
                        <MenuItem key={school.id} value={school.id}>
                          {school.name} ({school.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  label="शिक्षकाचे पूर्ण नाव *"
                  value={teacherForm.full_name}
                  onChange={(e) => setTeacherForm({...teacherForm, full_name: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="वापरकर्ता नाव (Username) *"
                  value={teacherForm.username}
                  onChange={(e) => setTeacherForm({...teacherForm, username: e.target.value.toLowerCase()})}
                  fullWidth
                  required
                  helperText="लॉगिन साठी वापरले जाईल"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>भूमिका (Role)</InputLabel>
                  <Select
                    value={teacherForm.role}
                    onChange={(e) => setTeacherForm({...teacherForm, role: e.target.value as any})}
                    label="भूमिका (Role)"
                  >
                    <MenuItem value="SCHOOL_ADMIN">शाळा प्रशासक (School Admin)</MenuItem>
                    <MenuItem value="TEACHER">शिक्षक (Teacher)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ईमेल पत्ता *"
                  type="email"
                  value={teacherForm.email}
                  onChange={(e) => setTeacherForm({...teacherForm, email: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="फोन नंबर *"
                  value={teacherForm.phone}
                  onChange={(e) => setTeacherForm({...teacherForm, phone: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={teacherForm.active}
                      onChange={(e) => setTeacherForm({...teacherForm, active: e.target.checked})}
                    />
                  }
                  label="सक्रिय (Active)"
                />
              </Grid>
            </Grid>

            {selectedSchoolForTeacher > 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  या शिक्षकाला <strong>{schools.find(s => s.id === selectedSchoolForTeacher)?.name}</strong> शाळेत नियुक्त केले जाईल.
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTeacherDialog(false)} startIcon={<CancelIcon />}>
            रद्द करा (Cancel)
          </Button>
          <Button 
            onClick={handleSaveTeacher}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!teacherForm.full_name || !teacherForm.username || !teacherForm.email || !teacherForm.school_id}
          >
            {editingTeacher ? 'अपडेट करा (Update)' : 'तयार करा (Create)'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchoolsPage;