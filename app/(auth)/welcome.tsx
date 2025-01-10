import { Link, router } from 'expo-router'
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
// import { Image } from 'react-native'
import { Image } from 'expo-image'
import CustomButton from '@/components/CustomButton'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')
const Welcome = () => {
  return (
    <SafeAreaView className='flex-1 items-center justify-end space-y-6 bg-background-default'>
      {/* <View className='w-1/2'>
        <Link href={'/(auth)/sign-up'} asChild>
          <TouchableOpacity className='rounded-full items-center p-3 bg-blue-300'>
            <Text className='text-2xl'>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View className='w-1/2 mb-8'>
        <Link href={'/(auth)/sign-in'} asChild>
          <TouchableOpacity className='rounded-full items-center p-3'>
            <Text className='text-2xl'>Sign in</Text>
          </TouchableOpacity>
        </Link>
      </View> */}

      <View className='w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center'>
        <Image
          source={require('../../assets/images/friends.jpg')}
          // resizeMode='cover'
          transition={1000}
          cachePolicy='memory-disk' // Enable caching
          style={{
            width: windowWidth,
            height: windowHeight,
            // borderRadius: 30,
          }}
        />
      </View>
      <Text className='text-secondary-200 text-xl text-center mt-2 mx-8 font-JakartaSemiBold'>
        Live pics from your friends, on your home screen
      </Text>

      <CustomButton
        title={'Sign up'}
        onPress={() => {
          router.push('/(auth)/sign-up')
        }}
        className='items-center w-5/6'
      />

      <CustomButton
        title={'Sign In'}
        onPress={() => {
          router.push('/(auth)/sign-in')
        }}
        className='items-center bg-secondary-600 w-5/6 mb-14'
      />
    </SafeAreaView>
  )
}

export default Welcome
