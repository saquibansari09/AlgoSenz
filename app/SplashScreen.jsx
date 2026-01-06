import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';

SplashScreen.preventAutoHideAsync(); // Prevent auto hide until ready

export default function MySplashScreen() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync(); // Hide splash
      router.replace('/login'); // Navigate to Login
    }, 2000); // Show splash for 2 seconds
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/icon.png')} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});
