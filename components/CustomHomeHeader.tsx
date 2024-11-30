import { View, SafeAreaView, Text, TouchableOpacity } from "react-native"
import { Link, useRouter } from "expo-router"
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';

const HomeHeader = () => {
  const router = useRouter()
  return (
    <View className='flex-row' style={{ backgroundColor: 'white', justifyContent: 'space-between' }}>
      {/* <Text> This is a home header </Text> */}
      {/* <Link href={'/(root)/(tabs)/profile'} asChild> */}
      <TouchableOpacity onPress={() => { router.push('/(root)/(tabs)/profile'), console.log('just pushed the button') }} className='rounded-full items-center p-3 bg-gray-400'>
        <FontAwesome6 name="circle-user" size={24} color="black" />
      </TouchableOpacity>
      {/* </Link> */}
      <View >
        <Text>People</Text>
      </View>
      <Link href={'/(root)/(tabs)/chat'} asChild>
        <TouchableOpacity className='rounded-full items-center p-3 bg-gray-400'>
          <Feather name="message-circle" size={27} color="black" />
        </TouchableOpacity>
      </Link>
    </View >
  )
}

export default HomeHeader
