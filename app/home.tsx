import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../src/context/AuthContext';
import { useInspection } from '../src/context/InspectionContext';
import Button from '../src/components/Button';
import { Colors, Fonts, Spacing, BorderRadius } from '../src/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { inspection, dispatch } = useInspection();

  const handleNewInspection = () => {
    const id = Date.now().toString();
    dispatch({
      type: 'NEW_INSPECTION',
      payload: { id, userId: user?.uid || 'dev-user' },
    });
    router.push('/inspection/cover-page');
  };

  const handleContinueInspection = () => {
    if (inspection) {
      if (inspection.locations.length === 0) {
        router.push('/inspection/cover-page');
      } else {
        router.push('/inspection/locations');
      }
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          dispatch({ type: 'CLEAR' });
          try { await signOut(); } catch {}
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.topBar} />
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.brandName}>Deck & Balcony Inspections</Text>
              <Text style={styles.tagline}>Your SB-326 Compliance Experts</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.signOut}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.greeting}>
          Welcome{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </Text>

        {/* Active Inspection Banner */}
        {inspection && inspection.status === 'draft' && (
          <TouchableOpacity style={styles.activeCard} onPress={handleContinueInspection}>
            <View style={styles.activeIndicator} />
            <View style={styles.activeContent}>
              <Text style={styles.activeTitle}>Active Inspection</Text>
              <Text style={styles.activeSubtitle}>
                {inspection.coverPage.propertyLocation.address || 'No address yet'}
                {' • '}
                {inspection.locations.length} location(s)
              </Text>
            </View>
            <Text style={styles.activeArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Main Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionCard} onPress={handleNewInspection}>
            <View style={[styles.actionIcon, { backgroundColor: Colors.primary }]}>
              <Text style={styles.actionEmoji}>📋</Text>
            </View>
            <Text style={styles.actionTitle}>New Inspection</Text>
            <Text style={styles.actionDesc}>Start a new SB-326 inspection</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardDisabled]}
            onPress={() => Alert.alert('Coming Soon', 'Previous inspections will be available once connected to Firebase.')}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.border }]}>
              <Text style={styles.actionEmoji}>📁</Text>
            </View>
            <Text style={styles.actionTitle}>Previous Inspections</Text>
            <Text style={styles.actionDesc}>View and manage past reports</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>-</Text>
            <Text style={styles.statLabel}>Total Inspections</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>-</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>-</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  topBar: {
    height: 4,
    backgroundColor: Colors.primary,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerLogo: {
    width: 50,
    height: 40,
  },
  brandName: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    color: Colors.primaryDark,
  },
  tagline: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  signOut: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  greeting: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  activeCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  activeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginRight: Spacing.md,
  },
  activeContent: {
    flex: 1,
  },
  activeTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text,
  },
  activeSubtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    marginTop: 2,
  },
  activeArrow: {
    fontSize: Fonts.sizes.xl,
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  actionCardDisabled: {
    opacity: 0.6,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionEmoji: {
    fontSize: 28,
  },
  actionTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textLight,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    color: Colors.primaryDark,
  },
  statLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
