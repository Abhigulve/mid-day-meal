import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Fab,
  Tooltip
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Add as AddIcon,
  Restaurant as RestaurantIcon,
  EventBusy as HolidayIcon,
  Today as TodayIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

interface MealEvent {
  id: number;
  date: string;
  type: 'meal' | 'holiday';
  title: string;
  description?: string;
  gradeLevel: '1-5' | '6-8' | 'both';
  studentsCount: number;
  totalIngredients: {
    rice: number;
    soybean: number;
    moong_dal: number;
    tur_dal: number;
    masur_dal: number;
    matki: number;
    moong: number;
    chavli: number;
    harbhara: number;
    watana: number;
    jeera: number;
    mohari: number;
    halad: number;
    mirchi: number;
    oil: number;
    salt: number;
  };
  estimatedCost: number;
}

interface MealTemplate {
  name: string;
  name_en: string;
  class_1_5: {
    rice: number;
    soybean: number;
    moong_dal: number;
    tur_dal: number;
    masur_dal: number;
    matki: number;
    moong: number;
    chavli: number;
    harbhara: number;
    watana: number;
    jeera: number;
    mohari: number;
    halad: number;
    mirchi: number;
    oil: number;
    salt: number;
  };
  class_6_8: {
    rice: number;
    soybean: number;
    moong_dal: number;
    tur_dal: number;
    masur_dal: number;
    matki: number;
    moong: number;
    chavli: number;
    harbhara: number;
    watana: number;
    jeera: number;
    mohari: number;
    halad: number;
    mirchi: number;
    oil: number;
    salt: number;
  };
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<MealEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // September 2025 meal schedule from चव रजिस्टर Excel sheet
  const monthlyMealSchedule = [
    { date: '2025-09-01', meal: 'सुट्टी', type: 'holiday' as const },
    { date: '2025-09-02', meal: 'मोड आलेल्या मटकी उसळभात', type: 'meal' as const },
    { date: '2025-09-03', meal: 'चवळीची खिचडी', type: 'meal' as const },
    { date: '2025-09-04', meal: 'हरभरा पुलाव', type: 'meal' as const },
    { date: '2025-09-05', meal: 'सुट्टी', type: 'holiday' as const },
    { date: '2025-09-06', meal: 'सुट्टी', type: 'holiday' as const },
    { date: '2025-09-07', meal: 'सुट्टी', type: 'holiday' as const },
    { date: '2025-09-08', meal: 'मसुरी पुलाव', type: 'meal' as const },
    { date: '2025-09-09', meal: 'मुग शेवगा वरणभात', type: 'meal' as const },
    { date: '2025-09-10', meal: 'सोयाबीन पुलाव', type: 'meal' as const },
    { date: '2025-09-11', meal: 'मोड आलेल्या मटकी उसळभात', type: 'meal' as const },
    { date: '2025-09-12', meal: 'हरभरा पुलाव', type: 'meal' as const },
    { date: '2025-09-13', meal: 'मटार पुलाव', type: 'meal' as const },
    { date: '2025-09-14', meal: 'सुट्टी', type: 'holiday' as const },
    { date: '2025-09-15', meal: 'व्हेजिटेबल पुलाव', type: 'meal' as const },
    { date: '2025-09-16', meal: 'मोड आलेल्या मटकी उसळभात', type: 'meal' as const },
    { date: '2025-09-17', meal: 'चवळीची खिचडी', type: 'meal' as const },
    { date: '2025-09-18', meal: 'हरभरा पुलाव', type: 'meal' as const },
    { date: '2025-09-19', meal: 'मसालेभात', type: 'meal' as const },
    { date: '2025-09-20', meal: 'मुगडाळ खिचडी', type: 'meal' as const },
    { date: '2025-09-21', meal: 'सुट्टी', type: 'holiday' as const },
    { date: '2025-09-22', meal: 'सुट्टी', type: 'holiday' as const },
    { date: '2025-09-23', meal: 'मुग शेवगा वरणभात', type: 'meal' as const },
    { date: '2025-09-24', meal: 'सोयाबीन पुलाव', type: 'meal' as const },
    { date: '2025-09-25', meal: 'मोड आलेल्या मटकी उसळभात', type: 'meal' as const },
    { date: '2025-09-26', meal: 'हरभरा पुलाव', type: 'meal' as const },
    { date: '2025-09-27', meal: 'मटार पुलाव', type: 'meal' as const },
    { date: '2025-09-28', meal: 'सुट्टी', type: 'holiday' as const },
    { date: '2025-09-29', meal: 'व्हेजिटेबल पुलाव', type: 'meal' as const },
    { date: '2025-09-30', meal: 'मोड आलेल्या मटकी उसळभात', type: 'meal' as const }
  ];
  
