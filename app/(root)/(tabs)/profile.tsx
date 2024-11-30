import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useAuth } from '@/context/auth'
import { Image } from 'expo-image'

const Profile = () => {
  const { signOut } = useAuth()
  return (
    <ScrollView>
      <View className='items-center'>
        <Image
          // source={require('../../../assets/images/avatar.png')}
          placeholder={require('../../../assets/images/blank_avatar.png')}
          style={{ width: 170, height: 170, borderRadius: 100 }}
        />
      </View>

      <View className='flex-row items-end'>
        <Ionicons name='person' size={22} color='black' />
        <Text style={{ fontSize: 17, fontWeight: 'bold' }}> General </Text>
      </View>

      <View className='flex-row items-end'>
        <Ionicons name='share-social' size={24} color='black' />
        <Text style={{ fontSize: 17, fontWeight: 'bold' }}> Social </Text>
      </View>

      <View className='flex-row items-end'>
        <Ionicons name='alert-circle-sharp' size={24} color='black' />
        <Text style={{ fontSize: 17, fontWeight: 'bold' }}> Danger </Text>
      </View>
      <View>
        <TouchableOpacity onPress={signOut}>
          <Ionicons name="exit" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default Profile
