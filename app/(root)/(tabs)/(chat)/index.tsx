import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import Entypo from '@expo/vector-icons/Entypo'
import { router, Link, useFocusEffect } from 'expo-router'
import { usePocketBase } from '@/context/pocketbase'
import { User } from '@/types/type'
import Avatar from '@/components/Avatar'
import { useAvatarStore } from '@/store'

const { width: windowWidth } = Dimensions.get('window')

const ChatList = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>()
  const [refreshing, setRefreshing] = useState(false)
  const { pb } = usePocketBase()
  const { setAvatarUrl } = useAvatarStore()
  const currentUserId = pb?.authStore.model?.id // Get currently logged-in user ID

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchUsers().then(() => setRefreshing(false))
  }, [])

  function onGoToChatRoom(userId: string) {
    router.push(`/(root)/(tabs)/(chat)/chat/${userId}`)
  }

  // const userAvatarUrl = (userId: string, avatar: string) => {
  //   if (avatar) {
  //     return { uri: `https://gate-member.pockethost.io/api/files/users/${userId}/${avatar}` }
  //   }
  //   return require('@/assets/images/blank_avatar.png')
  // }

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const users = await pb?.collection('users').getFullList<User>(200, {
        sort: 'created',
        filter: `id != '${currentUserId}'`,
      })

      if (users) {
        // Cache avatar URLs for all users
        users.forEach((user) => {
          if (user.avatar) {
            setAvatarUrl(
              user.id,
              `https://gate-member.pockethost.io/api/files/users/${user.id}/${user.avatar}`,
            )
          }
        })
        setUsers(users)
      }
    } catch (error) {
      // console.error('Failed to fetch messages:', error)
      console.log('Failed to fetch messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchUsers()
  //   }, [pb, currentUserId]),
  // )

  useEffect(() => {
    fetchUsers()
  }, [pb, currentUserId])

  const renderItem = ({ item }: { item: User }) => (
    <View className='flex flex-row m-2 w-[${windowWidth}] items-center'>
      <TouchableOpacity
        className='w-full p-[11px] bg-general-600 rounded-xl'
        onPress={() => onGoToChatRoom(item.id)}
      >
        <View className='flex flex-row items-center justify-between'>
          <View className='flex flex-row items-center'>
            {/* <Image
              className='w-[40px] h-[40px] rounded-full'
              // source={{ uri: item.avatar }}
              source={userAvatarUrl(item.id, item.avatar)}
            /> */}
            <Avatar size={40} userId={item.id} key={`avatar-${item.id}`} />
            <Text className='font-JakartaSemiBold text-xl text-foreground-default ml-3'>
              {item.username}
            </Text>
          </View>
          <Entypo name='chevron-right' size={28} color='#f3ebe5' />
        </View>
      </TouchableOpacity>
    </View>
  )

  const renderEmptyList = () => (
    <View className='flex-1 items-center justify-center p-4'>
      <Text className='font-JakartaMedium text-gray-500 text-center'>
        No users found
      </Text>
    </View>
  )

  const renderLoader = () => (
    <View className='flex-1 items-center justify-center'>
      <ActivityIndicator size='large' color='#ffffff' />
    </View>
  )
  return (
    <SafeAreaView className='flex-1 bg-general-800'>
      {/* Header */}
      <View className='flex-row items-center p-4 shadow'>
        {/* Back button positioned absolutely on the left */}
        <Link href={'/(root)/(tabs)/home'} asChild>
          <TouchableOpacity className='absolute left-1 z-10 bg-general-500 p-2 rounded-full'>
            <Entypo name='chevron-left' size={34} color='#f3ebe5' />
          </TouchableOpacity>
        </Link>

        {/* Center container for avatar and name */}
        <View className='flex-1 flex-row justify-center items-center'>
          <View className='flex-row items-center'>
            <Text className='font-JakartaSemiBold text-xl text-foreground-default'>
              Messages
            </Text>
          </View>
        </View>
      </View>

      {/* <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        keyboardShouldPersistTaps={'handled'}
        refreshing={refreshing}
        onRefresh={onRefresh}
      /> */}
      {isLoading ? (
        renderLoader()
      ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyList}
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          />
      )}
    </SafeAreaView>
  )
}

export default ChatList
