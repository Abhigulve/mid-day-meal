import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Card, Title, Paragraph, Chip, FAB, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { apiService } from '../services/ApiService';
import { colors } from '../utils/theme';

interface MealRecord {
  id: number;
  date: string;
  studentsPresent: number;
  mealsServed: number;
  teacherInCharge: string;
  remarks: string;
  mealQuality: string;
  school: {
    name: string;
    code: string;
  };
  menu: {
    menuDescription: string;
    mealType: string;
  };
}

const MealRecordScreen = () => {
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  useEffect(() => {
    loadMealRecords();
  }, [selectedPeriod]);

  const loadMealRecords = async () => {
    try {
      let response;
      if (selectedPeriod === 'today') {
        response = await apiService.getTodaysMealRecords();
      } else {
        response = await apiService.getMealRecords();
      }
      setMealRecords(response.data);
    } catch (error) {
      console.error('Error loading meal records:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMealRecords();
  };

  const getQualityColor = (quality: string) => {
    switch (quality?.toLowerCase()) {
      case 'excellent':
        return colors.success;
      case 'good':
        return colors.primary;
      case 'average':
        return colors.warning;
      case 'poor':
        return colors.error;
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

  const MealRecordCard = ({ record }: { record: MealRecord }) => (
    <Card style={styles.recordCard}>
      <Card.Content>
        <View style={styles.recordHeader}>
          <View style={styles.schoolInfo}>
            <Title style={styles.schoolName}>{record.school.name}</Title>
            <Paragraph style={styles.schoolCode}>Code: {record.school.code}</Paragraph>
          </View>
          <View style={styles.dateInfo}>
            <Text style={styles.date}>{formatDate(record.date)}</Text>
            <Chip 
              mode="outlined" 
              style={styles.mealTypeChip}
              compact
            >
              {record.menu.mealType}
            </Chip>
          </View>
        </View>

        <View style={styles.mealInfo}>
          <Paragraph style={styles.menuDescription}>
            {record.menu.menuDescription}
          </Paragraph>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="people" size={20} color={colors.primary} />
            <Text style={styles.statLabel}>Present: {record.studentsPresent}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="restaurant" size={20} color={colors.secondary} />
            <Text style={styles.statLabel}>Served: {record.mealsServed}</Text>
          </View>
        </View>

        {record.mealQuality && (
          <View style={styles.qualityContainer}>
            <Text style={styles.qualityLabel}>Quality:</Text>
            <Chip 
              mode="outlined" 
              style={[styles.qualityChip, { borderColor: getQualityColor(record.mealQuality) }]}
              textStyle={{ color: getQualityColor(record.mealQuality) }}
              compact
            >
              {record.mealQuality}
            </Chip>
          </View>
        )}

        {record.teacherInCharge && (
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherLabel}>Teacher in Charge:</Text>
            <Text style={styles.teacherName}>{record.teacherInCharge}</Text>
          </View>
        )}

        {record.remarks && (
          <View style={styles.remarksContainer}>
            <Text style={styles.remarksLabel}>Remarks:</Text>
            <Text style={styles.remarks}>{record.remarks}</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Meal Records</Title>
        <View style={styles.periodSelector}>
          <Button
            mode={selectedPeriod === 'today' ? 'contained' : 'outlined'}
            onPress={() => setSelectedPeriod('today')}
            style={styles.periodButton}
            compact
          >
            Today
          </Button>
          <Button
            mode={selectedPeriod === 'week' ? 'contained' : 'outlined'}
            onPress={() => setSelectedPeriod('week')}
            style={styles.periodButton}
            compact
          >
            This Week
          </Button>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.recordsList}>
          {mealRecords.map((record) => (
            <MealRecordCard key={record.id} record={record} />
          ))}
        </View>

        {mealRecords.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <MaterialIcons name="assignment" size={64} color={colors.gray} />
            <Text style={styles.emptyStateText}>No meal records found</Text>
            <Text style={styles.emptyStateSubtext}>
              Records will appear here once meals are served
            </Text>
          </View>
        )}
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
  header: {
    padding: 20,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 15,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  periodButton: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  recordsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  recordCard: {
    marginBottom: 15,
    elevation: 4,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 2,
  },
  schoolCode: {
    fontSize: 12,
    color: colors.gray,
  },
  dateInfo: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  mealTypeChip: {
    alignSelf: 'flex-end',
  },
  mealInfo: {
    marginBottom: 15,
  },
  menuDescription: {
    fontSize: 14,
    color: colors.dark,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: colors.light,
    borderRadius: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  qualityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  qualityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.dark,
  },
  qualityChip: {},
  teacherInfo: {
    marginBottom: 10,
  },
  teacherLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 14,
    color: colors.dark,
  },
  remarksContainer: {
    marginTop: 10,
  },
  remarksLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.gray,
    marginBottom: 2,
  },
  remarks: {
    fontSize: 14,
    color: colors.dark,
    fontStyle: 'italic',
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

export default MealRecordScreen;