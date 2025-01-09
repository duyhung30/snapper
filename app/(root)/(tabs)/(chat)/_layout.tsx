import { Stack, Link } from 'expo-router';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native'
import Entypo from '@expo/vector-icons/Entypo'

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"
        options={{
          // headerTitle: 'Messages',
          // headerTitleStyle: { fontSize: 20, fontFamily: 'Jakarta SemiBold' },
          // headerTitleAlign: 'center', // Center the title
          // headerLeft: () => (
          //   <Link href={'/(root)/(tabs)/home'} asChild>
          //     <TouchableOpacity className='mr-4'>
          //       <Entypo name="chevron-left" size={34} color="black" />
          //     </TouchableOpacity>
          //   </Link>
          // ),
          // headerStyle: { backgroundColor: 'transparent', },
          // headerShadowVisible: false,
          headerShown: false,
        }}
      />
      <Stack.Screen name="chat/[userId]" options={{ headerShown: false }} />
    </Stack>
  );
}
