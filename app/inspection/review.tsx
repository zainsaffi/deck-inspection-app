import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInspection } from '../../src/context/InspectionContext';
import Button from '../../src/components/Button';
import Header from '../../src/components/Header';
import StatusBadge from '../../src/components/StatusBadge';
import { Colors, Fonts, Spacing, BorderRadius } from '../../src/constants/theme';
import {
  FINDING_STATUSES,
  FindingStatus,
  SUBCATEGORY_LABELS,
  SubCategory,
} from '../../src/constants/inspectionData';

export default function ReviewScreen() {
  const router = useRouter();
  const { inspection, dispatch } = useInspection();

  if (!inspection) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Review" onBack={() => router.replace('/inspection/locations')} />
        <View style={styles.center}>
          <Text>No active inspection.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getLocationWorstStatus = (locationId: string): FindingStatus => {
    const loc = inspection.locations.find((l) => l.id === locationId);
    if (!loc || loc.findings.length === 0) return 'green';
    const priority: FindingStatus[] = ['red', 'yellow', 'blue', 'green'];
    for (const s of priority) {
      if (loc.findings.some((f) => f.status === s)) return s;
    }
    return 'green';
  };

  const getStatusColor = (status: FindingStatus): string => {
    return FINDING_STATUSES.find((s) => s.key === status)?.color || Colors.border;
  };

  const handleComplete = () => {
    Alert.alert(
      'Complete Inspection',
      'This will finalize the inspection. In the future, this will generate a PDF report. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            dispatch({ type: 'COMPLETE_INSPECTION' });
            Alert.alert(
              'Inspection Complete',
              'Your inspection has been saved. PDF generation will be available in Phase 2.',
              [
                {
                  text: 'OK',
                  onPress: () => router.replace('/home'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const totalFindings = inspection.locations.reduce(
    (acc, loc) => acc + loc.findings.length,
    0
  );
  const redFindings = inspection.locations.reduce(
    (acc, loc) => acc + loc.findings.filter((f) => f.status === 'red').length,
    0
  );
  const yellowFindings = inspection.locations.reduce(
    (acc, loc) => acc + loc.findings.filter((f) => f.status === 'yellow').length,
    0
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Inspection Review"
        subtitle="Preview your report"
        onBack={() => router.replace('/inspection/locations')}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Cover Page Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cover Page</Text>
          <View style={styles.card}>
            <Text style={styles.reportTitle}>
              Exterior Elevated Element{'\n'}Inspection Report
            </Text>
            <Text style={styles.preparedFor}>Prepared For:</Text>
            <Text style={styles.infoText}>
              {inspection.coverPage.businessInfo.name || '—'}
            </Text>
            <Text style={styles.infoText}>
              {inspection.coverPage.businessInfo.address || '—'}
            </Text>
            <Text style={styles.infoText}>
              {inspection.coverPage.businessInfo.city}{inspection.coverPage.businessInfo.state ? `, ${inspection.coverPage.businessInfo.state}` : ''} {inspection.coverPage.businessInfo.zip}
            </Text>

            {inspection.coverPage.propertyPhotoUri && (
              <Image
                source={{ uri: inspection.coverPage.propertyPhotoUri }}
                style={styles.coverPhoto}
              />
            )}

            <Text style={styles.propLabel}>Property Location:</Text>
            <Text style={styles.infoText}>
              {inspection.coverPage.propertyLocation.address || '—'}
            </Text>
            <Text style={styles.infoText}>
              {inspection.coverPage.propertyLocation.city}{inspection.coverPage.propertyLocation.state ? `, ${inspection.coverPage.propertyLocation.state}` : ''} {inspection.coverPage.propertyLocation.zip}
            </Text>

            <Text style={styles.dateText}>
              Date: {inspection.coverPage.inspectionDate}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Summary</Text>
          <View style={styles.card}>
            <Text style={styles.summarySubtitle}>Inspection Locations</Text>
            <View style={styles.summaryGrid}>
              {inspection.locations.map((loc) => {
                const worstStatus = getLocationWorstStatus(loc.id);
                return (
                  <View
                    key={loc.id}
                    style={[
                      styles.summaryItem,
                      { borderLeftColor: getStatusColor(worstStatus) },
                    ]}
                  >
                    <Text style={styles.summaryUnit}>Unit {loc.unitNumber}</Text>
                    <Text style={styles.summaryCount}>
                      {loc.findings.length} finding(s)
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              <Text style={styles.legendTitle}>Color Code Legend</Text>
              {FINDING_STATUSES.map((s) => (
                <View key={s.key} style={styles.legendRow}>
                  <View
                    style={[styles.legendColor, { backgroundColor: s.color }]}
                  />
                  <Text style={styles.legendLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspection Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{inspection.locations.length}</Text>
              <Text style={styles.statLabel}>Locations</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{totalFindings}</Text>
              <Text style={styles.statLabel}>Total Findings</Text>
            </View>
            <View style={[styles.statCard, redFindings > 0 && styles.statRed]}>
              <Text style={[styles.statNum, redFindings > 0 && styles.statNumRed]}>
                {redFindings}
              </Text>
              <Text style={styles.statLabel}>Critical</Text>
            </View>
            <View style={[styles.statCard, yellowFindings > 0 && styles.statYellow]}>
              <Text style={styles.statNum}>{yellowFindings}</Text>
              <Text style={styles.statLabel}>Repairs</Text>
            </View>
          </View>
        </View>

        {/* Findings Detail */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspection Findings</Text>
          {inspection.locations.map((loc) => (
            <View key={loc.id} style={styles.locationSection}>
              <Text style={styles.locationTitle}>Unit {loc.unitNumber}</Text>
              {loc.findings.length === 0 ? (
                <Text style={styles.noFindings}>No findings recorded</Text>
              ) : (
                loc.findings.map((finding) => (
                  <View key={finding.id} style={styles.findingCard}>
                    <View
                      style={[
                        styles.findingStripe,
                        {
                          backgroundColor:
                            FINDING_STATUSES.find((s) => s.key === finding.status)
                              ?.color || Colors.border,
                        },
                      ]}
                    />
                    <View style={styles.findingContent}>
                      <View style={styles.findingHeader}>
                        <Text style={styles.findingSubcat}>
                          {SUBCATEGORY_LABELS[finding.subcategory as SubCategory]} #{finding.findingNumber}
                        </Text>
                        <StatusBadge status={finding.status} size="small" />
                      </View>
                      {finding.type && (
                        <Text style={styles.findingType}>Type: {finding.type}</Text>
                      )}
                      <Text style={styles.findingDesc}>{finding.description}</Text>
                      {(finding.closeUpPhotoUri || finding.locationPhotoUri) && (
                        <View style={styles.findingPhotos}>
                          {finding.closeUpPhotoUri && (
                            <View style={styles.findingPhotoContainer}>
                              <Image
                                source={{ uri: finding.closeUpPhotoUri }}
                                style={styles.findingPhoto}
                              />
                              <Text style={styles.findingPhotoLabel}>Close Up</Text>
                            </View>
                          )}
                          {finding.locationPhotoUri && (
                            <View style={styles.findingPhotoContainer}>
                              <Image
                                source={{ uri: finding.locationPhotoUri }}
                                style={styles.findingPhoto}
                              />
                              <Text style={styles.findingPhotoLabel}>
                                Inspection Location
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Edit Locations"
          onPress={() => router.replace('/inspection/locations')}
          variant="outline"
        />
        <View style={{ height: Spacing.sm }} />
        <Button title="Complete Inspection" onPress={handleComplete} />
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderTopWidth: 4,
    borderTopColor: Colors.primary,
  },
  reportTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  preparedFor: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semibold,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Fonts.sizes.md,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  coverPhoto: {
    width: '100%',
    height: 180,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.md,
  },
  propLabel: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semibold,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  dateText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  summarySubtitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
    textDecorationLine: 'underline',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  summaryItem: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 6,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minWidth: 140,
    alignItems: 'center',
  },
  summaryUnit: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
  },
  summaryCount: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  legend: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  legendTitle: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semibold,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: Spacing.sm,
  },
  legendColor: {
    width: 24,
    height: 16,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.text,
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
  statRed: {
    borderWidth: 1,
    borderColor: Colors.statusRed,
  },
  statYellow: {
    borderWidth: 1,
    borderColor: '#CCAA00',
  },
  statNum: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    color: Colors.primaryDark,
  },
  statNumRed: {
    color: Colors.statusRed,
  },
  statLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  locationSection: {
    marginBottom: Spacing.md,
  },
  locationTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.bold,
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
    paddingBottom: Spacing.xs,
  },
  noFindings: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  findingCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  findingStripe: {
    width: 5,
  },
  findingContent: {
    flex: 1,
    padding: Spacing.md,
  },
  findingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  findingSubcat: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text,
  },
  findingType: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textLight,
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  findingDesc: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textLight,
    lineHeight: 20,
  },
  findingPhotos: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  findingPhotoContainer: {
    flex: 1,
  },
  findingPhoto: {
    width: '100%',
    height: 100,
    borderRadius: BorderRadius.sm,
  },
  findingPhotoLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  footer: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
