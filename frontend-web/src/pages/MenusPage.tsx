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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  AddCircle as AddCircleIcon,
  RemoveCircle as RemoveCircleIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface FoodItem {
  id: number;
  name: string;
  name_marathi: string;
  category: string;
  unit: string;
  cost_per_unit: number;
}

interface MenuIngredient {
  food_item_id: number;
  food_item_name: string;
  food_item_marathi: string;
  grade_1_5_quantity: number;
  grade_6_8_quantity: number;
  unit: string;
  category: string;
  is_essential: boolean;
}

interface MenuTemplate {
  id?: number;
  template_name: string;
  description_marathi: string;
  description: string;
  active: boolean;
  ingredients: MenuIngredient[];
}

const MenusPage: React.FC = () => {
  const { user, isAdmin, isSchoolAdmin } = useAuth();
  const [menuTemplates, setMenuTemplates] = useState<MenuTemplate[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuTemplate | null>(null);
  const [openIngredientsDialog, setOpenIngredientsDialog] = useState(false);

  // Block admin access to menu management
  if (isAdmin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="info">
          <Typography variant="h6">Menu Management</Typography>
          <Typography variant="body2">
            मेन्यू व्यवस्थापन शाळा प्रशासकांसाठी आहे. सिस्टम प्रशासकांना ही गरज नाही.<br/>
            Menu management is for school administrators. System administrators don't need menu access.
          </Typography>
        </Alert>
      </Box>
    );
  }
  const [openNewIngredientDialog, setOpenNewIngredientDialog] = useState(false);
  const [newIngredientForm, setNewIngredientForm] = useState({
    name: '',
    name_marathi: '',
    category: 'GRAINS',
    unit: 'KG',
    cost_per_unit: 0
  });
  
  const [menuForm, setMenuForm] = useState<MenuTemplate>({
    template_name: '',
    description_marathi: '',
    description: '',
    active: true,
    ingredients: []
  });

  // Sample data - in real app, fetch from API
  useEffect(() => {
    // Load existing menus
    setMenuTemplates([
      {
        id: 1,
        template_name: 'व्हेजिटेबल पुलाव',
        description_marathi: 'व्हेजिटेबल पुलाव',
        description: 'Vegetable Pulav with Rice',
        active: true,
        ingredients: [
          { food_item_id: 1, food_item_name: 'Rice', food_item_marathi: 'तांदूळ', grade_1_5_quantity: 0.100, grade_6_8_quantity: 0.150, unit: 'KG', category: 'GRAINS', is_essential: true },
          { food_item_id: 2, food_item_name: 'Vegetables', food_item_marathi: 'भाज्या', grade_1_5_quantity: 0.075, grade_6_8_quantity: 0.100, unit: 'KG', category: 'VEGETABLES', is_essential: true }
        ]
      },
      {
        id: 2,
        template_name: 'डाळ खिचडी',
        description_marathi: 'डाळ खिचडी',
        description: 'Dal Khichdi',
        active: true,
        ingredients: [
          { food_item_id: 1, food_item_name: 'Rice', food_item_marathi: 'तांदूळ', grade_1_5_quantity: 0.080, grade_6_8_quantity: 0.120, unit: 'KG', category: 'GRAINS', is_essential: true },
          { food_item_id: 3, food_item_name: 'Tur Dal', food_item_marathi: 'तुरडाळ', grade_1_5_quantity: 0.030, grade_6_8_quantity: 0.040, unit: 'KG', category: 'PROTEINS', is_essential: true }
        ]
      }
    ]);

    // Load available food items
    setFoodItems([
      { id: 1, name: 'Rice (तांदूळ)', name_marathi: 'तांदूळ', category: 'GRAINS', unit: 'KG', cost_per_unit: 45.00 },
      { id: 2, name: 'Vegetables (भाज्या)', name_marathi: 'भाज्या', category: 'VEGETABLES', unit: 'KG', cost_per_unit: 30.00 },
      { id: 3, name: 'Tur Dal (तुरडाळ)', name_marathi: 'तुरडाळ', category: 'PROTEINS', unit: 'KG', cost_per_unit: 120.00 },
      { id: 4, name: 'Moong Dal (मुगडाळ)', name_marathi: 'मुगडाळ', category: 'PROTEINS', unit: 'KG', cost_per_unit: 110.00 },
      { id: 5, name: 'Cooking Oil (तेल)', name_marathi: 'तेल', category: 'OIL', unit: 'LITRE', cost_per_unit: 120.00 },
      { id: 6, name: 'Salt (मीठ)', name_marathi: 'मीठ', category: 'SPICES', unit: 'KG', cost_per_unit: 25.00 },
      { id: 7, name: 'Turmeric (हळद)', name_marathi: 'हळद', category: 'SPICES', unit: 'KG', cost_per_unit: 200.00 },
      { id: 8, name: 'Onion (कांदा)', name_marathi: 'कांदा', category: 'VEGETABLES', unit: 'KG', cost_per_unit: 25.00 },
      { id: 9, name: 'Tomato (टमाटर)', name_marathi: 'टमाटर', category: 'VEGETABLES', unit: 'KG', cost_per_unit: 35.00 },
      { id: 10, name: 'Jaggery (गूळ)', name_marathi: 'गूळ', category: 'OTHERS', unit: 'KG', cost_per_unit: 60.00 }
    ]);
  }, []);

  const handleCreateMenu = () => {
    setEditingMenu(null);
    setMenuForm({
      template_name: '',
      description_marathi: '',
      description: '',
      active: true,
      ingredients: []
    });
    setOpenDialog(true);
  };

  const handleEditMenu = (menu: MenuTemplate) => {
    setEditingMenu(menu);
    setMenuForm({ ...menu });
    setOpenDialog(true);
  };

  const handleSaveMenu = () => {
    if (editingMenu) {
      // Update existing menu
      setMenuTemplates(prev => prev.map(m => m.id === editingMenu.id ? { ...menuForm, id: editingMenu.id } : m));
    } else {
      // Create new menu
      const newMenu = { ...menuForm, id: Date.now() };
      setMenuTemplates(prev => [...prev, newMenu]);
    }
    setOpenDialog(false);
  };

  const handleDeleteMenu = (menuId: number) => {
    if (window.confirm('या मेन्यू डिलीट करायचा आहे का? (Are you sure you want to delete this menu?)')) {
      setMenuTemplates(prev => prev.filter(m => m.id !== menuId));
    }
  };

  const handleAddIngredient = () => {
    setOpenIngredientsDialog(true);
  };

  const handleSelectIngredient = (foodItem: FoodItem) => {
    const newIngredient: MenuIngredient = {
      food_item_id: foodItem.id,
      food_item_name: foodItem.name,
      food_item_marathi: foodItem.name_marathi,
      grade_1_5_quantity: 0.050, // Default quantity
      grade_6_8_quantity: 0.075, // Default quantity
      unit: foodItem.unit,
      category: foodItem.category,
      is_essential: true
    };

    setMenuForm(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }));
    setOpenIngredientsDialog(false);
  };

  const handleCreateNewIngredient = () => {
    // Create new food item
    const newFoodItem: FoodItem = {
      id: Date.now(), // In real app, this would be from backend
      name: newIngredientForm.name,
      name_marathi: newIngredientForm.name_marathi,
      category: newIngredientForm.category,
      unit: newIngredientForm.unit,
      cost_per_unit: newIngredientForm.cost_per_unit
    };

    // Add to food items list
    setFoodItems(prev => [...prev, newFoodItem]);

    // Auto-select this new ingredient for the menu
    handleSelectIngredient(newFoodItem);

    // Reset form and close dialog
    setNewIngredientForm({
      name: '',
      name_marathi: '',
      category: 'GRAINS',
      unit: 'KG',
      cost_per_unit: 0
    });
    setOpenNewIngredientDialog(false);
  };

  const handleRemoveIngredient = (index: number) => {
    setMenuForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateIngredient = (index: number, field: string, value: any) => {
    setMenuForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const calculateMenuCost = (menu: MenuTemplate, grade1_5: number = 121, grade6_8: number = 34) => {
    const foodCost = menu.ingredients.reduce((total, ingredient) => {
      const foodItem = foodItems.find(f => f.id === ingredient.food_item_id);
      if (foodItem) {
        const quantity1_5 = ingredient.grade_1_5_quantity * grade1_5;
        const quantity6_8 = ingredient.grade_6_8_quantity * grade6_8;
        const totalQuantity = quantity1_5 + quantity6_8;
        return total + (totalQuantity * foodItem.cost_per_unit);
      }
      return total;
    }, 0);

    const govAllocation = (grade1_5 * 2.59) + (grade6_8 * 3.88);
    return { foodCost, govAllocation, difference: govAllocation - foodCost };
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" display="flex" alignItems="center" gap={1}>
          <RestaurantIcon /> मेन्यू व्यवस्थापन (Menu Management)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateMenu}
          color="primary"
        >
          नवीन मेन्यू तयार करा (Create New Menu)
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Menu List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                सध्याची मेन्यू (Current Menus) - {menuTemplates.length} मेन्यू
              </Typography>
              
              {menuTemplates.map((menu) => {
                const costAnalysis = calculateMenuCost(menu);
                
                return (
                  <Accordion key={menu.id} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <Box>
                          <Typography variant="h6">
                            {menu.description_marathi}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {menu.ingredients.length} सामग्री | 
                            अंदाजे खर्च: ₹{costAnalysis.foodCost.toFixed(2)} |
                            सरकारी वाटप: ₹{costAnalysis.govAllocation.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box display="flex" gap={1}>
                          <Chip 
                            label={menu.active ? 'सक्रिय' : 'निष्क्रिय'} 
                            color={menu.active ? 'success' : 'default'}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleEditMenu(menu); }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); handleDeleteMenu(menu.id!); }}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="subtitle2" gutterBottom>
                            सामग्री आणि प्रमाण (Ingredients & Quantities):
                          </Typography>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>सामग्री</TableCell>
                                  <TableCell>Grade 1-5</TableCell>
                                  <TableCell>Grade 6-8</TableCell>
                                  <TableCell>एकक</TableCell>
                                  <TableCell>प्रकार</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {menu.ingredients.map((ingredient, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <Typography variant="body2" fontWeight="bold">
                                        {ingredient.food_item_marathi}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>{ingredient.grade_1_5_quantity}</TableCell>
                                    <TableCell>{ingredient.grade_6_8_quantity}</TableCell>
                                    <TableCell>{ingredient.unit}</TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={ingredient.category} 
                                        size="small"
                                        color={ingredient.category === 'GRAINS' ? 'primary' : 
                                               ingredient.category === 'PROTEINS' ? 'secondary' : 'default'}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="subtitle2" gutterBottom>
                            खर्च विश्लेषण (Cost Analysis):
                          </Typography>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="body2">
                                <strong>अंदाजे खर्च:</strong> ₹{costAnalysis.foodCost.toFixed(2)}
                              </Typography>
                              <Typography variant="body2">
                                <strong>सरकारी वाटप:</strong> ₹{costAnalysis.govAllocation.toFixed(2)}
                              </Typography>
                              <Typography 
                                variant="body2" 
                                color={costAnalysis.difference >= 0 ? 'success.main' : 'error.main'}
                              >
                                <strong>फरक:</strong> ₹{costAnalysis.difference.toFixed(2)}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                (155 विद्यार्थी - 121+34)
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                );
              })}

              {menuTemplates.length === 0 && (
                <Alert severity="info">
                  अजून कोणत्याही मेन्यू तयार केल्या नाहीत. नवीन मेन्यू तयार करण्यासाठी वरील बटण दाबा.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create/Edit Menu Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingMenu ? 'मेन्यू संपादित करा' : 'नवीन मेन्यू तयार करा'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="मेन्यूचे नाव (मराठी)"
                  value={menuForm.description_marathi}
                  onChange={(e) => setMenuForm({...menuForm, description_marathi: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Menu Name (English)"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({...menuForm, description: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Template Name"
                  value={menuForm.template_name}
                  onChange={(e) => setMenuForm({...menuForm, template_name: e.target.value})}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={menuForm.active}
                      onChange={(e) => setMenuForm({...menuForm, active: e.target.checked})}
                    />
                  }
                  label="सक्रिय (Active)"
                />
              </Grid>

              {/* Ingredients Section */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    सामग्री (Ingredients) - {menuForm.ingredients.length}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Button
                      variant="outlined"
                      startIcon={<AddCircleIcon />}
                      onClick={handleAddIngredient}
                    >
                      सामग्री जोडा (Add Ingredient)
                    </Button>
                    <Typography variant="caption" color="textSecondary">
                      नवीन सामग्री जोडण्यासाठी "खाद्यसामग्री (Food Items)" विभागात जा
                    </Typography>
                  </Box>
                </Box>

                {menuForm.ingredients.map((ingredient, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle2">
                            {ingredient.food_item_marathi}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {ingredient.food_item_name}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <TextField
                            label="Grade 1-5"
                            type="number"
                            value={ingredient.grade_1_5_quantity}
                            onChange={(e) => handleUpdateIngredient(index, 'grade_1_5_quantity', parseFloat(e.target.value) || 0)}
                            size="small"
                            inputProps={{ step: 0.001, min: 0 }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <TextField
                            label="Grade 6-8"
                            type="number"
                            value={ingredient.grade_6_8_quantity}
                            onChange={(e) => handleUpdateIngredient(index, 'grade_6_8_quantity', parseFloat(e.target.value) || 0)}
                            size="small"
                            inputProps={{ step: 0.001, min: 0 }}
                          />
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <Typography variant="body2">
                            {ingredient.unit}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sm={2}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={ingredient.is_essential}
                                onChange={(e) => handleUpdateIngredient(index, 'is_essential', e.target.checked)}
                                size="small"
                              />
                            }
                            label="आवश्यक"
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <IconButton
                            onClick={() => handleRemoveIngredient(index)}
                            color="error"
                            size="small"
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}

                {menuForm.ingredients.length === 0 && (
                  <Alert severity="info">
                    <Typography variant="body2">
                      कृपया सामग्री जोडा:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      • <strong>"सामग्री जोडा"</strong> - उपलब्ध सामग्रीतून निवडा<br/>
                      • नवीन सामग्री तयार करण्यासाठी <strong>"खाद्यसामग्री (Food Items)"</strong> विभागात जा
                    </Typography>
                  </Alert>
                )}
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />}>
            रद्द करा
          </Button>
          <Button 
            onClick={handleSaveMenu} 
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!menuForm.description_marathi || !menuForm.template_name || menuForm.ingredients.length === 0}
          >
            जतन करा
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Ingredients Dialog */}
      <Dialog open={openIngredientsDialog} onClose={() => setOpenIngredientsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            सामग्री निवडा (Select Ingredient)
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewIngredientDialog(true)}
              size="small"
            >
              नवीन सामग्री जोडा
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {foodItems.filter(item => !menuForm.ingredients.some(ing => ing.food_item_id === item.id)).length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              सर्व उपलब्ध सामग्री आधीच जोडली आहे. नवीन सामग्री तयार करा.
            </Alert>
          ) : (
            <List>
              {foodItems
                .filter(item => !menuForm.ingredients.some(ing => ing.food_item_id === item.id))
                .map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      button
                      onClick={() => handleSelectIngredient(item)}
                    >
                      <ListItemText
                        primary={item.name_marathi}
                        secondary={`${item.name} - ${item.category} (₹${item.cost_per_unit}/${item.unit})`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIngredientsDialog(false)}>
            रद्द करा
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Ingredient Dialog */}
      <Dialog open={openNewIngredientDialog} onClose={() => setOpenNewIngredientDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          नवीन सामग्री तयार करा (Create New Ingredient)
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="सामग्रीचे नाव (मराठी) *"
                  value={newIngredientForm.name_marathi}
                  onChange={(e) => setNewIngredientForm({...newIngredientForm, name_marathi: e.target.value})}
                  fullWidth
                  required
                  placeholder="उदा: बटाटे, कांदे, मिरची"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ingredient Name (English) *"
                  value={newIngredientForm.name}
                  onChange={(e) => setNewIngredientForm({...newIngredientForm, name: e.target.value})}
                  fullWidth
                  required
                  placeholder="e.g: Potato, Onion, Chili"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>प्रकार (Category)</InputLabel>
                  <Select
                    value={newIngredientForm.category}
                    onChange={(e) => setNewIngredientForm({...newIngredientForm, category: e.target.value})}
                    label="प्रकार (Category)"
                  >
                    <MenuItem value="GRAINS">धान्य (Grains)</MenuItem>
                    <MenuItem value="PROTEINS">प्रथिने (Proteins)</MenuItem>
                    <MenuItem value="VEGETABLES">भाज्या (Vegetables)</MenuItem>
                    <MenuItem value="FRUITS">फळे (Fruits)</MenuItem>
                    <MenuItem value="OIL">तेल (Oil)</MenuItem>
                    <MenuItem value="SPICES">मसाले (Spices)</MenuItem>
                    <MenuItem value="DAIRY">दूध पदार्थ (Dairy)</MenuItem>
                    <MenuItem value="OTHERS">इतर (Others)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>एकक (Unit)</InputLabel>
                  <Select
                    value={newIngredientForm.unit}
                    onChange={(e) => setNewIngredientForm({...newIngredientForm, unit: e.target.value})}
                    label="एकक (Unit)"
                  >
                    <MenuItem value="KG">किलोग्राम (KG)</MenuItem>
                    <MenuItem value="GRAM">ग्राम (GRAM)</MenuItem>
                    <MenuItem value="LITRE">लिटर (LITRE)</MenuItem>
                    <MenuItem value="ML">मिलीलिटर (ML)</MenuItem>
                    <MenuItem value="PIECE">नग (PIECE)</MenuItem>
                    <MenuItem value="PACKET">पॅकेट (PACKET)</MenuItem>
                    <MenuItem value="BUNDLE">बंडल (BUNDLE)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="दर प्रति एकक (Rate per Unit) ₹"
                  type="number"
                  value={newIngredientForm.cost_per_unit}
                  onChange={(e) => setNewIngredientForm({...newIngredientForm, cost_per_unit: parseFloat(e.target.value) || 0})}
                  fullWidth
                  inputProps={{ step: 0.01, min: 0 }}
                  helperText="बाजारातील सध्याचा दर प्रविष्ट करा"
                />
              </Grid>
            </Grid>

            {/* Preview of new ingredient */}
            {newIngredientForm.name_marathi && newIngredientForm.name && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2">पूर्वावलोकन (Preview):</Typography>
                <Typography variant="body2">
                  <strong>{newIngredientForm.name_marathi}</strong> ({newIngredientForm.name})
                  <br />
                  प्रकार: {newIngredientForm.category} | एकक: {newIngredientForm.unit} | दर: ₹{newIngredientForm.cost_per_unit}
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewIngredientDialog(false)}>
            रद्द करा
          </Button>
          <Button 
            onClick={handleCreateNewIngredient}
            variant="contained"
            disabled={!newIngredientForm.name_marathi || !newIngredientForm.name}
            startIcon={<SaveIcon />}
          >
            तयार करा आणि जोडा
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenusPage;