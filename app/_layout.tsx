import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useFonts } from 'expo-font'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { PocketBaseProvider } from '@/context/pocketbase'
import { AuthProvider } from '@/context/auth'
import { HoldMenuProvider } from 'react-native-hold-menu'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded] = useFonts({
    'Jakarta-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'Jakarta-ExtraBold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'Jakarta-ExtraLight': require('../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
    'Jakarta-Light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    'Jakarta-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    Jakarta: require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'Jakarta-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    // 'Recursive-Bold': require('../assets/fonts/Recursive_Monospace_Casual-Bold.ttf'),
    // 'Recursive-ExtraBold': require('../assets/fonts/Recursive_Monospace_Casual-ExtraBold.ttf'),
    // 'Recursive-Light': require('../assets/fonts/Recursive_Monospace_Casual-Light.ttf'),
    // 'Recursive-Medium': require('../assets/fonts/Recursive_Monospace_Casual-Medium.ttf'),
    // 'Recursive': require('../assets/fonts/Recursive_Monospace_Casual-Regular.ttf'),
    // 'Recursive-SemiBold': require('../assets/fonts/Recursive_Monospace_Casual-SemiBold.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <PocketBaseProvider>
      <AuthProvider>
        <HoldMenuProvider theme='dark'>
          <Stack>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name='(auth)' options={{ headerShown: false }} />
            <Stack.Screen name='(root)' options={{ headerShown: false }} />
            <Stack.Screen name='(chat)' options={{ headerShown: false }} />
            {/* <Stack.Screen */}
            {/*   name='(modal)/camera' */}
            {/*   options={{ */}
            {/*     presentation: 'modal', */}
            {/*     animation: 'slide_from_bottom', */}
            {/*     headerShown: false, */}
            {/*     contentStyle: { */}
            {/*       backgroundColor: 'transparent', */}
            {/*       height: '90%', */}
            {/*     }, */}
            {/*   }} */}
            {/* /> */}
            {/**/}
            {/* <Stack.Screen */}
            {/*   name='(modal)/imagePicker' */}
            {/*   options={{ */}
            {/*     presentation: 'modal', */}
            {/*     animation: 'slide_from_bottom', */}
            {/*     headerShown: false, */}
            {/*     contentStyle: { */}
            {/*       backgroundColor: 'transparent', */}
            {/*       height: '90%', */}
            {/*     }, */}
            {/*   }} */}
            {/* /> */}

            <Stack.Screen
              name='(modal)'
              options={{
                presentation: 'modal',
                headerShown: false,
                contentStyle: {
                  backgroundColor: 'transparent',
                },
              }}
            />

            <Stack.Screen name='+not-found' />
          </Stack>
        </HoldMenuProvider>
      </AuthProvider>
    </PocketBaseProvider>
  )
}
