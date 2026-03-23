import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FINDING_STATUSES, FindingStatus } from '../constants/inspectionData';
import { Colors, Fonts, Spacing, BorderRadius } from '../constants/theme';

interface StatusBadgeProps {
  status: FindingStatus;
  size?: 'small' | 'medium' | 'large';
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const statusInfo = FINDING_STATUSES.find((s) => s.key === status);
  if (!statusInfo) return null;

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  return (
    <View style={[styles.container, { backgroundColor: statusInfo.color }]}>
      <View style={[styles.triangle, isSmall && styles.triangleSmall, isLarge && styles.triangleLarge]}>
        <Text style={[styles.exclamation, isSmall && styles.exclamationSmall, isLarge && styles.exclamationLarge]}>
          !
        </Text>
      </View>
      {!isSmall && (
        <Text
          style={[
            styles.label,
            isLarge && styles.labelLarge,
            (status === 'yellow' || status === 'green') && styles.darkText,
          ]}
          numberOfLines={1}
        >
          {statusInfo.label}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  triangle: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triangleSmall: {
    width: 18,
    height: 18,
  },
  triangleLarge: {
    width: 30,
    height: 30,
  },
  exclamation: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  exclamationSmall: {
    fontSize: 12,
  },
  exclamationLarge: {
    fontSize: 20,
  },
  label: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semibold,
    flexShrink: 1,
  },
  labelLarge: {
    fontSize: Fonts.sizes.md,
  },
  darkText: {
    color: Colors.text,
  },
});