  const [formData, setFormData] = useState({
    type: 'meal' as 'meal' | 'holiday',
    title: '',
    description: '',
    gradeLevel: 'both' as '1-5' | '6-8' | 'both',
    studentsCount: 0,
    selectedTemplate: '' as string,
    customIngredients: {
      rice: 0,
      soybean: 0,
      moong_dal: 0,
      tur_dal: 0,
      masur_dal: 0,
      matki: 0,
      moong: 0,
      chavli: 0,
      harbhara: 0,
      watana: 0,
      jeera: 0,
      mohari: 0,
      halad: 0,
      mirchi: 0,
      oil: 0,
      salt: 0
    }
  });
  
  const [editingEvent, setEditingEvent] = useState<MealEvent | null>(null);

  // Calculate total ingredients and cost based on students and class (using Excel data)
  const calculateMealRequirements = (template: MealTemplate, gradeLevel: '1-5' | '6-8' | 'both', studentsCount: number) => {
    const portions = gradeLevel === '1-5' ? template.class_1_5 : 
                    gradeLevel === '6-8' ? template.class_6_8 : 
                    template.class_1_5; // Default to 1-5 for 'both'

    // Calculate total ingredients needed (in grams first, then convert to kg)
    const totalIngredients = {
      rice: Math.round((portions.rice * studentsCount) / 1000 * 100) / 100, // Convert to kg with 2 decimals
      soybean: Math.round((portions.soybean * studentsCount) / 1000 * 100) / 100,
      moong_dal: Math.round((portions.moong_dal * studentsCount) / 1000 * 100) / 100,
      tur_dal: Math.round((portions.tur_dal * studentsCount) / 1000 * 100) / 100,
      masur_dal: Math.round((portions.masur_dal * studentsCount) / 1000 * 100) / 100,
      matki: Math.round((portions.matki * studentsCount) / 1000 * 100) / 100,
      moong: Math.round((portions.moong * studentsCount) / 1000 * 100) / 100,
      chavli: Math.round((portions.chavli * studentsCount) / 1000 * 100) / 100,
      harbhara: Math.round((portions.harbhara * studentsCount) / 1000 * 100) / 100,
      watana: Math.round((portions.watana * studentsCount) / 1000 * 100) / 100,
      jeera: Math.round((portions.jeera * studentsCount) / 1000 * 100) / 100,
      mohari: Math.round((portions.mohari * studentsCount) / 1000 * 100) / 100,
      halad: Math.round((portions.halad * studentsCount) / 1000 * 100) / 100,
      mirchi: Math.round((portions.mirchi * studentsCount) / 1000 * 100) / 100,
      oil: Math.round((portions.oil * studentsCount) / 1000 * 100) / 100,
      salt: Math.round((portions.salt * studentsCount) / 1000 * 100) / 100
    };

    // Use fixed cost per student from Excel (खर्च रूपये column)
    const costPerStudent = gradeLevel === '1-5' ? mealCostPerStudent['1-5'] : 
                          gradeLevel === '6-8' ? mealCostPerStudent['6-8'] : 
                          mealCostPerStudent['1-5'];
    
    const estimatedCost = Math.round(costPerStudent * studentsCount * 100) / 100; // Round to 2 decimals

    return { totalIngredients, estimatedCost };
  };

