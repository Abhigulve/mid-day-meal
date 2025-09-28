import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Badge,
  Paper
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Add as AddIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Restaurant as RestaurantIcon,
  EventBusy as HolidayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface Holiday {
  id: number;
  date: string;
  name: string;
  name_marathi: string;
  type: 'NATIONAL' | 'STATE' | 'LOCAL' | 'SCHOOL';
  description?: string;
}

interface MealRecord {
  id: number;
  date: string;
  school_id: number;
  meal_prepared: boolean;
  total_students: number;
  grade_1_5_present: number;
  grade_6_8_present: number;
  menu_name: string;
  cost: number;
  status: 'PLANNED' | 'PREPARED' | 'SERVED' | 'CANCELLED';
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  holiday?: Holiday;
  mealRecord?: MealRecord;
  isWeekend: boolean;
}

const CalendarPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([]);
  const [openHolidayDialog, setOpenHolidayDialog] = useState(false);
  const [openMealDialog, setOpenMealDialog] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [editingMealRecord, setEditingMealRecord] = useState<MealRecord | null>(null);

  // Block admin access to daily calendar operations
  if (isAdmin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="info">
          <Typography variant="h6">Daily Calendar Operations</Typography>
          <Typography variant="body2">
            हे कॅलेंडर दैनंदिन शालेय कार्यासाठी आहे. सिस्टम प्रशासकांना ही गरज नाही.<br/>
            This calendar is for daily school operations. System administrators don't need daily calendar access.
          </Typography>
        </Alert>
      </Box>
    );
  }

  const [holidayForm, setHolidayForm] = useState<{
    name: string;
    name_marathi: string;
    type: 'NATIONAL' | 'STATE' | 'LOCAL' | 'SCHOOL';
    description: string;
  }>({
    name: '',
    name_marathi: '',
    type: 'LOCAL',
    description: ''
  });

  const [mealForm, setMealForm] = useState({
    school_id: 1,
    grade_1_5_present: 0,
    grade_6_8_present: 0,
    menu_name: '',
    cost: 0,
    status: 'PLANNED' as 'PLANNED' | 'PREPARED' | 'SERVED' | 'CANCELLED',
    remarks: ''
  });

  const menuTemplates = [
    'व्हेजिटेबल पुलाव',
    'डाळ खिचडी', 
    'भात डाळ भाजी',
    'तांदळाची खीर',
    'मसाला भात',
    'हरभरा पुलाव',
    'मुगडाळ खिचडी',
    'बाजरी भाकरी डाळ'
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    // Load holidays from localStorage or use defaults
    const savedHolidays = localStorage.getItem('middaymeal_holidays');
    const defaultHolidays: Holiday[] = [
      {
        id: 1,
        date: '2025-01-26',
        name: 'Republic Day',
        name_marathi: 'प्रजासत्ताक दिन',
        type: 'NATIONAL' as const,
        description: 'National Holiday - Schools Closed'
      },
      {
        id: 2,
        date: '2025-08-15',
        name: 'Independence Day',
        name_marathi: 'स्वातंत्र्य दिन',
        type: 'NATIONAL' as const,
        description: 'National Holiday - Schools Closed'
      },
      {
        id: 3,
        date: '2025-09-19',
        name: 'Ganesh Chaturthi',
        name_marathi: 'गणेश चतुर्थी',
        type: 'STATE' as const,
        description: 'Maharashtra State Holiday'
      },
      {
        id: 4,
        date: '2025-10-02',
        name: 'Gandhi Jayanti',
        name_marathi: 'गांधी जयंती',
        type: 'NATIONAL' as const,
        description: 'National Holiday - Schools Closed'
      }
    ];

    if (savedHolidays) {
      setHolidays(JSON.parse(savedHolidays));
    } else {
      setHolidays(defaultHolidays);
      localStorage.setItem('middaymeal_holidays', JSON.stringify(defaultHolidays));
    }

    // Load meal records from localStorage or use defaults
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    const defaultMealRecords: MealRecord[] = [
      {
        id: 1,
        date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-27`,
        school_id: 1,
        meal_prepared: true,
        total_students: 149,
        grade_1_5_present: 115,
        grade_6_8_present: 34,
        menu_name: 'व्हेजिटेबल पुलाव',
        cost: 585.25,
        status: 'SERVED' as const
      },
      {
        id: 2,
        date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-26`,
        school_id: 1,
        meal_prepared: true,
        total_students: 145,
        grade_1_5_present: 112,
        grade_6_8_present: 33,
        menu_name: 'डाळ खिचडी',
        cost: 567.80,
        status: 'SERVED' as const
      },
      {
        id: 3,
        date: `${currentYear}-${currentMonth.toString().padStart(2, '0')}-25`,
        school_id: 1,
        meal_prepared: true,
        total_students: 140,
        grade_1_5_present: 110,
        grade_6_8_present: 30,
        menu_name: 'भात डाळ भाजी',
        cost: 520.30,
        status: 'SERVED' as const
      }
    ];

    const savedMealRecords = localStorage.getItem('middaymeal_records');
    if (savedMealRecords) {
      setMealRecords(JSON.parse(savedMealRecords));
    } else {
      setMealRecords(defaultMealRecords);
      localStorage.setItem('middaymeal_records', JSON.stringify(defaultMealRecords));
    }
  }, []);

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayOfCalendar = new Date(firstDayOfMonth);
    firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfCalendar.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(firstDayOfCalendar);
      date.setDate(firstDayOfCalendar.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const holiday = holidays.find(h => h.date === dateStr);
      const mealRecord = mealRecords.find(r => r.date === dateStr);
      
      days.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === today.toDateString(),
        isHoliday: !!holiday,
        holiday,
        mealRecord,
        isWeekend: date.getDay() === 0
      });
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    if (day.isHoliday) {
      // Show holiday details - could add holiday details dialog later
      return;
    }
    // Always allow meal record creation/editing for any date
  };

  const handleAddMealRecord = () => {
    if (!selectedDate) return;
    
    setEditingMealRecord(null);
    setMealForm({
      school_id: 1,
      grade_1_5_present: 0,
      grade_6_8_present: 0,
      menu_name: '',
      cost: 0,
      status: 'PLANNED',
      remarks: ''
    });
    setOpenMealDialog(true);
  };

  const handleEditMealRecord = (record: MealRecord) => {
    setEditingMealRecord(record);
    setMealForm({
      school_id: record.school_id,
      grade_1_5_present: record.grade_1_5_present,
      grade_6_8_present: record.grade_6_8_present,
      menu_name: record.menu_name,
      cost: record.cost,
      status: record.status,
      remarks: ''
    });
    setOpenMealDialog(true);
  };

  const handleAddHoliday = () => {
    setEditingHoliday(null);
    setHolidayForm({
      name: '',
      name_marathi: '',
      type: 'LOCAL',
      description: ''
    });
    setOpenHolidayDialog(true);
  };

  const handleSaveHoliday = () => {
    if (!selectedDate) return;
    
    const newHoliday: Holiday = {
      id: Date.now(),
      date: selectedDate.toISOString().split('T')[0],
      name: holidayForm.name,
      name_marathi: holidayForm.name_marathi,
      type: holidayForm.type,
      description: holidayForm.description
    };

    let updatedHolidays;
    if (editingHoliday) {
      updatedHolidays = holidays.map(h => h.id === editingHoliday.id ? { ...newHoliday, id: editingHoliday.id } : h);
    } else {
      updatedHolidays = [...holidays, newHoliday];
    }
    
    setHolidays(updatedHolidays);
    localStorage.setItem('middaymeal_holidays', JSON.stringify(updatedHolidays));
    
    setOpenHolidayDialog(false);
    setSelectedDate(null);
  };

  const handleDeleteHoliday = (holidayId: number) => {
    const holidayToDelete = holidays.find(h => h.id === holidayId);
    if (!holidayToDelete) return;

    const confirmMessage = `या सुट्टी डिलीट करायची आहे का?\n\nसुट्टी: ${holidayToDelete.name_marathi} (${holidayToDelete.name})\nतारीख: ${new Date(holidayToDelete.date).toLocaleDateString('mr-IN')}\nप्रकार: ${holidayToDelete.type}\n\nAre you sure you want to delete this holiday?`;
    
    if (window.confirm(confirmMessage)) {
      const updatedHolidays = holidays.filter(h => h.id !== holidayId);
      setHolidays(updatedHolidays);
      localStorage.setItem('middaymeal_holidays', JSON.stringify(updatedHolidays));
      console.log(`Deleted holiday: ${holidayToDelete.name_marathi} on ${holidayToDelete.date}`);
      
      // Show success message (optional)
      alert(`सुट्टी यशस्वीरित्या डिलीट केली!\nHoliday "${holidayToDelete.name_marathi}" successfully deleted!`);
    }
  };

  const handleSaveMealRecord = () => {
    if (!selectedDate) return;

    const totalStudents = mealForm.grade_1_5_present + mealForm.grade_6_8_present;
    const calculatedCost = mealForm.cost || (mealForm.grade_1_5_present * 2.59 + mealForm.grade_6_8_present * 3.88);

    const newRecord: MealRecord = {
      id: editingMealRecord?.id || Date.now(),
      date: selectedDate.toISOString().split('T')[0],
      school_id: mealForm.school_id,
      meal_prepared: mealForm.status !== 'CANCELLED',
      total_students: totalStudents,
      grade_1_5_present: mealForm.grade_1_5_present,
      grade_6_8_present: mealForm.grade_6_8_present,
      menu_name: mealForm.menu_name,
      cost: calculatedCost,
      status: mealForm.status
    };

    let updatedMealRecords;
    if (editingMealRecord) {
      updatedMealRecords = mealRecords.map(r => r.id === editingMealRecord.id ? newRecord : r);
      console.log('Updated meal record:', newRecord);
    } else {
      updatedMealRecords = [...mealRecords, newRecord];
      console.log('Added new meal record:', newRecord);
    }
    
    setMealRecords(updatedMealRecords);
    localStorage.setItem('middaymeal_records', JSON.stringify(updatedMealRecords));
    console.log('Saved to localStorage. All meal records:', updatedMealRecords);

    setOpenMealDialog(false);
    // Don't clear selectedDate immediately so user can see the result
    setTimeout(() => setSelectedDate(null), 1000);
  };

  const handleDeleteMealRecord = (recordId: number) => {
    if (window.confirm('या जेवण नोंद डिलीट करायची आहे का? (Are you sure you want to delete this meal record?)')) {
      const updatedMealRecords = mealRecords.filter(r => r.id !== recordId);
      setMealRecords(updatedMealRecords);
      localStorage.setItem('middaymeal_records', JSON.stringify(updatedMealRecords));
      console.log('Deleted meal record. Remaining records:', updatedMealRecords);
    }
  };

  const getHolidayTypeColor = (type: string) => {
    switch (type) {
      case 'NATIONAL': return 'error';
      case 'STATE': return 'warning';
      case 'LOCAL': return 'info';
      case 'SCHOOL': return 'secondary';
      default: return 'default';
    }
  };

  const getMealStatusColor = (status: string) => {
    switch (status) {
      case 'SERVED': return 'success';
      case 'PREPARED': return 'warning';
      case 'PLANNED': return 'info';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const monthNames = [
    'जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून',
    'जुलै', 'ऑगस्ट', 'सप्टेंबर', 'ऑक्टोबर', 'नोव्हेंबर', 'डिसेंबर'
  ];

  const dayNames = ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  const calendarDays = generateCalendarDays();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" display="flex" alignItems="center" gap={1}>
          <CalendarIcon /> कॅलेंडर व्यू (Calendar View)
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<HolidayIcon />}
            onClick={handleAddHoliday}
            disabled={!selectedDate}
          >
            सुट्टी जोडा (Add Holiday)
          </Button>
          <Button
            variant="contained"
            startIcon={<RestaurantIcon />}
            onClick={handleAddMealRecord}
            disabled={!selectedDate}
          >
            जेवण नोंद जोडा (Add Meal Record)
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<EventIcon />}
            onClick={() => setSelectedDate(new Date())}
          >
            आजची तारीख (Today)
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Calendar Navigation */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Button onClick={handlePrevMonth}>‹ मागील महिना</Button>
                <Typography variant="h5">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Typography>
                <Button onClick={handleNextMonth}>पुढील महिना ›</Button>
              </Box>

              {/* Legend */}
              <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box width={16} height={16} bgcolor="error.main" borderRadius={1} />
                  <Typography variant="caption">राष्ट्रीय सुट्टी</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box width={16} height={16} bgcolor="warning.main" borderRadius={1} />
                  <Typography variant="caption">राज्य सुट्टी</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box width={16} height={16} bgcolor="success.main" borderRadius={1} />
                  <Typography variant="caption">जेवण सर्व्ह केले</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box width={16} height={16} bgcolor="grey.300" borderRadius={1} />
                  <Typography variant="caption">रविवार (शाळा बंद)</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box width={16} height={16} bgcolor="primary.light" borderRadius={1} />
                  <Typography variant="caption">शनिवार (शालेय दिवस)</Typography>
                </Box>
              </Box>

              {/* Calendar Grid */}
              <Grid container spacing={0}>
                {/* Day Headers */}
                {dayNames.map((day, index) => (
                  <Grid item xs={12/7} key={index}>
                    <Box
                      p={1}
                      textAlign="center"
                      bgcolor="grey.100"
                      borderRight="1px solid #ddd"
                      borderBottom="1px solid #ddd"
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {day}
                      </Typography>
                    </Box>
                  </Grid>
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day, index) => (
                  <Grid item xs={12/7} key={index}>
                    <Paper
                      sx={{
                        minHeight: 100,
                        p: 1,
                        cursor: 'pointer',
                        border: '1px solid #ddd',
                        borderRadius: 0,
                        bgcolor: day.isCurrentMonth ? 'white' : 'grey.50',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        },
                        ...(day.isToday && {
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText'
                        }),
                        ...(selectedDate && day.date.toDateString() === selectedDate.toDateString() && {
                          bgcolor: 'secondary.light',
                          border: '2px solid',
                          borderColor: 'secondary.main'
                        })
                      }}
                      onClick={() => handleDateClick(day)}
                    >
                      {/* Date Number */}
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography
                          variant="body2"
                          fontWeight={day.isToday ? 'bold' : 'normal'}
                        >
                          {day.date.getDate()}
                        </Typography>
                        {day.isWeekend && (
                          <Chip label="रविवार" size="small" color="default" />
                        )}
                      </Box>

                      {/* Holiday Indicator */}
                      {day.isHoliday && day.holiday && (
                        <Box mb={1}>
                          <Box 
                            sx={{ 
                              position: 'relative',
                              '&:hover .holiday-actions': { 
                                opacity: 1 
                              }
                            }}
                          >
                            <Chip
                              label={day.holiday.name_marathi}
                              size="small"
                              color={getHolidayTypeColor(day.holiday.type) as any}
                              icon={<HolidayIcon />}
                              sx={{ width: '100%', mb: 0.5 }}
                            />
                            <Box 
                              className="holiday-actions"
                              sx={{ 
                                opacity: 0.7,
                                display: 'flex', 
                                justifyContent: 'center',
                                gap: 0.5,
                                transition: 'opacity 0.2s'
                              }}
                            >
                              <Tooltip title="संपादित करा (Edit)">
                                <IconButton
                                  size="small"
                                  sx={{ 
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    width: 20,
                                    height: 20
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingHoliday(day.holiday!);
                                    setHolidayForm({
                                      name: day.holiday!.name,
                                      name_marathi: day.holiday!.name_marathi,
                                      type: day.holiday!.type,
                                      description: day.holiday!.description || ''
                                    });
                                    setSelectedDate(day.date);
                                    setOpenHolidayDialog(true);
                                  }}
                                >
                                  <EditIcon sx={{ fontSize: 12 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="डिलीट करा (Delete)">
                                <IconButton
                                  size="small"
                                  sx={{ 
                                    bgcolor: 'error.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'error.dark' },
                                    width: 20,
                                    height: 20
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteHoliday(day.holiday!.id);
                                  }}
                                >
                                  <DeleteIcon sx={{ fontSize: 12 }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      )}

                      {/* Meal Record Indicator */}
                      {day.mealRecord && !day.isHoliday && (
                        <Box>
                          <Chip
                            label={`${day.mealRecord.total_students} विद्यार्थी`}
                            size="small"
                            color={getMealStatusColor(day.mealRecord.status) as any}
                            icon={<RestaurantIcon />}
                          />
                          <Typography variant="caption" display="block" mt={0.5}>
                            {day.mealRecord.menu_name}
                          </Typography>
                          <Typography variant="caption" display="block">
                            ₹{day.mealRecord.cost.toFixed(2)}
                          </Typography>
                          <Box display="flex" justifyContent="flex-end" mt={0.5}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDate(day.date);
                                handleEditMealRecord(day.mealRecord!);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMealRecord(day.mealRecord!.id);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      )}

                      {/* School day indicators */}
                      {!day.mealRecord && !day.isHoliday && !day.isWeekend && day.date.getDay() !== 6 && day.isCurrentMonth && (
                        <Box mt={1}>
                          <Alert severity="info" sx={{ p: 0.5 }}>
                            <Typography variant="caption">
                              शालेय दिवस - जेवण नोंदवले नाही
                            </Typography>
                          </Alert>
                        </Box>
                      )}

                      {/* Sunday indicator - no meals needed */}
                      {day.isWeekend && !day.isHoliday && day.isCurrentMonth && (
                        <Box mt={1}>
                          <Alert severity="info" sx={{ p: 0.5, bgcolor: 'grey.100' }}>
                            <Typography variant="caption">
                              रविवार - शाळा बंद
                            </Typography>
                          </Alert>
                        </Box>
                      )}

                      {/* Saturday handling based on school configuration */}
                      {day.date.getDay() === 6 && !day.mealRecord && !day.isHoliday && day.isCurrentMonth && (
                        <Box mt={1}>
                          <Alert severity="info" sx={{ p: 0.5 }}>
                            <Typography variant="caption">
                              शनिवार - जेवण नोंदवले नाही
                            </Typography>
                          </Alert>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Selected Date Info */}
        {selectedDate && (
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="body2">
                निवडलेली तारीख: {selectedDate.toLocaleDateString('mr-IN')} | 
                सुट्टी जोडण्यासाठी "सुट्टी जोडा" किंवा जेवण नोंद जोडण्यासाठी "जेवण नोंद जोडा" बटण दाबा
              </Typography>
            </Alert>
          </Grid>
        )}
      </Grid>

      {/* Add/Edit Holiday Dialog */}
      <Dialog open={openHolidayDialog} onClose={() => setOpenHolidayDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingHoliday ? 'सुट्टी संपादित करा' : 'नवीन सुट्टी जोडा'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="सुट्टीचे नाव (मराठी) *"
                  value={holidayForm.name_marathi}
                  onChange={(e) => setHolidayForm({...holidayForm, name_marathi: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Holiday Name (English) *"
                  value={holidayForm.name}
                  onChange={(e) => setHolidayForm({...holidayForm, name: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TextField
                  label="तपशील (Description)"
                  value={holidayForm.description}
                  onChange={(e) => setHolidayForm({...holidayForm, description: e.target.value})}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              {selectedDate && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    तारीख: {selectedDate.toLocaleDateString('mr-IN')}
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHolidayDialog(false)} startIcon={<CancelIcon />}>
            रद्द करा
          </Button>
          <Button 
            onClick={handleSaveHoliday}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!holidayForm.name_marathi || !holidayForm.name}
          >
            {editingHoliday ? 'अपडेट करा' : 'जतन करा'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Meal Record Dialog */}
      <Dialog open={openMealDialog} onClose={() => setOpenMealDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMealRecord ? 'जेवण नोंद संपादित करा' : 'नवीन जेवण नोंद जोडा'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="वर्ग 1-5 उपस्थित विद्यार्थी *"
                  type="number"
                  value={mealForm.grade_1_5_present}
                  onChange={(e) => setMealForm({...mealForm, grade_1_5_present: parseInt(e.target.value) || 0})}
                  fullWidth
                  required
                  helperText="एकूण शक्य: 121 विद्यार्थी"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="वर्ग 6-8 उपस्थित विद्यार्थी *"
                  type="number"
                  value={mealForm.grade_6_8_present}
                  onChange={(e) => setMealForm({...mealForm, grade_6_8_present: parseInt(e.target.value) || 0})}
                  fullWidth
                  required
                  helperText="एकूण शक्य: 34 विद्यार्थी"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>मेन्यू निवडा *</InputLabel>
                  <Select
                    value={mealForm.menu_name}
                    onChange={(e) => setMealForm({...mealForm, menu_name: e.target.value})}
                    label="मेन्यू निवडा *"
                    required
                  >
                    {menuTemplates.map((menu, index) => (
                      <MenuItem key={index} value={menu}>
                        {menu}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>स्थिती (Status)</InputLabel>
                  <Select
                    value={mealForm.status}
                    onChange={(e) => setMealForm({...mealForm, status: e.target.value as any})}
                    label="स्थिती (Status)"
                  >
                    <MenuItem value="PLANNED">नियोजित (Planned)</MenuItem>
                    <MenuItem value="PREPARED">तयार (Prepared)</MenuItem>
                    <MenuItem value="SERVED">सर्व्ह केले (Served)</MenuItem>
                    <MenuItem value="CANCELLED">रद्द (Cancelled)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="एकूण खर्च (₹)"
                  type="number"
                  value={mealForm.cost}
                  onChange={(e) => setMealForm({...mealForm, cost: parseFloat(e.target.value) || 0})}
                  fullWidth
                  helperText="रिकामे ठेवल्यास सरकारी दरानुसार गणना होईल"
                  inputProps={{ step: 0.01, min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="टिप्पणी (Remarks)"
                  value={mealForm.remarks}
                  onChange={(e) => setMealForm({...mealForm, remarks: e.target.value})}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              
              {/* Cost Calculation Display */}
              {(mealForm.grade_1_5_present > 0 || mealForm.grade_6_8_present > 0) && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>स्वयंचलित गणना (Auto Calculation):</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      • Grade 1-5: {mealForm.grade_1_5_present} × ₹2.59 = ₹{(mealForm.grade_1_5_present * 2.59).toFixed(2)}<br/>
                      • Grade 6-8: {mealForm.grade_6_8_present} × ₹3.88 = ₹{(mealForm.grade_6_8_present * 3.88).toFixed(2)}<br/>
                      • <strong>एकूण सरकारी वाटप: ₹{(mealForm.grade_1_5_present * 2.59 + mealForm.grade_6_8_present * 3.88).toFixed(2)}</strong><br/>
                      • <strong>एकूण विद्यार्थी: {mealForm.grade_1_5_present + mealForm.grade_6_8_present}</strong>
                    </Typography>
                  </Alert>
                </Grid>
              )}

              {selectedDate && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    <Typography variant="body2">
                      📅 तारीख: {selectedDate.toLocaleDateString('mr-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMealDialog(false)} startIcon={<CancelIcon />}>
            रद्द करा (Cancel)
          </Button>
          <Button 
            onClick={handleSaveMealRecord}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!mealForm.menu_name || (!mealForm.grade_1_5_present && !mealForm.grade_6_8_present)}
          >
            {editingMealRecord ? 'अपडेट करा (Update)' : 'जतन करा (Save)'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;