import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Fonts, Spacing, BorderRadius } from '../constants/theme';

interface PhotoCaptureProps {
  label: string;
  photoUri: string | null;
  onPhotoTaken: (uri: string) => void;
  optional?: boolean;
}

export default function PhotoCapture({
  label,
  photoUri,
  onPhotoTaken,
  optional = true,
}: PhotoCaptureProps) {
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera access is needed to take inspection photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets[0]) {
      onPhotoTaken(result.assets[0].uri);
    }
  };

  const buttonLabel = photoUri
    ? `Change ${label.toLowerCase()}`
    : `Take ${label.toLowerCase()}`;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {optional && <Text style={styles.optional}>(optional)</Text>}
      </Text>

      {photoUri ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <Text style={styles.photoLabel}>{label}</Text>
        </View>
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderText}>No photo taken</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={takePhoto} activeOpacity={0.7}>
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  optional: {
    color: Colors.textMuted,
    fontWeight: Fonts.weights.regular,
  },
  photoContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
  },
  photoLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: Colors.white,
    fontSize: Fonts.sizes.xs,
    textAlign: 'center',
    paddingVertical: Spacing.xs,
  },
  placeholder: {
    height: 150,
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  placeholderText: {
    color: Colors.textMuted,
    fontSize: Fonts.sizes.sm,
  },
  button: {
    backgroundColor: Colors.primaryDark,
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.medium,
  },
});
