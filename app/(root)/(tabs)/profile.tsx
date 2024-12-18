import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useAuth } from '@/context/auth'
import { Image } from 'expo-image'
import Entypo from '@expo/vector-icons/Entypo'
import { Link, router } from 'expo-router'
import { useRef, useState } from 'react'
import { HoldItem } from 'react-native-hold-menu'
import * as ImagePicker from 'expo-image-picker'
import Avatar from '@/components/Avatar'
import CustomAlert from '@/components/CustomAlert'

const Profile = () => {
  const { user, signOut, updateUserAvatar } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'success',
    title: '',
    message: '',
  })
  // Get the avatar URL from PocketBase
  const getAvatarUrl = () => {
    if (user?.avatar) {
      return `https://gate-member.pockethost.io/api/files/users/${user.id}/${user.avatar}?timestamp=${new Date().getTime()}`
    }
    return require('@/assets/images/avatar.png') // fallback image
  }

  // Handle image picking from library
  const handlePickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permissionResult.granted) {
        // Alert.alert(
        //   "Permission Required",
        //   "You need to grant access to your photo library to select an image.",
        //   [{ text: "OK" }]
        // )
        setAlertConfig({
          visible: true,
          type: 'warning',
          title: 'Permission Required',
          message: 'You need to grant access to your photo library to select an image.',
        })
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      })

      if (!result.canceled) {
        // Update avatar in database
        setIsLoading(true)
        try {
          await updateUserAvatar(result.assets[0].uri)
          // Alert.alert("Success", "Profile picture updated successfully!")
          setAlertConfig({
            visible: true,
            type: 'success',
            title: 'Success!',
            message: 'Profile picture updated successfully!',
          })
        } catch (error) {
          console.error('Error updating avatar:', error)
          // Alert.alert(
          //   "Error",
          //   "Failed to update profile picture. Please try again.",
          //   [{ text: "OK" }]
          // )
          setAlertConfig({
            visible: true,
            type: 'error',
            title: 'Update Failed',
            message: 'Failed to update profile picture. Please try again.',
          })
        } finally {
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert(
        "Error",
        "An error occurred while selecting the image.",
        [{ text: "OK" }]
      )
    }
  }

  return (
    <>
      <ScrollView>
        {/* Header */}
        <View className='flex-row items-center p-4 shadow'>
          {/* Back button positioned absolutely on the left */}
          <Link href='/(root)/(tabs)/home' asChild>
            <TouchableOpacity className='absolute right-1 z-10'>
              <Entypo name='chevron-right' size={34} color='black' />
            </TouchableOpacity>
          </Link>

          {/* Center container for avatar and name */}
          <View className='flex-1 flex-row justify-center items-center'>
            <View className='flex-row items-center'>
              <Text className='font-JakartaSemiBold text-xl'>Profile</Text>
            </View>
          </View>
        </View>

        <View className='items-center'>
          <HoldItem
            items={[
              { text: 'Take Picture', onPress: () => { router.push('/(modal)/camera') } },
              { text: 'Choose from library', onPress: handlePickImage },
            ]}
          >
            <View className="relative">
              {/* <Image
                source={
                  typeof getAvatarUrl() === 'string'
                    ? { uri: getAvatarUrl() }
                    : getAvatarUrl()
                }
                style={{ width: 170, height: 170, borderRadius: 100 }}
                contentFit="cover"
                transition={150}
                cachePolicy="memory-disk"
              /> */}
              <Avatar size={170} userId={user?.id} />
              {isLoading && (
                <View
                  className="absolute inset-0 items-center justify-center bg-black/30"
                  style={{
                    width: 170,
                    height: 170,
                    borderRadius: 100
                  }}
                >
                  <ActivityIndicator
                    size="large"
                    // style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
                    color="#ffffff"
                  />
                </View>
              )}
            </View>
          </HoldItem>
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
            <Ionicons name='exit' size={24} color='black' />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type as 'success' | 'error' | 'warning'}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
      />
    </>
  )
}

export default Profile
