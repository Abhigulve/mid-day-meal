import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, List, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '../services/AuthContext';
import { colors } from '../utils/theme';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              <MaterialIcons name="account-circle" size={80} color={colors.primary} />
            </View>
            <Title style={styles.userName}>{user?.fullName}</Title>
            <Paragraph style={styles.userRole}>{user?.role}</Paragraph>
            <Paragraph style={styles.userEmail}>{user?.email}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.menuCard}>
          <Card.Content>
            <List.Section>
              <List.Item
                title="Settings"
                left={(props) => <List.Icon {...props} icon="settings" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
              />
              <Divider />
              <List.Item
                title="Help & Support"
                left={(props) => <List.Icon {...props} icon="help-circle" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
              />
              <Divider />
              <List.Item
                title="About"
                left={(props) => <List.Icon {...props} icon="information" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => {}}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor={colors.error}
          icon="logout"
        >
          Logout
        </Button>
      </ScrollView>
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
    padding: 20,
  },
  profileCard: {
    marginBottom: 20,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: colors.gray,
  },
  menuCard: {
    marginBottom: 30,
    elevation: 4,
  },
  logoutButton: {
    marginVertical: 20,
    paddingVertical: 8,
  },
});

export default ProfileScreen;