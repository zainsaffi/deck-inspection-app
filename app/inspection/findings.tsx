import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInspection } from '../../src/context/InspectionContext';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import Header from '../../src/components/Header';
import StatusBadge from '../../src/components/StatusBadge';
import PhotoCapture from '../../src/components/PhotoCapture';
import { Colors, Fonts, Spacing, BorderRadius } from '../../src/constants/theme';
import {
  SUBCATEGORIES,
  SUBCATEGORY_LABELS,
  SUBCATEGORY_TYPE_OPTIONS,
  FINDING_STATUSES,
  FindingStatus,
  SubCategory,
} from '../../src/constants/inspectionData';

export default function FindingsScreen() {
  const router = useRouter();
  const { locationId } = useLocalSearchParams<{ locationId: string }>();
  const { inspection, dispatch } = useInspection();

  const location = inspection?.locations.find((l) => l.id === locationId);

  // Current subcategory being worked on
  const [currentSubcatIndex, setCurrentSubcatIndex] = useState(0);
  const currentSubcat = SUBCATEGORIES[currentSubcatIndex];

  // Finding form state
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<FindingStatus | null>(null);
  const [closeUpUri, setCloseUpUri] = useState<string | null>(null);
  const [locationPhotoUri, setLocationPhotoUri] = useState<string | null>(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const typeOptions = SUBCATEGORY_TYPE_OPTIONS[currentSubcat];

  // Count existing findings for this subcategory
  const existingFindings = useMemo(() => {
    return location?.findings.filter((f) => f.subcategory === currentSubcat) || [];
  }, [location, currentSubcat]);

  const findingNumber = existingFindings.length + 1;

  const resetForm = () => {
    setDescription('');
    setStatus(null);
    setCloseUpUri(null);
    setLocationPhotoUri(null);
    // Keep selectedType for same subcategory
  };

  const saveFinding = () => {
    if (!status) {
      Alert.alert('Required', 'Please select a finding status.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Required', 'Please enter a finding description.');
      return;
    }

    const findingId = Date.now().toString();
    const statusInfo = FINDING_STATUSES.find((s) => s.key === status);

    // Append status text to description
    const fullDescription = `${description.trim()}\n${statusInfo?.description || ''}`;

    dispatch({
      type: 'ADD_FINDING',
      payload: {
        locationId: locationId!,
        finding: {
          id: findingId,
          subcategory: currentSubcat,
          type: selectedType || undefined,
          findingNumber,
          description: fullDescription,
          status,
          closeUpPhotoUri: closeUpUri,
          locationPhotoUri: locationPhotoUri,
        },
      },
    });
  };

  const handleAddAnotherFinding = () => {
    saveFinding();
    resetForm();
  };

  const handleContinueToNext = () => {
    // Save current finding if there's content
    if (description.trim() && status) {
      saveFinding();
    }

    if (currentSubcatIndex < SUBCATEGORIES.length - 1) {
      // Special case: stairs are optional
      if (SUBCATEGORIES[currentSubcatIndex + 1] === 'stairs') {
        Alert.alert(
          'Stairs Inspection',
          'Does this location have exterior stairs that need inspection?',
          [
            {
              text: 'No - Finish',
              style: 'cancel',
              onPress: () => finishLocation(),
            },
            {
              text: 'Yes',
              onPress: () => {
                setCurrentSubcatIndex(currentSubcatIndex + 1);
                resetForm();
                setSelectedType('');
              },
            },
          ]
        );
      } else {
        setCurrentSubcatIndex(currentSubcatIndex + 1);
        resetForm();
        setSelectedType('');
      }
    } else {
      finishLocation();
    }
  };

  const finishLocation = () => {
    dispatch({
      type: 'UPDATE_LOCATION',
      payload: {
        locationId: locationId!,
        data: { isComplete: true },
      },
    });

    Alert.alert(
      'Location Complete',
      'Inspect another location?',
      [
        {
          text: 'No - Review',
          onPress: () => router.replace('/inspection/locations'),
        },
        {
          text: 'Yes - Add Another',
          onPress: () => router.replace('/inspection/locations'),
        },
      ]
    );
  };

  const nextSubcatLabel =
    currentSubcatIndex < SUBCATEGORIES.length - 1
      ? SUBCATEGORY_LABELS[SUBCATEGORIES[currentSubcatIndex + 1]]
      : 'Reports';

  if (!location) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Error" onBack={() => router.replace('/inspection/locations')} />
        <View style={styles.center}>
          <Text>Location not found. Please go back and try again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title={SUBCATEGORY_LABELS[currentSubcat]}
        subtitle={`Unit ${location.unitNumber} • Finding #${findingNumber}`}
        onBack={() => router.replace('/inspection/locations')}
      />

      {/* Subcategory Progress Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {SUBCATEGORIES.map((subcat, idx) => (
          <TouchableOpacity
            key={subcat}
            style={[
              styles.tab,
              idx === currentSubcatIndex && styles.tabActive,
              idx < currentSubcatIndex && styles.tabDone,
            ]}
            onPress={() => {
              if (idx <= currentSubcatIndex) {
                setCurrentSubcatIndex(idx);
                resetForm();
                setSelectedType('');
              }
            }}
          >
            <Text
              style={[
                styles.tabText,
                idx === currentSubcatIndex && styles.tabTextActive,
                idx < currentSubcatIndex && styles.tabTextDone,
              ]}
              numberOfLines={1}
            >
              {SUBCATEGORY_LABELS[subcat]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Previous findings for this subcategory */}
        {existingFindings.length > 0 && (
          <View style={styles.existingSection}>
            <Text style={styles.existingTitle}>
              Previous {SUBCATEGORY_LABELS[currentSubcat]} Findings
            </Text>
            {existingFindings.map((f) => (
              <View key={f.id} style={styles.existingCard}>
                <View
                  style={[
                    styles.existingStripe,
                    {
                      backgroundColor:
                        FINDING_STATUSES.find((s) => s.key === f.status)?.color ||
                        Colors.border,
                    },
                  ]}
                />
                <View style={styles.existingContent}>
                  <Text style={styles.existingNum}>
                    #{f.findingNumber} {f.type || ''}
                  </Text>
                  <Text style={styles.existingDesc} numberOfLines={2}>
                    {f.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Type Dropdown (if applicable) */}
        {typeOptions && (
          <View style={styles.dropdownContainer}>
            <Text style={styles.fieldLabel}>
              Select {SUBCATEGORY_LABELS[currentSubcat]} Type
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowTypeDropdown(!showTypeDropdown)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedType && styles.dropdownPlaceholder,
                ]}
                numberOfLines={2}
              >
                {selectedType || 'Tap to select...'}
              </Text>
              <Text style={styles.dropdownArrow}>
                {showTypeDropdown ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {showTypeDropdown && (
              <ScrollView style={styles.dropdownOptions} nestedScrollEnabled>
                {typeOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      selectedType === option && styles.dropdownOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedType(option);
                      setShowTypeDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        selectedType === option && styles.dropdownOptionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {/* Finding Description */}
        <Input
          label={`#${findingNumber} ${SUBCATEGORY_LABELS[currentSubcat]} Finding`}
          placeholder="Enter your observation and findings..."
          value={description}
          onChangeText={setDescription}
          multiline
          style={{ minHeight: 120 }}
        />

        {/* Status Selection */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.fieldLabel}>
            Select {SUBCATEGORY_LABELS[currentSubcat]} Status
          </Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
            activeOpacity={0.7}
          >
            {status ? (
              <StatusBadge status={status} size="medium" />
            ) : (
              <Text style={styles.dropdownPlaceholder}>Tap to select status...</Text>
            )}
            <Text style={styles.dropdownArrow}>
              {showStatusDropdown ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          {showStatusDropdown && (
            <ScrollView style={styles.dropdownOptions} nestedScrollEnabled>
              {FINDING_STATUSES.map((s) => (
                <TouchableOpacity
                  key={s.key}
                  style={[
                    styles.statusOption,
                    { borderLeftColor: s.color, borderLeftWidth: 4 },
                  ]}
                  onPress={() => {
                    setStatus(s.key);
                    setShowStatusDropdown(false);
                  }}
                >
                  <Text style={styles.statusOptionLabel}>{s.label}</Text>
                  <Text style={styles.statusOptionDesc}>{s.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Photos */}
        <View style={styles.photosRow}>
          <View style={styles.photoHalf}>
            <PhotoCapture
              label="Close Up Photo"
              photoUri={closeUpUri}
              onPhotoTaken={setCloseUpUri}
            />
          </View>
          <View style={styles.photoHalf}>
            <PhotoCapture
              label="Location Photo"
              photoUri={locationPhotoUri}
              onPhotoTaken={setLocationPhotoUri}
            />
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Button
          title={`Add Another ${SUBCATEGORY_LABELS[currentSubcat]} Finding`}
          onPress={handleAddAnotherFinding}
          variant="outline"
          disabled={!description.trim() || !status}
        />
        <View style={{ height: Spacing.sm }} />
        <Button
          title={`Continue (${nextSubcatLabel})`}
          onPress={handleContinueToNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexGrow: 0,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primaryDark,
  },
  tabDone: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
    fontWeight: Fonts.weights.medium,
  },
  tabTextActive: {
    color: Colors.primaryDark,
    fontWeight: Fonts.weights.bold,
  },
  tabTextDone: {
    color: Colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  existingSection: {
    marginBottom: Spacing.md,
  },
  existingTitle: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semibold,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  existingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  existingStripe: {
    width: 4,
  },
  existingContent: {
    flex: 1,
    padding: Spacing.sm,
  },
  existingNum: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text,
  },
  existingDesc: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  dropdownContainer: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    minHeight: 48,
  },
  dropdownText: {
    flex: 1,
    fontSize: Fonts.sizes.md,
    color: Colors.text,
  },
  dropdownPlaceholder: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.md,
  },
  dropdownArrow: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  dropdownOptions: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    marginTop: 2,
    maxHeight: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropdownOptionActive: {
    backgroundColor: Colors.primaryLight + '20',
  },
  dropdownOptionText: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
  },
  dropdownOptionTextActive: {
    color: Colors.primaryDark,
    fontWeight: Fonts.weights.semibold,
  },
  statusOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  statusOptionLabel: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text,
  },
  statusOptionDesc: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textLight,
    marginTop: 2,
  },
  photosRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoHalf: {
    flex: 1,
  },
  footer: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
