import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Card, Title, Paragraph, Chip, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { apiService } from '../services/ApiService';
import { colors } from '../utils/theme';

interface Menu {
  id: number;
  date: string;
  mealType: string;
  menuDescription: string;
  menuDescriptionMarathi: string;
  menuFoodItems: any[];
}

const MenuScreen = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('current');

  useEffect(() => {
    loadMenus();
  }, [selectedWeek]);

  const loadMenus = async () => {
    try {
      const response = await apiService.getCurrentWeekMenus();
      setMenus(response.data);
    } catch (error) {
      console.error('Error loading menus:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMenus();
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return colors.warning;
      case 'lunch':
        return colors.primary;
      case 'snack':
        return colors.info;
      default:
        return colors.gray;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const MenuCard = ({ menu }: { menu: Menu }) => (
    <Card style={styles.menuCard}>
      <Card.Content>
        <View style={styles.menuHeader}>
          <View>
            <Title style={styles.menuDate}>{formatDate(menu.date)}</Title>
            <Chip 
              mode="outlined" 
              style={[styles.mealTypeChip, { borderColor: getMealTypeColor(menu.mealType) }]}
              textStyle={{ color: getMealTypeColor(menu.mealType) }}
            >
              {menu.mealType}
            </Chip>
          </View>
          <MaterialIcons 
            name="restaurant-menu" 
            size={24} 
            color={getMealTypeColor(menu.mealType)} 
          />
        </View>
        
        <View style={styles.menuContent}>
          <Paragraph style={styles.menuDescription}>
            {menu.menuDescription}
          </Paragraph>
          {menu.menuDescriptionMarathi && (
            <Paragraph style={styles.menuDescriptionMarathi}>
              {menu.menuDescriptionMarathi}
            </Paragraph>
          )}
        </View>

        {menu.menuFoodItems && menu.menuFoodItems.length > 0 && (
          <View style={styles.foodItemsContainer}>
            <Text style={styles.foodItemsTitle}>Items:</Text>
            {menu.menuFoodItems.map((item, index) => (
              <Chip 
                key={index} 
                mode="outlined" 
                style={styles.foodItemChip}
                compact
              >
                {item.foodItem?.name} ({item.quantityPerStudent}g)
              </Chip>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Weekly Menu</Title>
          <Paragraph style={styles.headerSubtitle}>
            {new Date().toLocaleDateString('en-IN', {
              month: 'long',
              year: 'numeric',
            })}
          </Paragraph>
        </View>

        <View style={styles.menuList}>
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </View>

        {menus.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <MaterialIcons name="restaurant-menu" size={64} color={colors.gray} />
            <Text style={styles.emptyStateText}>No menus available</Text>
            <Text style={styles.emptyStateSubtext}>
              Menus will appear here once they are created
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          // Navigate to add menu
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
  headerSubtitle: {
    color: colors.gray,
    marginTop: 5,
  },
  menuList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  menuCard: {
    marginBottom: 15,
    elevation: 4,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  menuDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  mealTypeChip: {
    alignSelf: 'flex-start',
  },
  menuContent: {
    marginBottom: 15,
  },
  menuDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.dark,
  },
  menuDescriptionMarathi: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray,
    fontStyle: 'italic',
    marginTop: 5,
  },
  foodItemsContainer: {
    marginTop: 10,
  },
  foodItemsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 8,
  },
  foodItemChip: {
    marginRight: 8,
    marginBottom: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.gray,
    marginTop: 20,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 10,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: colors.primary,
  },
});

export default MenuScreen;