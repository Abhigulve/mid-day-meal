import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Card, Title, Paragraph, Searchbar, FAB, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { apiService } from '../services/ApiService';
import { colors } from '../utils/theme';

interface School {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  principalName: string;
  totalStudents: number;
  phone: string;
  email: string;
  active: boolean;
}

const SchoolScreen = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSchools();
  }, []);

  useEffect(() => {
    filterSchools();
  }, [searchQuery, schools]);

  const loadSchools = async () => {
    try {
      const response = await apiService.getSchools();
      setSchools(response.data);
    } catch (error) {
      console.error('Error loading schools:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterSchools = () => {
    if (!searchQuery.trim()) {
      setFilteredSchools(schools);
      return;
    }

    const filtered = schools.filter((school) =>
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSchools(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSchools();
  };

  const SchoolCard = ({ school }: { school: School }) => (
    <Card style={styles.schoolCard}>
      <Card.Content>
        <View style={styles.schoolHeader}>
          <View style={styles.schoolInfo}>
            <Title style={styles.schoolName}>{school.name}</Title>
            <Paragraph style={styles.schoolCode}>Code: {school.code}</Paragraph>
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={16} color={colors.gray} />
              <Text style={styles.location}>{school.city}, {school.state}</Text>
            </View>
          </View>
          <Chip 
            mode="outlined" 
            style={[
              styles.statusChip, 
              { borderColor: school.active ? colors.success : colors.error }
            ]}
            textStyle={{ color: school.active ? colors.success : colors.error }}
            compact
          >
            {school.active ? 'Active' : 'Inactive'}
          </Chip>
        </View>

        {school.address && (
          <View style={styles.addressContainer}>
            <MaterialIcons name="home" size={16} color={colors.gray} />
            <Text style={styles.address}>{school.address}</Text>
          </View>
        )}

        <View style={styles.detailsContainer}>
          {school.principalName && (
            <View style={styles.detailItem}>
              <MaterialIcons name="person" size={16} color={colors.primary} />
              <Text style={styles.detailText}>Principal: {school.principalName}</Text>
            </View>
          )}
          
          {school.totalStudents && (
            <View style={styles.detailItem}>
              <MaterialIcons name="groups" size={16} color={colors.secondary} />
              <Text style={styles.detailText}>Students: {school.totalStudents}</Text>
            </View>
          )}
        </View>

        <View style={styles.contactContainer}>
          {school.phone && (
            <View style={styles.contactItem}>
              <MaterialIcons name="phone" size={16} color={colors.info} />
              <Text style={styles.contactText}>{school.phone}</Text>
            </View>
          )}
          
          {school.email && (
            <View style={styles.contactItem}>
              <MaterialIcons name="email" size={16} color={colors.info} />
              <Text style={styles.contactText}>{school.email}</Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Schools</Title>
        <Searchbar
          placeholder="Search schools..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.schoolsList}>
          {filteredSchools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </View>

        {filteredSchools.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <MaterialIcons name="school" size={64} color={colors.gray} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No schools found' : 'No schools available'}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Schools will appear here once they are added'}
            </Text>
          </View>
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          // Navigate to add school
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
  searchBar: {
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  schoolsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  schoolCard: {
    marginBottom: 15,
    elevation: 4,
  },
  schoolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
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
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  location: {
    fontSize: 12,
    color: colors.gray,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 10,
    paddingRight: 20,
  },
  address: {
    fontSize: 12,
    color: colors.gray,
    flex: 1,
    lineHeight: 16,
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: colors.dark,
  },
  contactContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.light,
    paddingTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  contactText: {
    fontSize: 12,
    color: colors.gray,
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

export default SchoolScreen;