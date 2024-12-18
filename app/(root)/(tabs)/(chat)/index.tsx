import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import Entypo from '@expo/vector-icons/Entypo'
import { router, Link, useFocusEffect } from 'expo-router'
import { usePocketBase } from '@/context/pocketbase'
import { User } from '@/types/type'

const { width: windowWidth } = Dimensions.get('window')

const ChatList = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>()
  const [refreshing, setRefreshing] = useState(false)
  const { pb } = usePocketBase()
  const currentUserId = pb?.authStore.model?.id // Get currently logged-in user ID

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    fetchUsers().then(() => setRefreshing(false))
  }, [])

  function onGoToChatRoom(userId: string) {
    router.push(`/(chat)/chat/${userId}`)
  }

  const userAvatarUrl = (userId: string, avatar: string) => {
    if (avatar) {
      return { uri: `https://gate-member.pockethost.io/api/files/users/${userId}/${avatar}` }
    }
    return require('@/assets/images/blank_avatar.png')
  }

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const users = await pb?.collection('users').getFullList<User>(200, {
        sort: 'created',
        filter: `id != '${currentUserId}'`,
      })
      setUsers(users)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
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
    fetchUsers();
  }, [pb, currentUserId])

  const renderItem = ({ item }: { item: User }) => (
    <View className='flex flex-row m-2 w-[${windowWidth}] items-center'>
      <TouchableOpacity
        className='w-full p-[11px] bg-[#DEDEDE] rounded-xl'
        onPress={() => onGoToChatRoom(item.id)}
      >
        <View className='flex flex-row items-center justify-between'>
          <View className='flex flex-row items-center'>
            <Image
              className='w-[40px] h-[40px] rounded-full'
              // source={{ uri: item.avatar }}
              source={userAvatarUrl(item.id, item.avatar)}
            />
            <Text className='font-JakartaSemiBold text-xl ml-3'>
              {item.username}
            </Text>
          </View>
          <Entypo name='chevron-right' size={24} color='black' />
        </View>
      </TouchableOpacity>
    </View>
  )
  return (
    <SafeAreaView>
      {/* Header */}
      <View className='flex-row items-center p-4 shadow'>
        {/* Back button positioned absolutely on the left */}
        <Link href={'/(root)/(tabs)/home'} asChild>
          <TouchableOpacity
            className='absolute left-1 z-10'
          >
            <Entypo name="chevron-left" size={34} color="black" />
          </TouchableOpacity>
        </Link>

        {/* Center container for avatar and name */}
        <View className='flex-1 flex-row justify-center items-center'>
          <View className='flex-row items-center'>
            <Text className='font-JakartaSemiBold text-xl'>
              Messages
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        keyboardShouldPersistTaps={'handled'}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </SafeAreaView>
  )
}

export default ChatList