  // Complete meal templates from PIMPRI AVAGHAD Excel with all meals from चव रजिस्टर
  const mealTemplates: MealTemplate[] = [
    {
      name: 'मोड आलेल्या मटकी उसळभात',
      name_en: 'Sprouted Matki Rice',
      class_1_5: { rice: 135, soybean: 100, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 20, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0.15, mohari: 0.2, halad: 0.2, mirchi: 1.5, oil: 5, salt: 1.5 },
      class_6_8: { rice: 135, soybean: 150, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 30, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0.2, mohari: 0.3, halad: 0.3, mirchi: 2.2, oil: 7.5, salt: 2 }
    },
    {
      name: 'मुग शेवगा वरणभात',
      name_en: 'Moong Dal Sevga Rice',
      class_1_5: { rice: 24, soybean: 100, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 20, chavli: 0, harbhara: 0, watana: 0, jeera: 0.15, mohari: 0.2, halad: 0.2, mirchi: 1.5, oil: 5, salt: 1.5 },
      class_6_8: { rice: 24, soybean: 150, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 30, chavli: 0, harbhara: 0, watana: 0, jeera: 0.2, mohari: 0.3, halad: 0.3, mirchi: 2.2, oil: 7.5, salt: 2 }
    },
    {
      name: 'मसालेभात',
      name_en: 'Spiced Rice',
      class_1_5: { rice: 135, soybean: 100, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 20, watana: 0, jeera: 0.15, mohari: 0.2, halad: 0.2, mirchi: 1.5, oil: 5, salt: 1.5 },
      class_6_8: { rice: 135, soybean: 150, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 30, watana: 0, jeera: 0.2, mohari: 0.3, halad: 0.3, mirchi: 2.2, oil: 7.5, salt: 2 }
    },
    {
      name: 'मुगडाळ खिचडी',
      name_en: 'Moong Dal Khichdi',
      class_1_5: { rice: 135, soybean: 100, moong_dal: 20, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0.15, mohari: 0.2, halad: 0.2, mirchi: 1.5, oil: 5, salt: 1.5 },
      class_6_8: { rice: 135, soybean: 150, moong_dal: 30, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0.2, mohari: 0.3, halad: 0.3, mirchi: 2.2, oil: 7.5, salt: 2 }
    },
    {
      name: 'चवळीची खिचडी',
      name_en: 'Chavli Khichdi',
      class_1_5: { rice: 135, soybean: 100, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 20, harbhara: 0, watana: 0, jeera: 0.15, mohari: 0.2, halad: 0.2, mirchi: 1.5, oil: 5, salt: 1.5 },
      class_6_8: { rice: 135, soybean: 150, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 30, harbhara: 0, watana: 0, jeera: 0.2, mohari: 0.3, halad: 0.3, mirchi: 2.2, oil: 7.5, salt: 2 }
    },
    {
      name: 'हरभरा पुलाव',
      name_en: 'Harbhara Pulav',
      class_1_5: { rice: 135, soybean: 100, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 20, watana: 0, jeera: 0.15, mohari: 0.2, halad: 0.2, mirchi: 1.5, oil: 5, salt: 1.5 },
      class_6_8: { rice: 135, soybean: 150, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 30, watana: 0, jeera: 0.2, mohari: 0.3, halad: 0.3, mirchi: 2.2, oil: 7.5, salt: 2 }
    },
    {
      name: 'सोयाबीन पुलाव',
      name_en: 'Soybean Pulav',
      class_1_5: { rice: 24, soybean: 100, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0.15, mohari: 0.2, halad: 0.2, mirchi: 1.5, oil: 5, salt: 1.5 },
      class_6_8: { rice: 24, soybean: 150, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0.2, mohari: 0.3, halad: 0.3, mirchi: 2.2, oil: 7.5, salt: 2 }
    },
    {
      name: 'व्हेजिटेबल पुलाव',
      name_en: 'Vegetable Pulav',
      class_1_5: { rice: 135, soybean: 100, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 20, jeera: 0.15, mohari: 0.2, halad: 0.2, mirchi: 1.5, oil: 5, salt: 1.5 },
      class_6_8: { rice: 135, soybean: 150, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 30, jeera: 0.2, mohari: 0.3, halad: 0.3, mirchi: 2.2, oil: 7.5, salt: 2 }
    },
    {
      name: 'मटार पुलाव',
      name_en: 'Peas Pulav',
      class_1_5: { rice: 24, soybean: 100, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 20, jeera: 0.15, mohari: 0.2, halad: 0.2, mirchi: 1.5, oil: 5, salt: 1.5 },
      class_6_8: { rice: 24, soybean: 150, moong_dal: 0, tur_dal: 0, masur_dal: 0, matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 30, jeera: 0.2, mohari: 0.3, halad: 0.3, mirchi: 2.2, oil: 7.5, salt: 2 }
    },
    {
      name: 'मसुरी पुलाव',
      name_en: 'Masur Dal Pulav',
      class_1_5: { rice: 24, soybean: 100, moong_dal: 0, tur_dal: 0, masur_dal: 20, matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0.15, mohari: 0.2, halad: 0.2, mirchi: 1.5, oil: 5, salt: 1.5 },
      class_6_8: { rice: 24, soybean: 150, moong_dal: 0, tur_dal: 0, masur_dal: 30, matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0.2, mohari: 0.3, halad: 0.3, mirchi: 2.2, oil: 7.5, salt: 2 }
    }
  ];

