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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  DateRange as DateRangeIcon,
  PictureAsPdf as PdfIcon,
  ExpandMore as ExpandMoreIcon,
  School as SchoolIcon,
  Restaurant as RestaurantIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

interface MonthlyRecord {
  month: string;
  year: number;
  school_id: number;
  school_name: string;
  total_meal_days: number;
  total_meals_served: number;
  grade_1_5_meals: number;
  grade_6_8_meals: number;
  total_cost: number;
  government_allocation: number;
  average_attendance: number;
  popular_menus: string[];
}

interface YearlyRecord {
  year: number;
  school_id: number;
  school_name: string;
  total_months: number;
  total_meal_days: number;
  total_meals_served: number;
  total_cost: number;
  average_monthly_cost: number;
  best_attendance_month: string;
  lowest_attendance_month: string;
}

interface School {
  id: number;
  name: string;
  code: string;
  grade_1_5_count: number;
  grade_6_8_count: number;
}

const ReportsPage: React.FC = () => {
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([]);
  const [yearlyRecords, setYearlyRecords] = useState<YearlyRecord[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<number>(0);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [reportType, setReportType] = useState<string>('monthly');
  const [loading, setLoading] = useState(false);

  // Sample data - in real app, fetch from API
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

    // Sample monthly records
    setMonthlyRecords([
      {
        month: 'सप्टेंबर (September)',
        year: 2025,
        school_id: 1,
        school_name: 'जिल्हा परिषद प्राथमिक शाळा पिंप्री अवघड',
        total_meal_days: 22,
        total_meals_served: 3278,
        grade_1_5_meals: 2508,
        grade_6_8_meals: 770,
        total_cost: 12850.75,
        government_allocation: 12950.00,
        average_attendance: 95.2,
        popular_menus: ['व्हेजिटेबल पुलाव', 'डाळ खिचडी', 'भात डाळ भाजी']
      },
      {
        month: 'ऑगस्ट (August)',
        year: 2025,
        school_id: 1,
        school_name: 'जिल्हा परिषद प्राथमिक शाळा पिंप्री अवघड',
        total_meal_days: 26,
        total_meals_served: 3926,
        grade_1_5_meals: 2990,
        grade_6_8_meals: 936,
        total_cost: 15420.50,
        government_allocation: 15630.00,
        average_attendance: 97.1,
        popular_menus: ['मसाला भात', 'तांदळाची खीर', 'हरभरा पुलाव']
      }
    ]);

    // Sample yearly records
    setYearlyRecords([
      {
        year: 2025,
        school_id: 1,
        school_name: 'जिल्हा परिषद प्राथमिक शाळा पिंप्री अवघड',
        total_months: 9,
        total_meal_days: 195,
        total_meals_served: 29550,
        total_cost: 125680.25,
        average_monthly_cost: 13964.47,
        best_attendance_month: 'ऑगस्ट (97.1%)',
        lowest_attendance_month: 'जून (88.5%)'
      }
    ]);
  }, []);

  const handleGenerateReport = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleDownloadPDF = (type: string, data: any) => {
    // In real app, this would generate and download PDF
    const filename = type === 'monthly' 
      ? `Monthly_Report_${data.month}_${data.year}_${data.school_name}.pdf`
      : `Yearly_Report_${data.year}_${data.school_name}.pdf`;
    
    alert(`📄 PDF डाउनलोड सुरू केला: ${filename}\n\nNote: Real implementation would generate actual PDF file.`);
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return 'success';
    if (percentage >= 85) return 'warning';
    return 'error';
  };

  const months = [
    { value: 0, label: 'सर्व महिने (All Months)' },
    { value: 1, label: 'जानेवारी (January)' },
    { value: 2, label: 'फेब्रुवारी (February)' },
    { value: 3, label: 'मार्च (March)' },
    { value: 4, label: 'एप्रिल (April)' },
    { value: 5, label: 'मे (May)' },
    { value: 6, label: 'जून (June)' },
    { value: 7, label: 'जुलै (July)' },
    { value: 8, label: 'ऑगस्ट (August)' },
    { value: 9, label: 'सप्टेंबर (September)' },
    { value: 10, label: 'ऑक्टोबर (October)' },
    { value: 11, label: 'नोव्हेंबर (November)' },
    { value: 12, label: 'डिसेंबर (December)' }
  ];

  const filteredMonthlyRecords = monthlyRecords.filter(record => {
    const schoolMatch = selectedSchool === 0 || record.school_id === selectedSchool;
    const yearMatch = record.year === selectedYear;
    const monthMatch = selectedMonth === 0 || new Date(`${record.month} 1, ${record.year}`).getMonth() + 1 === selectedMonth;
    return schoolMatch && yearMatch && monthMatch;
  });

  const filteredYearlyRecords = yearlyRecords.filter(record => {
    const schoolMatch = selectedSchool === 0 || record.school_id === selectedSchool;
    const yearMatch = record.year === selectedYear;
    return schoolMatch && yearMatch;
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" display="flex" alignItems="center" gap={1}>
          <AssessmentIcon /> अहवाल व नोंदी (Reports & Records)
        </Typography>
        <Button
          variant="contained"
          startIcon={<DateRangeIcon />}
          onClick={handleGenerateReport}
          disabled={loading}
        >
          अहवाल तयार करा (Generate Report)
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
                  <FormControl fullWidth>
                    <InputLabel>अहवालाचा प्रकार</InputLabel>
                    <Select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      label="अहवालाचा प्रकार"
                    >
                      <MenuItem value="monthly">मासिक अहवाल (Monthly)</MenuItem>
                      <MenuItem value="yearly">वार्षिक अहवाल (Yearly)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>शाळा (School)</InputLabel>
                    <Select
                      value={selectedSchool}
                      onChange={(e) => setSelectedSchool(e.target.value as number)}
                      label="शाळा (School)"
                    >
                      <MenuItem value={0}>सर्व शाळा (All Schools)</MenuItem>
                      {schools.map(school => (
                        <MenuItem key={school.id} value={school.id}>
                          {school.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="वर्ष (Year)"
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    fullWidth
                  />
                </Grid>
                {reportType === 'monthly' && (
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                      <InputLabel>महिना (Month)</InputLabel>
                      <Select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value as number)}
                        label="महिना (Month)"
                      >
                        {months.map(month => (
                          <MenuItem key={month.value} value={month.value}>
                            {month.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
              {loading && (
                <Box mt={2}>
                  <LinearProgress />
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    अहवाल तयार करत आहे... (Generating report...)
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Reports */}
        {reportType === 'monthly' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  मासिक अहवाल (Monthly Reports) - {filteredMonthlyRecords.length} नोंदी
                </Typography>
                
                {filteredMonthlyRecords.map((record, index) => (
                  <Accordion key={index} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <Box>
                          <Typography variant="h6">
                            {record.month} {record.year} - {record.school_name}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {record.total_meal_days} दिवस | {record.total_meals_served} जेवण | 
                            ₹{record.total_cost.toLocaleString()} खर्च | 
                            {record.average_attendance}% उपस्थिती
                          </Typography>
                        </Box>
                        <Box display="flex" gap={1}>
                          <Chip 
                            label={`${record.average_attendance}%`}
                            color={getAttendanceColor(record.average_attendance) as any}
                            size="small"
                          />
                          <Button
                            startIcon={<PdfIcon />}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPDF('monthly', record);
                            }}
                          >
                            PDF
                          </Button>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            जेवणाचा तपशील (Meal Details):
                          </Typography>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableBody>
                                <TableRow>
                                  <TableCell><strong>एकूण जेवण दिवस</strong></TableCell>
                                  <TableCell>{record.total_meal_days} दिवस</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><strong>एकूण जेवण सर्व्ह केले</strong></TableCell>
                                  <TableCell>{record.total_meals_served.toLocaleString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><strong>Grade 1-5 जेवण</strong></TableCell>
                                  <TableCell>{record.grade_1_5_meals.toLocaleString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><strong>Grade 6-8 जेवण</strong></TableCell>
                                  <TableCell>{record.grade_6_8_meals.toLocaleString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><strong>सरासरी उपस्थिती</strong></TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={`${record.average_attendance}%`}
                                      color={getAttendanceColor(record.average_attendance) as any}
                                      size="small"
                                    />
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            आर्थिक तपशील (Financial Details):
                          </Typography>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableBody>
                                <TableRow>
                                  <TableCell><strong>एकूण खर्च</strong></TableCell>
                                  <TableCell>₹{record.total_cost.toLocaleString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><strong>सरकारी वाटप</strong></TableCell>
                                  <TableCell>₹{record.government_allocation.toLocaleString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><strong>शिल्लक/तूट</strong></TableCell>
                                  <TableCell>
                                    <Typography 
                                      color={record.government_allocation >= record.total_cost ? 'success.main' : 'error.main'}
                                    >
                                      ₹{Math.abs(record.government_allocation - record.total_cost).toLocaleString()}
                                      {record.government_allocation >= record.total_cost ? ' शिल्लक' : ' तूट'}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell><strong>दैनिक सरासरी खर्च</strong></TableCell>
                                  <TableCell>₹{(record.total_cost / record.total_meal_days).toFixed(2)}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>

                          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            लोकप्रिय मेन्यू (Popular Menus):
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {record.popular_menus.map((menu, idx) => (
                              <Chip key={idx} label={menu} size="small" color="primary" variant="outlined" />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}

                {filteredMonthlyRecords.length === 0 && (
                  <Alert severity="info">
                    निवडलेल्या फिल्टरनुसार कोणत्याही मासिक नोंदी सापडल्या नाहीत.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Yearly Reports */}
        {reportType === 'yearly' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  वार्षिक अहवाल (Yearly Reports) - {filteredYearlyRecords.length} नोंदी
                </Typography>
                
                {filteredYearlyRecords.map((record, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
                        <Typography variant="h6">
                          वर्ष {record.year} - {record.school_name}
                        </Typography>
                        <Button
                          startIcon={<PdfIcon />}
                          onClick={() => handleDownloadPDF('yearly', record)}
                        >
                          PDF डाउनलोड करा
                        </Button>
                      </Box>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                एकूण महिने
                              </Typography>
                              <Typography variant="h4">
                                {record.total_months}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                एकूण जेवण दिवस
                              </Typography>
                              <Typography variant="h4">
                                {record.total_meal_days}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                एकूण जेवण सर्व्ह केले
                              </Typography>
                              <Typography variant="h4">
                                {record.total_meals_served.toLocaleString()}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                एकूण खर्च
                              </Typography>
                              <Typography variant="h4" color="primary">
                                ₹{record.total_cost.toLocaleString()}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 2 }} />

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            <TrendingUpIcon fontSize="small" /> सर्वोत्तम उपस्थिती महिना:
                          </Typography>
                          <Typography variant="body1" color="success.main">
                            {record.best_attendance_month}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            कमी उपस्थिती महिना:
                          </Typography>
                          <Typography variant="body1" color="warning.main">
                            {record.lowest_attendance_month}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            सरासरी मासिक खर्च:
                          </Typography>
                          <Typography variant="body1">
                            ₹{record.average_monthly_cost.toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}

                {filteredYearlyRecords.length === 0 && (
                  <Alert severity="info">
                    निवडलेल्या फिल्टरनुसार कोणत्याही वार्षिक नोंदी सापडल्या नाहीत.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ReportsPage;