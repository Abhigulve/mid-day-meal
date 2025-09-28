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
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  EventBusy as HolidayIcon,
  CalendarToday as CalendarIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Holiday {
  id: number;
  date: string;
  name: string;
  name_marathi: string;
  type: 'NATIONAL' | 'STATE' | 'LOCAL' | 'SCHOOL' | 'SATURDAY_HOLIDAY';
  description?: string;
  active: boolean;
}

interface SchoolConfig {
  saturdayHoliday: boolean;
  weeklyHolidays: string[];
  saturdayExceptions: string[];
}

const HolidayManagementPage: React.FC = () => {
  const { user, isAdmin, isSchoolAdmin } = useAuth();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  
  // School Configuration State
  const [schoolConfig, setSchoolConfig] = useState<SchoolConfig>({
    saturdayHoliday: false,
    weeklyHolidays: ['SUN'],
    saturdayExceptions: []
  });

  // Only allow access to school-level users
  if (isAdmin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="info">
          <Typography variant="h6">School Operations</Typography>
          <Typography variant="body2">
            हे पान शाळा स्तरावरील कार्यासाठी आहे. सिस्टम प्रशासकांना दैनंदिन ऑपरेशन्सची गरज नाही.<br/>
            This page is for school-level operations. System administrators don't need daily operations access.
          </Typography>
        </Alert>
      </Box>
    );
  }

  const [holidayForm, setHolidayForm] = useState<{
    date: string;
    name: string;
    name_marathi: string;
    type: 'NATIONAL' | 'STATE' | 'LOCAL' | 'SCHOOL' | 'SATURDAY_HOLIDAY';
    description: string;
    active: boolean;
  }>({
    date: '',
    name: '',
    name_marathi: '',
    type: 'LOCAL',
    description: '',
    active: true
  });

  useEffect(() => {
    // Load school configuration
    const savedConfig = localStorage.getItem('school_config');
    if (savedConfig) {
      setSchoolConfig(JSON.parse(savedConfig));
    }

    // Load holidays from localStorage
    const savedHolidays = localStorage.getItem('middaymeal_holidays');
    if (savedHolidays) {
      setHolidays(JSON.parse(savedHolidays));
    } else {
      // Default holidays
      const defaultHolidays: Holiday[] = [
        {
          id: 1,
          date: '2025-01-26',
          name: 'Republic Day',
          name_marathi: 'प्रजासत्ताक दिन',
          type: 'NATIONAL',
          description: 'National Holiday - Schools Closed',
          active: true
        },
        {
          id: 2,
          date: '2025-08-15',
          name: 'Independence Day',
          name_marathi: 'स्वातंत्र्य दिन',
          type: 'NATIONAL',
          description: 'National Holiday - Schools Closed',
          active: true
        },
        {
          id: 3,
          date: '2025-09-19',
          name: 'Ganesh Chaturthi',
          name_marathi: 'गणेश चतुर्थी',
          type: 'STATE',
          description: 'Maharashtra State Holiday',
          active: true
        },
        {
          id: 4,
          date: '2025-10-02',
          name: 'Gandhi Jayanti',
          name_marathi: 'गांधी जयंती',
          type: 'NATIONAL',
          description: 'National Holiday - Schools Closed',
          active: true
        }
      ];
      setHolidays(defaultHolidays);
      localStorage.setItem('middaymeal_holidays', JSON.stringify(defaultHolidays));
    }
  }, []);

  const handleCreateHoliday = () => {
    setEditingHoliday(null);
    setHolidayForm({
      date: '',
      name: '',
      name_marathi: '',
      type: 'LOCAL',
      description: '',
      active: true
    });
    setOpenDialog(true);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setHolidayForm({
      date: holiday.date,
      name: holiday.name,
      name_marathi: holiday.name_marathi,
      type: holiday.type,
      description: holiday.description || '',
      active: holiday.active
    });
    setOpenDialog(true);
  };

  const updateSaturdayHolidays = (config: SchoolConfig) => {
    let updatedHolidays = holidays.filter(h => h.type !== 'SATURDAY_HOLIDAY');
    
    if (config.saturdayHoliday) {
      const currentYear = new Date().getFullYear();
      const saturdayHolidays = [];
      
      for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= 31; day++) {
          const date = new Date(currentYear, month, day);
          if (date.getMonth() === month && date.getDay() === 6) {
            const dateStr = date.toISOString().split('T')[0];
            
            if (!config.saturdayExceptions.includes(dateStr)) {
              saturdayHolidays.push({
                id: Date.now() + Math.random(),
                date: dateStr,
                name: 'Saturday Holiday',
                name_marathi: 'शनिवार सुट्टी',
                type: 'SATURDAY_HOLIDAY' as const,
                description: 'Weekly Saturday Holiday',
                active: true
              });
            }
          }
        }
      }
      updatedHolidays = [...updatedHolidays, ...saturdayHolidays];
    }
    
    return updatedHolidays;
  };

  const handleSaturdayToggle = (enabled: boolean) => {
    const newConfig = {
      ...schoolConfig,
      saturdayHoliday: enabled,
      weeklyHolidays: enabled ? ['SAT', 'SUN'] : ['SUN']
    };
    
    setSchoolConfig(newConfig);
    localStorage.setItem('school_config', JSON.stringify(newConfig));
    
    const updatedHolidays = updateSaturdayHolidays(newConfig);
    setHolidays(updatedHolidays);
    localStorage.setItem('middaymeal_holidays', JSON.stringify(updatedHolidays));
  };

  const handleSaveHoliday = () => {
    const newHoliday: Holiday = {
      id: editingHoliday?.id || Date.now(),
      date: holidayForm.date,
      name: holidayForm.name,
      name_marathi: holidayForm.name_marathi,
      type: holidayForm.type,
      description: holidayForm.description,
      active: holidayForm.active
    };

    let updatedHolidays;
    if (editingHoliday) {
      updatedHolidays = holidays.map(h => h.id === editingHoliday.id ? newHoliday : h);
    } else {
      updatedHolidays = [...holidays, newHoliday];
    }

    setHolidays(updatedHolidays);
    localStorage.setItem('middaymeal_holidays', JSON.stringify(updatedHolidays));
    setOpenDialog(false);
  };

  const handleDeleteHoliday = (holidayId: number) => {
    const holidayToDelete = holidays.find(h => h.id === holidayId);
    if (!holidayToDelete) return;

    if (window.confirm(`या सुट्टी डिलीट करायची आहे का?\n\n${holidayToDelete.name_marathi} (${holidayToDelete.name})\n${new Date(holidayToDelete.date).toLocaleDateString('mr-IN')}`)) {
      const updatedHolidays = holidays.filter(h => h.id !== holidayId);
      setHolidays(updatedHolidays);
      localStorage.setItem('middaymeal_holidays', JSON.stringify(updatedHolidays));
    }
  };

  const handleToggleActive = (holidayId: number) => {
    const updatedHolidays = holidays.map(h => 
      h.id === holidayId ? { ...h, active: !h.active } : h
    );
    setHolidays(updatedHolidays);
    localStorage.setItem('middaymeal_holidays', JSON.stringify(updatedHolidays));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NATIONAL': return 'error';
      case 'STATE': return 'warning';
      case 'LOCAL': return 'info';
      case 'SCHOOL': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'NATIONAL': return 'राष्ट्रीय';
      case 'STATE': return 'राज्य';
      case 'LOCAL': return 'स्थानिक';
      case 'SCHOOL': return 'शालेय';
      default: return type;
    }
  };

  const filteredHolidays = holidays.filter(holiday => {
    const matchesSearch = holiday.name_marathi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         holiday.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || holiday.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" display="flex" alignItems="center" gap={1}>
          <HolidayIcon /> सुट्टी व कॉन्फिगरेशन (Holiday & Configuration)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateHoliday}
          color="primary"
        >
          नवीन सुट्टी जोडा (Add New Holiday)
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* School Configuration */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center" gap={1}>
                <SettingsIcon /> शालेय कॉन्फिगरेशन (School Configuration)
              </Typography>
              
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={schoolConfig.saturdayHoliday}
                        onChange={(e) => handleSaturdayToggle(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1">
                          सर्व शनिवार सुट्टी (All Saturdays Holiday)
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {schoolConfig.saturdayHoliday 
                            ? '5-दिवसीय आठवडा (Mon-Fri working)' 
                            : '6-दिवसीय आठवडा (Mon-Sat working)'
                          }
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Alert severity={schoolConfig.saturdayHoliday ? "success" : "info"}>
                    <Typography variant="body2">
                      <strong>कार्यदिवस:</strong> {schoolConfig.saturdayHoliday ? 'सोम-शुक्र' : 'सोम-शनि'}
                      <br />
                      <strong>साप्ताहिक सुट्ट्या:</strong> {schoolConfig.weeklyHolidays.includes('SAT') ? 'शनि, रवि' : 'रवि'}
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>फिल्टर (Filters)</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="शोधा (Search)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    placeholder="सुट्टीचे नाव शोधा..."
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>प्रकार (Type)</InputLabel>
                    <Select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      label="प्रकार (Type)"
                    >
                      <MenuItem value="ALL">सर्व प्रकार</MenuItem>
                      <MenuItem value="NATIONAL">राष्ट्रीय सुट्टी</MenuItem>
                      <MenuItem value="STATE">राज्य सुट्टी</MenuItem>
                      <MenuItem value="LOCAL">स्थानिक सुट्टी</MenuItem>
                      <MenuItem value="SCHOOL">शालेय सुट्टी</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography variant="body2" color="textSecondary">
                    एकूण: {filteredHolidays.length} सुट्ट्या
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Holidays Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                सुट्ट्यांची यादी (Holidays List)
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>तारीख (Date)</TableCell>
                      <TableCell>सुट्टी (Holiday)</TableCell>
                      <TableCell>प्रकार (Type)</TableCell>
                      <TableCell>तपशील (Description)</TableCell>
                      <TableCell>स्थिती (Status)</TableCell>
                      <TableCell>क्रिया (Actions)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredHolidays
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((holiday) => (
                      <TableRow key={holiday.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarIcon fontSize="small" />
                            {new Date(holiday.date).toLocaleDateString('mr-IN')}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {holiday.name_marathi}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {holiday.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getTypeLabel(holiday.type)} 
                            color={getTypeColor(holiday.type) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {holiday.description || 'तपशील नाही'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={holiday.active}
                                onChange={() => handleToggleActive(holiday.id)}
                                size="small"
                              />
                            }
                            label={holiday.active ? 'सक्रिय' : 'निष्क्रिय'}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEditHoliday(holiday)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteHoliday(holiday.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredHolidays.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {searchTerm || filterType !== 'ALL' 
                    ? 'या फिल्टरनुसार कोणत्याही सुट्ट्या सापडल्या नाहीत.' 
                    : 'अजून कोणत्याही सुट्ट्या जोडल्या नाहीत. नवीन सुट्टी जोडण्यासाठी वरील बटण दाबा.'
                  }
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Holiday Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingHoliday ? 'सुट्टी संपादित करा' : 'नवीन सुट्टी जोडा'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="तारीख (Date) *"
                  type="date"
                  value={holidayForm.date}
                  onChange={(e) => setHolidayForm({...holidayForm, date: e.target.value})}
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="सुट्टीचे नाव (मराठी) *"
                  value={holidayForm.name_marathi}
                  onChange={(e) => setHolidayForm({...holidayForm, name_marathi: e.target.value})}
                  fullWidth
                  required
                  placeholder="उदा: गणेश चतुर्थी, दिवाळी"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Holiday Name (English) *"
                  value={holidayForm.name}
                  onChange={(e) => setHolidayForm({...holidayForm, name: e.target.value})}
                  fullWidth
                  required
                  placeholder="e.g: Ganesh Chaturthi, Diwali"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>सुट्टीचा प्रकार (Holiday Type)</InputLabel>
                  <Select
                    value={holidayForm.type}
                    onChange={(e) => setHolidayForm({...holidayForm, type: e.target.value as any})}
                    label="सुट्टीचा प्रकार (Holiday Type)"
                  >
                    <MenuItem value="NATIONAL">राष्ट्रीय सुट्टी (National Holiday)</MenuItem>
                    <MenuItem value="STATE">राज्य सुट्टी (State Holiday)</MenuItem>
                    <MenuItem value="LOCAL">स्थानिक सुट्टी (Local Holiday)</MenuItem>
                    <MenuItem value="SCHOOL">शालेय सुट्टी (School Holiday)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={holidayForm.active}
                      onChange={(e) => setHolidayForm({...holidayForm, active: e.target.checked})}
                    />
                  }
                  label="सक्रिय (Active)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="तपशील (Description)"
                  value={holidayForm.description}
                  onChange={(e) => setHolidayForm({...holidayForm, description: e.target.value})}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="सुट्टीबद्दल अधिक माहिती..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />}>
            रद्द करा (Cancel)
          </Button>
          <Button 
            onClick={handleSaveHoliday}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!holidayForm.name_marathi || !holidayForm.name || !holidayForm.date}
          >
            {editingHoliday ? 'अपडेट करा (Update)' : 'जतन करा (Save)'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HolidayManagementPage;