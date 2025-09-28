import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '../services/AuthContext';
import { apiService } from '../services/ApiService';
import { colors } from '../utils/theme';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalSchools: number;
  todayMeals: number;
  weeklyMeals: number;
  monthlyMeals: number;
}

const DashboardScreen = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSchools: 0,
    todayMeals: 0,
    weeklyMeals: 0,
    monthlyMeals: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load dashboard statistics
      // This would be implemented with actual API calls
      setStats({
        totalSchools: 25,
        todayMeals: 1250,
        weeklyMeals: 8750,
        monthlyMeals: 37500,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color 
  }: { 
    title: string; 
    value: number; 
    icon: keyof typeof MaterialIcons.glyphMap; 
    color: string;
  }) => (
    <Card style={[styles.statCard, { width: (width - 60) / 2 }]}>
      <Card.Content style={styles.statContent}>
        <View style={styles.statHeader}>
          <MaterialIcons name={icon} size={24} color={color} />
        </View>
        <Title style={[styles.statValue, { color }]}>{value.toLocaleString()}</Title>
        <Paragraph style={styles.statTitle}>{title}</Paragraph>
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
          <Title style={styles.welcomeText}>
            Welcome, {user?.fullName || 'User'}
          </Title>
          <Paragraph style={styles.dateText}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Paragraph>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Total Schools"
            value={stats.totalSchools}
            icon="school"
            color={colors.primary}
          />
          <StatCard
            title="Today's Meals"
            value={stats.todayMeals}
            icon="restaurant"
            color={colors.secondary}
          />
          <StatCard
            title="This Week"
            value={stats.weeklyMeals}
            icon="bar-chart"
            color={colors.info}
          />
          <StatCard
            title="This Month"
            value={stats.monthlyMeals}
            icon="trending-up"
            color={colors.warning}
          />
        </View>

        <Card style={styles.menuCard}>
          <Card.Content>
            <Title style={styles.menuTitle}>Today's Menu</Title>
            <Paragraph style={styles.menuDescription}>
              Rice, Dal, Mixed Vegetables, Chapati
            </Paragraph>
            <Paragraph style={styles.menuDescriptionMarathi}>
              तांदूळ, डाळ, मिक्स भाजी, चपाती
            </Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Title style={styles.quickActionsTitle}>Quick Actions</Title>
            <View style={styles.quickActions}>
              <View style={styles.quickAction}>
                <MaterialIcons name="add-circle" size={32} color={colors.primary} />
                <Text style={styles.quickActionText}>Add Meal Record</Text>
              </View>
              <View style={styles.quickAction}>
                <MaterialIcons name="restaurant-menu" size={32} color={colors.secondary} />
                <Text style={styles.quickActionText}>View Menu</Text>
              </View>
              <View style={styles.quickAction}>
                <MaterialIcons name="assessment" size={32} color={colors.info} />
                <Text style={styles.quickActionText}>Generate Report</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          // Navigate to add meal record
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
  dateText: {
    color: colors.gray,
    marginTop: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    marginBottom: 15,
    elevation: 4,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  statHeader: {
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: colors.gray,
  },
  menuCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 4,
  },
  menuTitle: {
    color: colors.primary,
    marginBottom: 10,
  },
  menuDescription: {
    fontSize: 16,
    marginBottom: 5,
  },
  menuDescriptionMarathi: {
    fontSize: 14,
    color: colors.gray,
    fontStyle: 'italic',
  },
  quickActionsCard: {
    marginHorizontal: 20,
    marginBottom: 100,
    elevation: 4,
  },
  quickActionsTitle: {
    color: colors.primary,
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    color: colors.dark,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 80,
    backgroundColor: colors.primary,
  },
});

export default DashboardScreen;