import {
  Redirect,
  useRouter,
  useSegments,
  useRootNavigationState,
} from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import { useAuth } from '@/context/auth'
import { useEffect } from 'react'

const Home = () => {

  // return <Redirect href="/(auth)/welcome" />;
  // return <Redirect href="/(root)/(tabs)/home" />;
  // return <Redirect href="/(root)" />;
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    // Wait for navigation to be ready and auth to be initialized
    if (!navigationState?.key || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // If user is not authenticated and not in auth group, redirect to sign-up
      router.replace('/(auth)/sign-up');
    } else if (user) {
      // If user is authenticated, redirect to home
      router.replace('/(root)/(tabs)/home');
    }
  }, [user, segments, navigationState?.key, isLoading]);

  // Show loading indicator while initializing
  if (isLoading || !navigationState?.key) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
}

export default Home
