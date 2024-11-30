import { Link, router } from 'expo-router'
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
import CustomButton from '@/components/CustomButton'

const Welcome = () => {
  return (
    <SafeAreaView className='flex-1 items-center justify-end space-y-6 bg-white'>
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
      <CustomButton
        title={'Sign up'}
        onPress={() => { router.push('/(auth)/sign-up') }}
        className='items-center w-5/6'
      />

      <CustomButton
        title={'Sign In'}
        onPress={() => { router.push('/(auth)/sign-in') }}
        className='items-center bg-gray-400 w-5/6 mb-14'
      />
    </SafeAreaView>
  )
}

export default Welcome
