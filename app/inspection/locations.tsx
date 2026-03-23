import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInspection } from '../../src/context/InspectionContext';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import Header from '../../src/components/Header';
import StatusBadge from '../../src/components/StatusBadge';
import { Colors, Fonts, Spacing, BorderRadius } from '../../src/constants/theme';
import { FINDING_STATUSES, FindingStatus } from '../../src/constants/inspectionData';

export default function LocationsScreen() {
  const router = useRouter();
  const { inspection, dispatch } = useInspection();
  const [showAddForm, setShowAddForm] = useState(false);
  const [unitNumber, setUnitNumber] = useState('');
  const [description, setDescription] = useState('');

  const handleAddLocation = () => {
    if (!unitNumber.trim()) {
      Alert.alert('Required', 'Please enter an apartment/unit number.');
      return;
    }

    const locationId = Date.now().toString();
    dispatch({
      type: 'ADD_LOCATION',
      payload: {
        id: locationId,
        unitNumber: unitNumber.trim(),
        description: description.trim(),
        findings: [],
        isComplete: false,
      },
    });

    setUnitNumber('');
    setDescription('');
    setShowAddForm(false);

    // Navigate to findings for this new location
    router.push(`/inspection/findings?locationId=${locationId}`);
  };

  const handleLocationPress = (locationId: string) => {
    router.push(`/inspection/findings?locationId=${locationId}`);
  };

  const getLocationWorstStatus = (locationId: string): FindingStatus | null => {
    const location = inspection?.locations.find((l) => l.id === locationId);
    if (!location || location.findings.length === 0) return null;

    const priority: FindingStatus[] = ['red', 'yellow', 'blue', 'green'];
    for (const status of priority) {
      if (location.findings.some((f) => f.status === status)) {
        return status;
      }
    }
    return null;
  };

  const getStatusColor = (status: FindingStatus): string => {
    return FINDING_STATUSES.find((s) => s.key === status)?.color || Colors.border;
  };

  const handleFinishInspection = () => {
    if (!inspection || inspection.locations.length === 0) {
      Alert.alert('No Locations', 'Please add at least one inspection location.');
      return;
    }
    router.push('/inspection/review');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Inspection Locations"
        subtitle={inspection?.coverPage.propertyLocation.address || 'Property'}
        onBack={() => router.replace('/home')}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Existing Locations */}
        {inspection?.locations.map((location) => {
          const worstStatus = getLocationWorstStatus(location.id);
          return (
            <TouchableOpacity
              key={location.id}
              style={styles.locationCard}
              onPress={() => handleLocationPress(location.id)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.statusStripe,
                  {
                    backgroundColor: worstStatus
                      ? getStatusColor(worstStatus)
                      : Colors.border,
                  },
                ]}
              />
              <View style={styles.locationContent}>
                <Text style={styles.unitNumber}>Unit {location.unitNumber}</Text>
                {location.description ? (
                  <Text style={styles.locationDesc} numberOfLines={1}>
                    {location.description}
                  </Text>
                ) : null}
                <Text style={styles.findingCount}>
                  {location.findings.length} finding(s)
                  {location.isComplete ? ' • Complete' : ' • In Progress'}
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          );
        })}

        {/* Add New Location Form */}
        {showAddForm ? (
          <View style={styles.addForm}>
            <Text style={styles.addFormTitle}>Add Inspection Location</Text>
            <Input
              label="Apartment / Unit Number"
              placeholder="e.g., Unit 22, Apt 15B"
              value={unitNumber}
              onChangeText={setUnitNumber}
            />
            <Input
              label="Location Description (optional)"
              placeholder="e.g., 2nd floor, south-facing balcony"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 60 }}
            />
            <View style={styles.addFormButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowAddForm(false);
                  setUnitNumber('');
                  setDescription('');
                }}
                variant="outline"
                fullWidth={false}
                style={{ flex: 1 }}
              />
              <Button
                title="Add & Start Inspection"
                onPress={handleAddLocation}
                fullWidth={false}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>Add Inspection Location</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {inspection && inspection.locations.length > 0 && (
        <View style={styles.footer}>
          <Button
            title="Review & Generate Report"
            onPress={handleFinishInspection}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  locationCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statusStripe: {
    width: 6,
    alignSelf: 'stretch',
  },
  locationContent: {
    flex: 1,
    padding: Spacing.md,
  },
  unitNumber: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text,
  },
  locationDesc: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    marginTop: 2,
  },
  findingCount: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    marginTop: 4,
  },
  arrow: {
    fontSize: Fonts.sizes.xl,
    color: Colors.textMuted,
    paddingRight: Spacing.md,
  },
  addButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.primaryDark,
    borderStyle: 'dashed',
    padding: Spacing.lg,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  addIcon: {
    fontSize: 24,
    color: Colors.primaryDark,
    fontWeight: Fonts.weights.bold,
  },
  addText: {
    fontSize: Fonts.sizes.md,
    color: Colors.primaryDark,
    fontWeight: Fonts.weights.semibold,
  },
  addForm: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  addFormTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  addFormButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  footer: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