  // Fixed cost per student from Excel (खर्च रूपये column)
  const mealCostPerStudent = {
    '1-5': 2.59,    // ₹2.59 per student for Class 1-5
    '6-8': 3.88     // ₹3.88 per student for Class 6-8
  };

  // Get calendar days for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Load monthly meal schedule on component mount (only if no data exists)
  useEffect(() => {
    loadMonthlyMealScheduleIfNeeded();
  }, []);

  const loadMonthlyMealScheduleIfNeeded = () => {
    // Check if we already have saved data in localStorage
    const savedEvents = localStorage.getItem('meal_calendar_events');
    
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(parsedEvents);
        return;
      } catch (error) {
        console.error('Error loading saved events:', error);
      }
    }

    // Start with empty calendar - no dummy data
    setEvents([]);
  };

  // Function to load Excel template schedule (available as option but not auto-loaded)
  const loadExcelTemplateSchedule = () => {
    const defaultStudentCount = 121; // From Excel: 1ते5 पट = 121
    
    const scheduleEvents: MealEvent[] = monthlyMealSchedule.map((scheduleItem, index) => {
      if (scheduleItem.type === 'holiday') {
        return {
          id: index + 1000,
          date: scheduleItem.date,
          type: 'holiday',
          title: scheduleItem.meal,
          description: 'Monthly schedule from Excel',
          gradeLevel: 'both',
          studentsCount: 0,
          totalIngredients: {
            rice: 0, soybean: 0, moong_dal: 0, tur_dal: 0, masur_dal: 0,
            matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0,
            mohari: 0, halad: 0, mirchi: 0, oil: 0, salt: 0
          },
          estimatedCost: 0
        };
      } else {
        // Find the template for this meal
        const template = mealTemplates.find(t => t.name === scheduleItem.meal);
        if (template) {
          const { totalIngredients, estimatedCost } = calculateMealRequirements(
            template, 
            '1-5', 
            defaultStudentCount
          );
          
          return {
            id: index + 1000,
            date: scheduleItem.date,
            type: 'meal',
            title: scheduleItem.meal,
            description: 'Monthly schedule from Excel',
            gradeLevel: '1-5',
            studentsCount: defaultStudentCount,
            totalIngredients,
            estimatedCost
          };
        }
        
        // Fallback for meals not in templates
        return {
          id: index + 1000,
          date: scheduleItem.date,
          type: 'meal',
          title: scheduleItem.meal,
          description: 'Monthly schedule from Excel',
          gradeLevel: '1-5',
          studentsCount: defaultStudentCount,
          totalIngredients: {
            rice: 12.1, soybean: 0, moong_dal: 0, tur_dal: 0, masur_dal: 0,
            matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0.018,
            mohari: 0.024, halad: 0.024, mirchi: 0.18, oil: 0.6, salt: 0.18
          },
          estimatedCost: defaultStudentCount * 2.59
        };
      }
    });
    
    setEvents(scheduleEvents);
    // Save to localStorage immediately
    localStorage.setItem('meal_calendar_events', JSON.stringify(scheduleEvents));
  };

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem('meal_calendar_events', JSON.stringify(events));
    }
  }, [events]);

  // Removed snackbar for clean interface

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null); // Reset editing state
    setFormData({ 
      type: 'meal', 
      title: '', 
      description: '', 
      gradeLevel: '1-5',
      studentsCount: 0,
      selectedTemplate: '',
      customIngredients: {
        rice: 0, soybean: 0, moong_dal: 0, tur_dal: 0, masur_dal: 0,
        matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0,
        mohari: 0, halad: 0, mirchi: 0, oil: 0, salt: 0
      }
    });
    setDialogOpen(true);
  };

  const handleSaveEvent = () => {
    if (!selectedDate || !formData.title || (formData.type === 'meal' && !formData.studentsCount)) return;

    const dateString = format(selectedDate, 'yyyy-MM-dd');

    if (formData.type === 'holiday') {
      const holidayEvent: MealEvent = {
        id: Date.now(),
        date: dateString,
        type: 'holiday',
        title: formData.title,
        description: formData.description,
        gradeLevel: 'both',
        studentsCount: 0,
        totalIngredients: {
          rice: 0, soybean: 0, moong_dal: 0, tur_dal: 0, masur_dal: 0,
          matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0,
          mohari: 0, halad: 0, mirchi: 0, oil: 0, salt: 0
        },
        estimatedCost: 0
      };
      
      // Replace existing event for this date or add new one
      setEvents(prev => {
        const filtered = prev.filter(event => event.date !== dateString);
        return [...filtered, holidayEvent];
      });
    } else {
      let totalIngredients, estimatedCost;

      if (formData.selectedTemplate === 'custom') {
        // Calculate for custom meal
        totalIngredients = {
          rice: Math.round((formData.customIngredients.rice * formData.studentsCount) / 1000 * 100) / 100,
          soybean: Math.round((formData.customIngredients.soybean * formData.studentsCount) / 1000 * 100) / 100,
          moong_dal: Math.round((formData.customIngredients.moong_dal * formData.studentsCount) / 1000 * 100) / 100,
          tur_dal: Math.round((formData.customIngredients.tur_dal * formData.studentsCount) / 1000 * 100) / 100,
          masur_dal: Math.round((formData.customIngredients.masur_dal * formData.studentsCount) / 1000 * 100) / 100,
          matki: Math.round((formData.customIngredients.matki * formData.studentsCount) / 1000 * 100) / 100,
          moong: Math.round((formData.customIngredients.moong * formData.studentsCount) / 1000 * 100) / 100,
          chavli: Math.round((formData.customIngredients.chavli * formData.studentsCount) / 1000 * 100) / 100,
          harbhara: Math.round((formData.customIngredients.harbhara * formData.studentsCount) / 1000 * 100) / 100,
          watana: Math.round((formData.customIngredients.watana * formData.studentsCount) / 1000 * 100) / 100,
          jeera: Math.round((formData.customIngredients.jeera * formData.studentsCount) / 1000 * 100) / 100,
          mohari: Math.round((formData.customIngredients.mohari * formData.studentsCount) / 1000 * 100) / 100,
          halad: Math.round((formData.customIngredients.halad * formData.studentsCount) / 1000 * 100) / 100,
          mirchi: Math.round((formData.customIngredients.mirchi * formData.studentsCount) / 1000 * 100) / 100,
          oil: Math.round((formData.customIngredients.oil * formData.studentsCount) / 1000 * 100) / 100,
          salt: Math.round((formData.customIngredients.salt * formData.studentsCount) / 1000 * 100) / 100
        };
        
        // Calculate cost based on ingredients
        const ingredientCosts = {
          rice: 45, soybean: 80, moong_dal: 120, tur_dal: 110, masur_dal: 130,
          matki: 90, moong: 100, chavli: 85, harbhara: 95, watana: 70, jeera: 400,
          mohari: 350, halad: 250, mirchi: 300, oil: 180, salt: 20
        };
        
        estimatedCost = Object.entries(totalIngredients).reduce((total, [ingredient, quantity]) => {
          const cost = ingredientCosts[ingredient as keyof typeof ingredientCosts] || 0;
          return total + (quantity * cost);
        }, 0);
        
      } else {
        // Find selected template
        const template = mealTemplates.find(t => t.name === formData.selectedTemplate);
        if (!template) return;

        const result = calculateMealRequirements(template, formData.gradeLevel, formData.studentsCount);
        totalIngredients = result.totalIngredients;
        estimatedCost = result.estimatedCost;
      }

      const mealEvent: MealEvent = {
        id: Date.now(),
        date: dateString,
        type: 'meal',
        title: formData.title,
        description: formData.description,
        gradeLevel: formData.gradeLevel,
        studentsCount: formData.studentsCount,
        totalIngredients,
        estimatedCost
      };

      // Replace existing event for this date or add new one
      setEvents(prev => {
        const filtered = prev.filter(event => event.date !== dateString);
        return [...filtered, mealEvent];
      });
    }
    
    setDialogOpen(false);
  };

  const applyTemplate = (template: MealTemplate) => {
    setFormData(prev => ({
      ...prev,
      title: template.name,
      selectedTemplate: template.name
    }));
  };

  const handleDeleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const handleEditEvent = (event: MealEvent) => {
    setSelectedDate(new Date(event.date));
    setEditingEvent(event);
    
    if (event.type === 'holiday') {
      setFormData({
        type: 'holiday',
        title: event.title,
        description: event.description || '',
        gradeLevel: '1-5',
        studentsCount: 0,
        selectedTemplate: '',
        customIngredients: {
          rice: 0, soybean: 0, moong_dal: 0, tur_dal: 0, masur_dal: 0,
          matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0,
          mohari: 0, halad: 0, mirchi: 0, oil: 0, salt: 0
        }
      });
    } else {
      // Find the template that matches this meal
      const template = mealTemplates.find(t => t.name === event.title);
      
      setFormData({
        type: 'meal',
        title: event.title,
        description: event.description || '',
        gradeLevel: event.gradeLevel,
        studentsCount: event.studentsCount,
        selectedTemplate: template ? template.name : 'custom',
        customIngredients: {
          rice: 0, soybean: 0, moong_dal: 0, tur_dal: 0, masur_dal: 0,
          matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0, mohari: 0, halad: 0, mirchi: 0, oil: 0, salt: 0
        }
      });
    }
    
    setDialogOpen(true);
  };

  const handleDeleteCurrentEvent = () => {
    if (editingEvent && window.confirm(`Are you sure you want to delete "${editingEvent.title}"?`)) {
      const dateString = format(selectedDate!, 'yyyy-MM-dd');
      setEvents(prev => prev.filter(event => event.date !== dateString));
      setDialogOpen(false);
      setEditingEvent(null);
    }
  };

  const getDayEvents = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
  };

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#fff' }}>
      {/* Google Calendar Style Header */}
      <Paper 
        elevation={1} 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          px: 3,
          py: 2,
          backgroundColor: '#fff'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RestaurantIcon sx={{ fontSize: 32, color: '#1976d2' }} />
              <Typography variant="h5" fontWeight={400} color="text.primary">
                Meal Calendar
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small"
                onClick={() => navigateMonth('prev')}
                sx={{ border: 1, borderColor: 'divider' }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton 
                size="small"
                onClick={() => navigateMonth('next')}
                sx={{ border: 1, borderColor: 'divider' }}
              >
                <ChevronRight />
              </IconButton>
              
              <Typography variant="h6" sx={{ mx: 2, minWidth: 200 }}>
                {format(currentDate, 'MMMM yyyy')}
              </Typography>
              
              <Button 
                size="small"
                startIcon={<TodayIcon />}
                onClick={() => setCurrentDate(new Date())}
                sx={{ textTransform: 'none' }}
              >
                Today
              </Button>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                if (window.confirm('Load September 2025 meal template from Excel? This will replace current calendar.')) {
                  loadExcelTemplateSchedule();
                }
              }}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Load Excel Template
            </Button>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedDate(new Date());
                setEditingEvent(null); // Reset editing state
                setFormData({ 
                  type: 'meal', 
                  title: '', 
                  description: '', 
                  gradeLevel: '1-5',
                  studentsCount: 0,
                  selectedTemplate: '',
                  customIngredients: {
                    rice: 0, soybean: 0, moong_dal: 0, tur_dal: 0, masur_dal: 0,
                    matki: 0, moong: 0, chavli: 0, harbhara: 0, watana: 0, jeera: 0, mohari: 0, halad: 0, mirchi: 0, oil: 0, salt: 0
                  }
                });
                setDialogOpen(true);
              }}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Add Meal
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Calendar Grid */}
      <Box sx={{ height: 'calc(100vh - 80px)', overflow: 'auto' }}>
        <Paper elevation={0} sx={{ m: 2 }}>

          {/* Weekday Headers */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#f8f9fa' }}>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <Box key={day} sx={{ p: 2, borderRight: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={500} textAlign="center">
                  {day}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Calendar Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {calendarDays.map(date => {
              const dayEvents = getDayEvents(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isDayToday = isToday(date);

              return (
                <Box
                  key={date.toISOString()}
                  sx={{
                    minHeight: 140,
                    p: 1,
                    border: 1,
                    borderColor: '#e0e0e0',
                    cursor: 'pointer',
                    backgroundColor: isDayToday ? '#e3f2fd' : isCurrentMonth ? '#fff' : '#fafafa',
                    '&:hover': { backgroundColor: isDayToday ? '#e3f2fd' : '#f5f5f5' },
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={() => handleDateClick(date)}
                >
                  <Typography
                    variant="body2"
                    color={isCurrentMonth ? 'text.primary' : 'text.disabled'}
                    fontWeight={isDayToday ? 600 : 400}
                    sx={{ mb: 1 }}
                  >
                    {format(date, 'd')}
                  </Typography>
                  
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    {dayEvents.map(event => (
                      <Box 
                        key={event.id} 
                        sx={{ 
                          mb: 0.5,
                          p: 0.5,
                          backgroundColor: event.type === 'meal' ? '#1976d2' : '#d32f2f',
                          color: 'white',
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          '&:hover': { opacity: 0.8 }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit meal instead of delete
                          handleEditEvent(event);
                        }}
                      >
                        {event.type === 'meal' ? <RestaurantIcon sx={{ fontSize: 12 }} /> : <HolidayIcon sx={{ fontSize: 12 }} />}
                        <Typography variant="caption" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {event.title}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>

      {/* Enhanced Meal Planning Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {formData.type === 'meal' ? <RestaurantIcon color="primary" /> : <HolidayIcon color="error" />}
            Add {formData.type === 'meal' ? 'Meal Plan' : 'Holiday'} - {selectedDate && format(selectedDate, 'MMM dd, yyyy')}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Event Type"
                fullWidth
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'meal' | 'holiday' })}
              >
                <MenuItem value="meal">🍽️ Meal</MenuItem>
                <MenuItem value="holiday">🏖️ Holiday</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Grade Level"
                fullWidth
                value={formData.gradeLevel}
                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value as any })}
                disabled={formData.type === 'holiday'}
              >
                <MenuItem value="1-5">Grade 1-5</MenuItem>
                <MenuItem value="6-8">Grade 6-8</MenuItem>
                <MenuItem value="both">Both (1-8)</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                label="Select Meal Template"
                fullWidth
                value={formData.selectedTemplate}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'custom') {
                    setFormData(prev => ({ ...prev, selectedTemplate: 'custom', title: '' }));
                  } else {
                    const template = mealTemplates.find(t => t.name === value);
                    if (template) {
                      applyTemplate(template);
                    }
                  }
                }}
                disabled={formData.type === 'holiday'}
              >
                <MenuItem value="custom">🍽️ Create Custom Meal</MenuItem>
                <MenuItem value="" disabled>--- Predefined Templates ---</MenuItem>
                {mealTemplates.map((template) => (
                  <MenuItem key={template.name} value={template.name}>
                    {template.name} ({template.name_en})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={formData.type === 'meal' ? 'e.g., Rice & Dal Meal' : 'e.g., Gandhi Jayanti'}
              />
            </Grid>

            {formData.type === 'meal' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Number of Students"
                    type="number"
                    fullWidth
                    value={formData.studentsCount}
                    onChange={(e) => setFormData({ ...formData, studentsCount: Number(e.target.value) })}
                    InputProps={{ inputProps: { min: 1 } }}
                    helperText="Enter total students for meal calculation"
                  />
                </Grid>

                {/* Custom Meal Ingredients */}
                {formData.selectedTemplate === 'custom' && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        🧑‍🍳 Custom Meal Ingredients (per student in grams):
                      </Typography>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="तांदूळ (Rice)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.rice}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, rice: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="सोयाबीन (Soybean)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.soybean}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, soybean: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="मूग डाळ (Moong Dal)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.moong_dal}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, moong_dal: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="तूर डाळ (Tur Dal)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.tur_dal}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, tur_dal: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="मसूर डाळ (Masur Dal)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.masur_dal}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, masur_dal: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="मटकी (Matki)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.matki}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, matki: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="मूग (Moong)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.moong}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, moong: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="चवळी (Chavli)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.chavli}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, chavli: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="हरभरा (Harbhara)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.harbhara}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, harbhara: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="तेल (Oil)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.oil}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, oil: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <TextField
                        label="मीठ (Salt)"
                        type="number"
                        fullWidth
                        value={formData.customIngredients.salt}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          customIngredients: { ...prev.customIngredients, salt: Number(e.target.value) }
                        }))}
                        InputProps={{ endAdornment: 'g' }}
                      />
                    </Grid>
                  </>
                )}

                {/* Calculation Results */}
                {((formData.selectedTemplate && formData.selectedTemplate !== 'custom') || 
                  (formData.selectedTemplate === 'custom' && Object.values(formData.customIngredients).some(val => val > 0))) && 
                  formData.studentsCount > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        📊 Automatic Calculation Results:
                      </Typography>
                    </Grid>
                    
                    {(() => {
                      let totalIngredients, estimatedCost;
                      
                      if (formData.selectedTemplate === 'custom') {
                        // Calculate for custom meal
                        totalIngredients = {
                          rice: Math.round((formData.customIngredients.rice * formData.studentsCount) / 1000 * 100) / 100,
                          soybean: Math.round((formData.customIngredients.soybean * formData.studentsCount) / 1000 * 100) / 100,
                          moong_dal: Math.round((formData.customIngredients.moong_dal * formData.studentsCount) / 1000 * 100) / 100,
                          tur_dal: Math.round((formData.customIngredients.tur_dal * formData.studentsCount) / 1000 * 100) / 100,
                          masur_dal: Math.round((formData.customIngredients.masur_dal * formData.studentsCount) / 1000 * 100) / 100,
                          matki: Math.round((formData.customIngredients.matki * formData.studentsCount) / 1000 * 100) / 100,
                          moong: Math.round((formData.customIngredients.moong * formData.studentsCount) / 1000 * 100) / 100,
                          chavli: Math.round((formData.customIngredients.chavli * formData.studentsCount) / 1000 * 100) / 100,
                          harbhara: Math.round((formData.customIngredients.harbhara * formData.studentsCount) / 1000 * 100) / 100,
          watana: Math.round((formData.customIngredients.watana * formData.studentsCount) / 1000 * 100) / 100,
          jeera: Math.round((formData.customIngredients.jeera * formData.studentsCount) / 1000 * 100) / 100,
          mohari: Math.round((formData.customIngredients.mohari * formData.studentsCount) / 1000 * 100) / 100,
          halad: Math.round((formData.customIngredients.halad * formData.studentsCount) / 1000 * 100) / 100,
          mirchi: Math.round((formData.customIngredients.mirchi * formData.studentsCount) / 1000 * 100) / 100,
          oil: Math.round((formData.customIngredients.oil * formData.studentsCount) / 1000 * 100) / 100,
          salt: Math.round((formData.customIngredients.salt * formData.studentsCount) / 1000 * 100) / 100
                        };
                        
                        // Calculate cost based on ingredients
                        const ingredientCosts = {
                          rice: 45, soybean: 80, moong_dal: 120, tur_dal: 110, masur_dal: 130,
          matki: 90, moong: 100, chavli: 85, harbhara: 95, watana: 70, jeera: 400,
          mohari: 350, halad: 250, mirchi: 300, oil: 180, salt: 20
                        };
                        
                        estimatedCost = Object.entries(totalIngredients).reduce((total, [ingredient, quantity]) => {
                          const cost = ingredientCosts[ingredient as keyof typeof ingredientCosts] || 0;
                          return total + (quantity * cost);
                        }, 0);
                        
                      } else {
                        // Calculate for template meal
                        const template = mealTemplates.find(t => t.name === formData.selectedTemplate);
                        if (!template) return null;
                        
                        const result = calculateMealRequirements(template, formData.gradeLevel, formData.studentsCount);
                        totalIngredients = result.totalIngredients;
                        estimatedCost = result.estimatedCost;
                      }

                      return (
                        <>
                          <Grid item xs={12}>
                            <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                              <Typography variant="subtitle1" gutterBottom>
                                <strong>Total Ingredients Required:</strong>
                              </Typography>
                              <Grid container spacing={2}>
                                {Object.entries(totalIngredients).map(([ingredient, quantity]) => {
                                  if (quantity > 0) {
                                    const labels: { [key: string]: string } = {
                                      rice: 'तांदूळ (Rice)',
                                      soybean: 'सोयाबीन (Soybean)',
                                      moong_dal: 'मूग डाळ (Moong Dal)',
                                      tur_dal: 'तूर डाळ (Tur Dal)',
                                      masur_dal: 'मसूर डाळ (Masur Dal)',
                                      matki: 'मटकी (Matki)',
                                      moong: 'मूग (Moong)',
                                      chavli: 'चवळी (Chavli)',
                                      harbhara: 'हरभरा (Harbhara)',
                                      oil: 'तेल (Oil)',
                                      jeera: 'जिरे (Cumin)', mohari: 'मोहरी (Mustard)', halad: 'हळद (Turmeric)', mirchi: 'मिरची (Chili)', salt: 'मीठ (Salt)'
                                    };
                                    return (
                                      <Grid item xs={6} sm={4} key={ingredient}>
                                        <Typography variant="body2">
                                          <strong>{labels[ingredient]}: {quantity} kg</strong>
                                        </Typography>
                                      </Grid>
                                    );
                                  }
                                  return null;
                                })}
                              </Grid>
                              
                              <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
                                💰 Estimated Cost: ₹{estimatedCost.toFixed(2)}
                              </Typography>
                            </Box>
                          </Grid>
                        </>
                      );
                    })()}
                  </>
                )}
              </>
            )}

            <Grid item xs={12}>
              <TextField
                label="Description/Notes"
                fullWidth
                multiline
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={formData.type === 'meal' ? 'Special instructions or notes' : 'Holiday description'}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
          <Box>
            {editingEvent && (
              <Button 
                onClick={handleDeleteCurrentEvent}
                color="error"
                variant="outlined"
                size="large"
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={() => setDialogOpen(false)} size="large">
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEvent} 
              variant="contained"
              size="large"
              disabled={!formData.title}
              sx={{ px: 4 }}
            >
              {editingEvent ? 'Update' : 'Add'} {formData.type === 'meal' ? 'Meal' : 'Holiday'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;