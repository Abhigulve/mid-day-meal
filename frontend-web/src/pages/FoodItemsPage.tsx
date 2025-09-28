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
  Kitchen as KitchenIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface FoodItem {
  id: number;
  name: string;
  name_marathi: string;
  category: string;
  unit: string;
  cost_per_unit: number;
  active: boolean;
}

const FoodItemsPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Block admin access to food items management
  if (isAdmin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Alert severity="info">
          <Typography variant="h6">Food Items Management</Typography>
          <Typography variant="body2">
            खाद्यसामग्री व्यवस्थापन शाळा प्रशासकांसाठी आहे. सिस्टम प्रशासकांना ही गरज नाही.<br/>
            Food items management is for school administrators. System administrators don't need this access.
          </Typography>
        </Alert>
      </Box>
    );
  }
  
  const [itemForm, setItemForm] = useState<FoodItem>({
    id: 0,
    name: '',
    name_marathi: '',
    category: 'GRAINS',
    unit: 'KG',
    cost_per_unit: 0,
    active: true
  });

  useEffect(() => {
    // Load food items - in real app, fetch from API
    setFoodItems([
      { id: 1, name: 'Rice (तांदूळ)', name_marathi: 'तांदूळ', category: 'GRAINS', unit: 'KG', cost_per_unit: 45.00, active: true },
      { id: 2, name: 'Vegetables (भाज्या)', name_marathi: 'भाज्या', category: 'VEGETABLES', unit: 'KG', cost_per_unit: 30.00, active: true },
      { id: 3, name: 'Tur Dal (तुरडाळ)', name_marathi: 'तुरडाळ', category: 'PROTEINS', unit: 'KG', cost_per_unit: 120.00, active: true },
      { id: 4, name: 'Moong Dal (मुगडाळ)', name_marathi: 'मुगडाळ', category: 'PROTEINS', unit: 'KG', cost_per_unit: 110.00, active: true },
      { id: 5, name: 'Cooking Oil (तेल)', name_marathi: 'तेल', category: 'OIL', unit: 'LITRE', cost_per_unit: 120.00, active: true },
      { id: 6, name: 'Salt (मीठ)', name_marathi: 'मीठ', category: 'SPICES', unit: 'KG', cost_per_unit: 25.00, active: true },
      { id: 7, name: 'Turmeric (हळद)', name_marathi: 'हळद', category: 'SPICES', unit: 'KG', cost_per_unit: 200.00, active: true },
      { id: 8, name: 'Onion (कांदा)', name_marathi: 'कांदा', category: 'VEGETABLES', unit: 'KG', cost_per_unit: 25.00, active: true },
      { id: 9, name: 'Tomato (टमाटर)', name_marathi: 'टमाटर', category: 'VEGETABLES', unit: 'KG', cost_per_unit: 35.00, active: true },
      { id: 10, name: 'Jaggery (गूळ)', name_marathi: 'गूळ', category: 'OTHERS', unit: 'KG', cost_per_unit: 60.00, active: true }
    ]);
  }, []);

  const handleCreateItem = () => {
    setEditingItem(null);
    setItemForm({
      id: 0,
      name: '',
      name_marathi: '',
      category: 'GRAINS',
      unit: 'KG',
      cost_per_unit: 0,
      active: true
    });
    setOpenDialog(true);
  };

  const handleEditItem = (item: FoodItem) => {
    setEditingItem(item);
    setItemForm({ ...item });
    setOpenDialog(true);
  };

  const handleSaveItem = () => {
    if (editingItem) {
      // Update existing item
      setFoodItems(prev => prev.map(item => item.id === editingItem.id ? itemForm : item));
    } else {
      // Create new item
      const newItem = { ...itemForm, id: Date.now() };
      setFoodItems(prev => [...prev, newItem]);
    }
    setOpenDialog(false);
  };

  const handleDeleteItem = (itemId: number) => {
    if (window.confirm('या सामग्री डिलीट करायची आहे का? (Are you sure you want to delete this item?)')) {
      setFoodItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleToggleActive = (itemId: number) => {
    setFoodItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, active: !item.active } : item
    ));
  };

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name_marathi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GRAINS': return 'primary';
      case 'PROTEINS': return 'secondary';
      case 'VEGETABLES': return 'success';
      case 'FRUITS': return 'warning';
      case 'OIL': return 'info';
      case 'SPICES': return 'error';
      case 'DAIRY': return 'default';
      default: return 'default';
    }
  };

  const categories = ['ALL', 'GRAINS', 'PROTEINS', 'VEGETABLES', 'FRUITS', 'OIL', 'SPICES', 'DAIRY', 'OTHERS'];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" display="flex" alignItems="center" gap={1}>
          <KitchenIcon /> खाद्य सामग्री व्यवस्थापन (Food Items Management)
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateItem}
          color="primary"
        >
          नवीन सामग्री जोडा (Add New Item)
        </Button>
      </Box>

      <Grid container spacing={3}>
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
                    placeholder="सामग्रीचे नाव शोधा..."
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>प्रकार (Category)</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      label="प्रकार (Category)"
                    >
                      <MenuItem value="ALL">सर्व प्रकार</MenuItem>
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
                <Grid item xs={12} sm={2}>
                  <Typography variant="body2" color="textSecondary">
                    एकूण: {filteredItems.length} सामग्री
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Food Items Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                खाद्य सामग्री यादी (Food Items List)
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>सामग्री (Item)</TableCell>
                      <TableCell>प्रकार (Category)</TableCell>
                      <TableCell>एकक (Unit)</TableCell>
                      <TableCell>दर (Rate/Unit)</TableCell>
                      <TableCell>स्थिती (Status)</TableCell>
                      <TableCell>क्रिया (Actions)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {item.name_marathi}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {item.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.category} 
                            color={getCategoryColor(item.category) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>₹{item.cost_per_unit.toFixed(2)}</TableCell>
                        <TableCell>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={item.active}
                                onChange={() => handleToggleActive(item.id)}
                                size="small"
                              />
                            }
                            label={item.active ? 'सक्रिय' : 'निष्क्रिय'}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEditItem(item)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteItem(item.id)}
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

              {filteredItems.length === 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {searchTerm || categoryFilter !== 'ALL' 
                    ? 'या फिल्टरनुसार कोणत्याही सामग्री सापडल्या नाहीत.' 
                    : 'अजून कोणत्याही सामग्री जोडल्या नाहीत. नवीन सामग्री जोडण्यासाठी वरील बटण दाबा.'
                  }
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create/Edit Food Item Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'सामग्री संपादित करा' : 'नवीन सामग्री जोडा'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="सामग्रीचे नाव (मराठी) *"
                  value={itemForm.name_marathi}
                  onChange={(e) => setItemForm({...itemForm, name_marathi: e.target.value})}
                  fullWidth
                  required
                  placeholder="उदा: बटाटे, कांदे, मिरची"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ingredient Name (English) *"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({...itemForm, name: e.target.value})}
                  fullWidth
                  required
                  placeholder="e.g: Potato, Onion, Chili"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>प्रकार (Category)</InputLabel>
                  <Select
                    value={itemForm.category}
                    onChange={(e) => setItemForm({...itemForm, category: e.target.value})}
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
                    value={itemForm.unit}
                    onChange={(e) => setItemForm({...itemForm, unit: e.target.value})}
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="दर प्रति एकक (Rate per Unit) ₹"
                  type="number"
                  value={itemForm.cost_per_unit}
                  onChange={(e) => setItemForm({...itemForm, cost_per_unit: parseFloat(e.target.value) || 0})}
                  fullWidth
                  inputProps={{ step: 0.01, min: 0 }}
                  helperText="बाजारातील सध्याचा दर"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={itemForm.active}
                      onChange={(e) => setItemForm({...itemForm, active: e.target.checked})}
                    />
                  }
                  label="सक्रिय (Active)"
                />
              </Grid>
            </Grid>

            {/* Preview */}
            {itemForm.name_marathi && itemForm.name && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2">पूर्वावलोकन (Preview):</Typography>
                <Typography variant="body2">
                  <strong>{itemForm.name_marathi}</strong> ({itemForm.name})
                  <br />
                  प्रकार: {itemForm.category} | एकक: {itemForm.unit} | दर: ₹{itemForm.cost_per_unit}
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />}>
            रद्द करा
          </Button>
          <Button 
            onClick={handleSaveItem} 
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!itemForm.name_marathi || !itemForm.name}
          >
            {editingItem ? 'अपडेट करा' : 'जोडा'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FoodItemsPage;