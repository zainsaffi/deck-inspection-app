import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInspection } from '../../src/context/InspectionContext';
import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import Header from '../../src/components/Header';
import PhotoCapture from '../../src/components/PhotoCapture';
import { Colors, Fonts, Spacing, BorderRadius } from '../../src/constants/theme';

type Step = 1 | 2 | 3 | 4 | 5;

export default function CoverPageScreen() {
  const router = useRouter();
  const { inspection, dispatch } = useInspection();
  const [step, setStep] = useState<Step>(1);

  // Step 1: Business Info
  const [businessName, setBusinessName] = useState(inspection?.coverPage.businessInfo.name || '');
  const [businessAddress, setBusinessAddress] = useState(inspection?.coverPage.businessInfo.address || '');
  const [businessCity, setBusinessCity] = useState(inspection?.coverPage.businessInfo.city || '');
  const [businessState, setBusinessState] = useState(inspection?.coverPage.businessInfo.state || '');
  const [businessZip, setBusinessZip] = useState(inspection?.coverPage.businessInfo.zip || '');
  const [businessEmail, setBusinessEmail] = useState(inspection?.coverPage.businessInfo.email || '');

  // Step 2: Property Location
  const [propAddress, setPropAddress] = useState(inspection?.coverPage.propertyLocation.address || '');
  const [propCity, setPropCity] = useState(inspection?.coverPage.propertyLocation.city || '');
  const [propState, setPropState] = useState(inspection?.coverPage.propertyLocation.state || '');
  const [propZip, setPropZip] = useState(inspection?.coverPage.propertyLocation.zip || '');

  // Step 3: Management Contact
  const [mgmtName, setMgmtName] = useState(inspection?.coverPage.managementContact.name || '');
  const [mgmtAddress, setMgmtAddress] = useState(inspection?.coverPage.managementContact.address || '');
  const [mgmtPhone, setMgmtPhone] = useState(inspection?.coverPage.managementContact.phone || '');
  const [mgmtEmail, setMgmtEmail] = useState(inspection?.coverPage.managementContact.email || '');

  // Step 4: Property Photo
  const [photoUri, setPhotoUri] = useState(inspection?.coverPage.propertyPhotoUri || null);

  // Step 5: Date
  const [inspDate, setInspDate] = useState(
    inspection?.coverPage.inspectionDate || new Date().toISOString().split('T')[0]
  );

  const saveCoverPage = () => {
    dispatch({
      type: 'UPDATE_COVER_PAGE',
      payload: {
        businessInfo: {
          name: businessName,
          address: businessAddress,
          city: businessCity,
          state: businessState,
          zip: businessZip,
          email: businessEmail,
        },
        propertyLocation: {
          address: propAddress,
          city: propCity,
          state: propState,
          zip: propZip,
        },
        managementContact: {
          name: mgmtName,
          address: mgmtAddress,
          phone: mgmtPhone,
          email: mgmtEmail,
        },
        propertyPhotoUri: photoUri,
        inspectionDate: inspDate,
      },
    });
  };

  const handleContinue = () => {
    if (step < 5) {
      setStep((step + 1) as Step);
    } else {
      saveCoverPage();
      router.push('/inspection/locations');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
    } else {
      router.replace('/home');
    }
  };

  const stepTitles: Record<Step, string> = {
    1: 'Business Owner Contact Information',
    2: 'Property Location',
    3: 'Management Contact',
    4: 'Property Photo',
    5: 'Inspection Date',
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Input
              label="Business / Owner Name"
              placeholder="Any Business or Owner"
              value={businessName}
              onChangeText={setBusinessName}
            />
            <Input
              label="Street Address"
              placeholder="1111 Any Lane"
              value={businessAddress}
              onChangeText={setBusinessAddress}
            />
            <View style={styles.row}>
              <Input
                label="City"
                placeholder="Anytown"
                value={businessCity}
                onChangeText={setBusinessCity}
                containerStyle={styles.flex2}
              />
              <Input
                label="State"
                placeholder="CA"
                value={businessState}
                onChangeText={setBusinessState}
                containerStyle={styles.flex1}
                maxLength={2}
                autoCapitalize="characters"
              />
              <Input
                label="Zip"
                placeholder="55555"
                value={businessZip}
                onChangeText={setBusinessZip}
                containerStyle={styles.flex1}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <Input
              label="Email"
              placeholder="contact@gmail.com"
              value={businessEmail}
              onChangeText={setBusinessEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.emailNote}>
              This email will link the inspection report to the customer's account.
            </Text>
          </>
        );

      case 2:
        return (
          <>
            <Input
              label="Property Street Address"
              placeholder="2222 Any Avenue"
              value={propAddress}
              onChangeText={setPropAddress}
            />
            <View style={styles.row}>
              <Input
                label="City"
                placeholder="Anytown"
                value={propCity}
                onChangeText={setPropCity}
                containerStyle={styles.flex2}
              />
              <Input
                label="State"
                placeholder="CA"
                value={propState}
                onChangeText={setPropState}
                containerStyle={styles.flex1}
                maxLength={2}
                autoCapitalize="characters"
              />
              <Input
                label="Zip"
                placeholder="55555"
                value={propZip}
                onChangeText={setPropZip}
                containerStyle={styles.flex1}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
          </>
        );

      case 3:
        return (
          <>
            <Input
              label="Manager Name"
              placeholder="Joe Manager"
              value={mgmtName}
              onChangeText={setMgmtName}
            />
            <Input
              label="Address"
              placeholder="3333 Management Lane"
              value={mgmtAddress}
              onChangeText={setMgmtAddress}
            />
            <Input
              label="Phone"
              placeholder="(916) 555-5555"
              value={mgmtPhone}
              onChangeText={setMgmtPhone}
              keyboardType="phone-pad"
            />
            <Input
              label="Email"
              placeholder="joe@management.com"
              value={mgmtEmail}
              onChangeText={setMgmtEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        );

      case 4:
        return (
          <PhotoCapture
            label="Property Photo"
            photoUri={photoUri}
            onPhotoTaken={setPhotoUri}
            optional={false}
          />
        );

      case 5:
        return (
          <>
            <Input
              label="Inspection Date"
              placeholder="YYYY-MM-DD"
              value={inspDate}
              onChangeText={setInspDate}
            />
            <Text style={styles.dateHint}>
              Format: YYYY-MM-DD (e.g., 2026-03-23)
            </Text>
          </>
        );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header
        title="Cover Page"
        subtitle={`Step ${step} of 5`}
        onBack={handleBack}
      />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${(step / 5) * 100}%` }]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.stepTitle}>{stepTitles[step]}</Text>
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Continue" onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  progressContainer: {
    height: 3,
    backgroundColor: Colors.borderLight,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  stepTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  flex1: {
    flex: 1,
  },
  flex2: {
    flex: 2,
  },
  emailNote: {
    fontSize: Fonts.sizes.xs,
    color: Colors.primaryDark,
    fontStyle: 'italic',
    marginTop: -Spacing.sm,
  },
  dateHint: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    marginTop: -Spacing.sm,
  },
  footer: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
});
