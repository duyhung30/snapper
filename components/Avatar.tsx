import { Image } from 'expo-image'
import { View, Text } from 'react-native'
import { useAvatarStore } from '@/store'
import { AvatarProps, AvatarStore } from '@/types/type'

const Avatar = ({ size, userId, styles }: AvatarProps) => {
  // const getAvatarUrl = useAvatarStore((state: AvatarStore) => state.getAvatarUrl);

  // const avatarUrl = userId ? getAvatarUrl(userId) : null;

  // const getAvatarSource = () => {
  //   if (avatarUrl) {
  //     return { uri: avatarUrl };
  //   }
  //   if (userId) {
  //     // Construct URL directly from userId if no cached URL exists
  //     return {
  //       uri: `https://gate-member.pockethost.io/api/files/users/${userId}/${avatarUrl}?t=${Date.now()}`
  //     };
  //   }
  //   return require('@/assets/images/avatar.png'); // fallback image

  const { avatars } = useAvatarStore()

  const getAvatarSource = () => {
    if (userId && avatars[userId]) {
      return { uri: avatars[userId] }
    }

    if (userId) {
      // If we don't have a cached avatar but have a userId, construct the URL
      return require('@/assets/images/avatar.png')
      // return {
      //   uri: `https://gate-member.pockethost.io/api/files/users/${userId}/${avatars[userId]}?t=${Date.now()}`
      // }
    }

    return require('@/assets/images/avatar.png') // fallback image
  };
  return (
    <View>
      <Image
        // source={
        //   typeof getAvatarUrl() === 'string'
        //     ? { uri: getAvatarUrl() }
        //     : getAvatarUrl()
        // }
        source={getAvatarSource()}
        // placeholder={require('@/assets/images/blank_avatar.png')}
        style={[{ width: size, height: size, borderRadius: 100 }, styles]}
        contentFit="cover"
        transition={150}
        cachePolicy="memory-disk"
      />
    </View>
  )
}

export default Avatar;
