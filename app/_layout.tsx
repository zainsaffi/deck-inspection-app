import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Platform, StyleSheet } from 'react-native';
import { AuthProvider } from '../src/context/AuthContext';
import { InspectionProvider } from '../src/context/InspectionContext';
import { Colors } from '../src/constants/theme';

function PhoneFrame({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') return <>{children}</>;

  return (
    <View style={styles.webContainer}>
      <View style={styles.phoneFrame}>
        {children}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <InspectionProvider>
        <StatusBar style="dark" />
        <PhoneFrame>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
              animation: 'slide_from_right',
            }}
          />
        </PhoneFrame>
      </InspectionProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  phoneFrame: {
    width: 393,
    height: 852,
    backgroundColor: Colors.white,
    borderRadius: 40,
    overflow: 'hidden',
    // Shadow for web
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    } as any : {}),
  },
});
