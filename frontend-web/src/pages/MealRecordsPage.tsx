import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Restaurant as RestaurantIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface FoodItem {
  id: number;
  name: string;
  name_marathi: string;
  category: string;
  unit: string;
  total_quantity: number;
}

interface MenuTemplate {
  id: number;
  template_name: string;
  description_marathi: string;
  ingredient_count: number;
}

interface MealRecord {
  id?: number;
  school_id: number;
  date: string;
  meal_type: string;
  grade_1_5_present: number;
  grade_6_8_present: number;
  total_cost: number;
  status: string;
  template_id?: number;
}

interface School {
  id: number;
  name: string;
  code: string;
  grade_1_5_count: number;
  grade_6_8_count: number;
}

const MealRecordsPage: React.FC = () => {
  const { user, isAdmin, isSchoolAdmin } = useAuth();
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [menuTemplates, setMenuTemplates] = useState<MenuTemplate[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSchool, setSelectedSchool] = useState<number>(user?.school_id || 1);
  const [selectedMenu, setSelectedMenu] = useState<number>(0);
  const [mealType, setMealType] = useState<string>('LUNCH');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MealRecord | null>(null);

  // Block admin access to daily operations
  if (isAdmin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="info">
          <Typography variant="h6">Daily Operations</Typography>
          <Typography variant="body2">
            हे पान दैनंदिन जेवण नोंदीसाठी आहे. सिस्टम प्रशासकांना ही गरज नाही.<br/>
            This page is for daily meal recording. System administrators don't handle daily operations.
          </Typography>
        </Alert>
      </Box>
    );
  }
  
  // Form state for meal recording
  const [formData, setFormData] = useState({
    grade_1_5_present: 0,
    grade_6_8_present: 0,
    cooking_cost: 0,
    remarks: '',
    meal_quality: 'GOOD'
  });

  // Real data from Pimpri Avaghad School Excel file
  useEffect(() => {
    setSchools([
      { 
        id: 1, 
        name: 'जिल्हा परिषद प्राथमिक शाळा पिंप्री अवघड', 
        code: 'PIMPRI_AVAGHAD_001', 
        grade_1_5_count: 121, 
        grade_6_8_count: 34 
      },
      { id: 2, name: 'नेहरू माध्यमिक शाळा', code: 'SCH002', grade_1_5_count: 180, grade_6_8_count: 120 },
      { id: 3, name: 'शिवाजी विद्यालय', code: 'SCH003', grade_1_5_count: 90, grade_6_8_count: 60 }
    ]);

    // Fixed menu templates from Excel data
    setMenuTemplates([
      { id: 1, template_name: 'व्हेजिटेबल पुलाव', description_marathi: 'व्हेजिटेबल पुलाव', ingredient_count: 5 },
      { id: 2, template_name: 'डाळ खिचडी', description_marathi: 'डाळ खिचडी', ingredient_count: 5 },
      { id: 3, template_name: 'मोड आलेल्या मटकी उसळभात', description_marathi: 'मोड आलेल्या मटकी उसळभात', ingredient_count: 4 },
      { id: 4, template_name: 'भात डाळ भाजी', description_marathi: 'भात डाळ भाजी', ingredient_count: 5 },
      { id: 5, template_name: 'तांदळाची खीर', description_marathi: 'तांदळाची खीर', ingredient_count: 3 },
      { id: 6, template_name: 'हरभरा पुलाव', description_marathi: 'हरभरा पुलाव', ingredient_count: 4 },
      { id: 7, template_name: 'मसुरी पुलाव', description_marathi: 'मसुरी पुलाव', ingredient_count: 4 },
      { id: 8, template_name: 'सोयाबीन पुलाव', description_marathi: 'सोयाबीन पुलाव', ingredient_count: 4 },
      { id: 9, template_name: 'मुगडाळ खिचडी', description_marathi: 'मुगडाळ खिचडी', ingredient_count: 4 },
      { id: 10, template_name: 'चवळीची खिचडी', description_marathi: 'चवळीची खिचडी', ingredient_count: 4 }
    ]);

    // Initialize empty food items - will be populated when menu is selected
    setFoodItems([]);

    // Sample meal records
    setMealRecords([
      {
        id: 1,
        school_id: 1,
        date: '2025-09-27',
        meal_type: 'LUNCH',
        grade_1_5_present: 115,
        grade_6_8_present: 75,
        total_cost: 2850.00,
        status: 'COMPLETED'
      }
    ]);
  }, []);

  // Calculate quantities when menu and student count are selected
  const calculateMenuQuantities = () => {
    if (!selectedMenu || !formData.grade_1_5_present || !formData.grade_6_8_present) {
      return [];
    }

    // Sample calculation based on selected menu
    // In real app, this would call the calculate_menu_quantities function from database
    const menuRecipes: { [key: number]: Array<{name: string, name_marathi: string, grade_1_5_qty: number, grade_6_8_qty: number, unit: string, category: string}> } = {
      1: [ // व्हेजिटेबल पुलाव
        {name: 'Rice', name_marathi: 'तांदूळ', grade_1_5_qty: 0.100, grade_6_8_qty: 0.150, unit: 'KG', category: 'GRAINS'},
        {name: 'Vegetables', name_marathi: 'भाज्या', grade_1_5_qty: 0.075, grade_6_8_qty: 0.100, unit: 'KG', category: 'VEGETABLES'},
        {name: 'Oil', name_marathi: 'तेल', grade_1_5_qty: 0.005, grade_6_8_qty: 0.007, unit: 'LITRE', category: 'OIL'},
        {name: 'Salt', name_marathi: 'मीठ', grade_1_5_qty: 0.003, grade_6_8_qty: 0.004, unit: 'KG', category: 'SPICES'}
      ],
      2: [ // डाळ खिचडी
        {name: 'Rice', name_marathi: 'तांदूळ', grade_1_5_qty: 0.080, grade_6_8_qty: 0.120, unit: 'KG', category: 'GRAINS'},
        {name: 'Tur Dal', name_marathi: 'तुरडाळ', grade_1_5_qty: 0.030, grade_6_8_qty: 0.040, unit: 'KG', category: 'PROTEINS'},
        {name: 'Oil', name_marathi: 'तेल', grade_1_5_qty: 0.005, grade_6_8_qty: 0.007, unit: 'LITRE', category: 'OIL'},
        {name: 'Salt', name_marathi: 'मीठ', grade_1_5_qty: 0.003, grade_6_8_qty: 0.004, unit: 'KG', category: 'SPICES'}
      ],
      3: [ // मटकी उसळभात
        {name: 'Rice', name_marathi: 'तांदूळ', grade_1_5_qty: 0.100, grade_6_8_qty: 0.150, unit: 'KG', category: 'GRAINS'},
        {name: 'Matki', name_marathi: 'मटकी', grade_1_5_qty: 0.025, grade_6_8_qty: 0.035, unit: 'KG', category: 'PROTEINS'},
        {name: 'Oil', name_marathi: 'तेल', grade_1_5_qty: 0.005, grade_6_8_qty: 0.007, unit: 'LITRE', category: 'OIL'}
      ]
    };

    const recipe = menuRecipes[selectedMenu] || [];
    
    return recipe.map((item, index) => {
      const qty_1_5 = item.grade_1_5_qty * formData.grade_1_5_present;
      const qty_6_8 = item.grade_6_8_qty * formData.grade_6_8_present;
      const totalQty = qty_1_5 + qty_6_8;
      
      return {
        id: index + 1,
        name: item.name,
        name_marathi: item.name_marathi,
        category: item.category,
        unit: item.unit,
        total_quantity: parseFloat(totalQty.toFixed(3))
      };
    });
  };

  const handleSaveMealRecord = () => {
    const quantities = calculateMenuQuantities();
    
    // Calculate cost based on official government rates from Excel
    const grade_1_5_rate = 2.59; // ₹2.59 per student per day (from Excel)
    const grade_6_8_rate = 3.88; // ₹3.88 per student per day (from Excel)
    
    const governmentAllocation = (formData.grade_1_5_present * grade_1_5_rate) + 
                                (formData.grade_6_8_present * grade_6_8_rate);
    
    const totalCost = governmentAllocation + formData.cooking_cost;

    const newRecord: MealRecord = {
      id: Date.now(),
      school_id: selectedSchool,
      date: selectedDate,
      meal_type: mealType,
      grade_1_5_present: formData.grade_1_5_present,
      grade_6_8_present: formData.grade_6_8_present,
      total_cost: totalCost,
      status: 'COMPLETED'
    };

    setMealRecords([...mealRecords, newRecord]);
    setOpenDialog(false);
    
    // Reset form
    setFormData({
      grade_1_5_present: 0,
      grade_6_8_present: 0,
      cooking_cost: 0,
      remarks: '',
      meal_quality: 'GOOD'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PREPARED': return 'warning';
      case 'PLANNED': return 'info';
      default: return 'default';
    }
  };

  const selectedSchoolData = schools.find(s => s.id === selectedSchool);
  const selectedMenuData = menuTemplates.find(m => m.id === selectedMenu);
  const quantities = calculateMenuQuantities();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" display="flex" alignItems="center" gap={1}>
          <RestaurantIcon /> दैनिक आहार नोंदी (Daily Meal Records)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          color="primary"
        >
          नवीन आहार नोंद (New Meal Record)
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>फिल्टर (Filters)</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="दिनांक (Date)"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>शाळा (School)</InputLabel>
                    <Select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value as number)}
                      label="शाळा (School)"
                    >
                      {schools.map(school => (
                        <MenuItem key={school.id} value={school.id}>
                          {school.name} ({school.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth>
                    <InputLabel>मेन्यू निवडा (Select Menu)</InputLabel>
                    <Select
                      value={selectedMenu}
                      onChange={(e) => setSelectedMenu(e.target.value as number)}
                      label="मेन्यू निवडा (Select Menu)"
                    >
                      <MenuItem value={0}>-- कृपया मेन्यू निवडा --</MenuItem>
                      {menuTemplates.map(template => (
                        <MenuItem key={template.id} value={template.id}>
                          {template.description_marathi} ({template.ingredient_count} items)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Meal Records Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>आहार नोंदी (Meal Records)</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>दिनांक (Date)</TableCell>
                      <TableCell>शाळा (School)</TableCell>
                      <TableCell>जेवणाचा प्रकार (Meal Type)</TableCell>
                      <TableCell>वर्ग 1-5 उपस्थित</TableCell>
                      <TableCell>वर्ग 6-8 उपस्थित</TableCell>
                      <TableCell>एकूण खर्च (₹)</TableCell>
                      <TableCell>स्थिती (Status)</TableCell>
                      <TableCell>क्रिया (Actions)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mealRecords.filter(record => 
                      record.school_id === selectedSchool && 
                      record.date === selectedDate &&
                      record.meal_type === mealType
                    ).map((record) => {
                      const school = schools.find(s => s.id === record.school_id);
                      return (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{school?.name}</TableCell>
                          <TableCell>
                            {record.meal_type === 'LUNCH' ? 'दुपारचे जेवण' : 
                             record.meal_type === 'BREAKFAST' ? 'नाश्ता' : 'स्नॅक'}
                          </TableCell>
                          <TableCell>{record.grade_1_5_present}</TableCell>
                          <TableCell>{record.grade_6_8_present}</TableCell>
                          <TableCell>₹{record.total_cost.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={record.status} 
                              color={getStatusColor(record.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title="संपादित करा (Edit)">
                              <IconButton size="small" onClick={() => setEditingRecord(record)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {mealRecords.filter(record => 
                      record.school_id === selectedSchool && 
                      record.date === selectedDate &&
                      record.meal_type === mealType
                    ).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          <Typography color="textSecondary">
                            या दिवसासाठी कोणत्याही आहार नोंदी आढळल्या नाहीत (No meal records found for this date)
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Meal Record Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <SchoolIcon />
            नवीन आहार नोंद (New Meal Record) - {selectedSchoolData?.name}
          </Box>
          {selectedMenuData && (
            <Box mt={1}>
              <Chip 
                label={`निवडलेले मेन्यू: ${selectedMenuData.description_marathi}`} 
                color="primary" 
                variant="outlined"
              />
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>मेन्यू निवडा (Select Menu)</InputLabel>
                  <Select
                    value={selectedMenu}
                    onChange={(e) => setSelectedMenu(e.target.value as number)}
                    label="मेन्यू निवडा (Select Menu)"
                  >
                    <MenuItem value={0}>-- कृपया मेन्यू निवडा --</MenuItem>
                    {menuTemplates.map(template => (
                      <MenuItem key={template.id} value={template.id}>
                        {template.description_marathi} ({template.ingredient_count} सामग्री)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="वर्ग 1-5 उपस्थित विद्यार्थी"
                  type="number"
                  value={formData.grade_1_5_present}
                  onChange={(e) => setFormData({...formData, grade_1_5_present: parseInt(e.target.value) || 0})}
                  fullWidth
                  helperText={`एकूण: ${selectedSchoolData?.grade_1_5_count || 0}`}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="वर्ग 6-8 उपस्थित विद्यार्थी"
                  type="number"
                  value={formData.grade_6_8_present}
                  onChange={(e) => setFormData({...formData, grade_6_8_present: parseInt(e.target.value) || 0})}
                  fullWidth
                  helperText={`एकूण: ${selectedSchoolData?.grade_6_8_count || 0}`}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="अतिरिक्त स्वयंपाकाचा खर्च (₹)"
                  type="number"
                  value={formData.cooking_cost}
                  onChange={(e) => setFormData({...formData, cooking_cost: parseFloat(e.target.value) || 0})}
                  fullWidth
                  helperText="सरकारी वाटपात समाविष्ट नसलेला खर्च"
                />
              </Grid>
              
              {/* Cost Summary Card */}
              {formData.grade_1_5_present > 0 || formData.grade_6_8_present > 0 ? (
                <Grid item xs={12}>
                  <Card sx={{ bgcolor: '#e8f5e8', border: '1px solid #4caf50' }}>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        💰 खर्चाचा तपशील (Cost Summary)
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2">
                            <strong>सरकारी वाटप:</strong><br />
                            ₹{((formData.grade_1_5_present * 2.59) + (formData.grade_6_8_present * 3.88)).toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="body2">
                            <strong>अतिरिक्त खर्च:</strong><br />
                            ₹{formData.cooking_cost.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="h6" color="primary">
                            <strong>एकूण खर्च:</strong><br />
                            ₹{(((formData.grade_1_5_present * 2.59) + (formData.grade_6_8_present * 3.88)) + formData.cooking_cost).toFixed(2)}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        * महाराष्ट्र सरकारचे अधिकृत दर: Grade 1-5 = ₹2.59/दिवस, Grade 6-8 = ₹3.88/दिवस
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ) : null}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>जेवणाची गुणवत्ता</InputLabel>
                  <Select
                    value={formData.meal_quality}
                    onChange={(e) => setFormData({...formData, meal_quality: e.target.value})}
                    label="जेवणाची गुणवत्ता"
                  >
                    <MenuItem value="EXCELLENT">उत्कृष्ट</MenuItem>
                    <MenuItem value="GOOD">चांगले</MenuItem>
                    <MenuItem value="AVERAGE">सरासरी</MenuItem>
                    <MenuItem value="POOR">खराब</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Calculated Quantities */}
            {selectedMenu > 0 && (formData.grade_1_5_present > 0 || formData.grade_6_8_present > 0) ? (
              <Box mt={3}>
                <Typography variant="h6" gutterBottom>
                  📋 {selectedMenuData?.description_marathi} - आवश्यक सामग्रीचे प्रमाण
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">
                      एकूण विद्यार्थी: {formData.grade_1_5_present + formData.grade_6_8_present}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      💰 सरकारी वाटप: ₹{((formData.grade_1_5_present * 2.59) + (formData.grade_6_8_present * 3.88)).toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      (Grade 1-5: ₹2.59 × {formData.grade_1_5_present} = ₹{(formData.grade_1_5_present * 2.59).toFixed(2)})
                      <br />
                      (Grade 6-8: ₹3.88 × {formData.grade_6_8_present} = ₹{(formData.grade_6_8_present * 3.88).toFixed(2)})
                    </Typography>
                  </Grid>
                </Grid>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>सामग्री (Item)</TableCell>
                        <TableCell>आवश्यक प्रमाण</TableCell>
                        <TableCell>एकक</TableCell>
                        <TableCell>प्रकार</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {quantities.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                              <Typography variant="caption" color="textSecondary">
                                {item.name_marathi}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight="bold" color="primary">
                              {item.total_quantity}
                            </Typography>
                          </TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>
                            <Chip 
                              label={item.category} 
                              size="small" 
                              color={item.category === 'GRAINS' ? 'primary' : 
                                     item.category === 'PROTEINS' ? 'secondary' : 
                                     item.category === 'VEGETABLES' ? 'success' : 'default'} 
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                {!selectedMenu ? 
                  "कृपया मेन्यू निवडा (Please select a menu)" : 
                  "उपस्थित विद्यार्थ्यांची संख्या प्रविष्ट करा (Enter number of students present)"
                }
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />}>
            रद्द करा (Cancel)
          </Button>
          <Button 
            onClick={handleSaveMealRecord} 
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!formData.grade_1_5_present && !formData.grade_6_8_present}
          >
            जतन करा (Save)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealRecordsPage;