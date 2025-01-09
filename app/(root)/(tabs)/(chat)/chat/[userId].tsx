import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  // Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { Image } from 'expo-image'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import {
  router,
  useFocusEffect,
  useGlobalSearchParams,
  useLocalSearchParams,
} from 'expo-router'
import { usePocketBase } from '@/context/pocketbase'
import { UnsubscribeFunc } from 'pocketbase'
import { Message } from '@/types/type'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Entypo from '@expo/vector-icons/Entypo'
import { DotIndicator } from 'react-native-reanimated-indicators'
import Avatar from '@/components/Avatar'
import { useAvatarStore } from '@/store'

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>()
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [receiverName, setReceiverName] = useState('')
  const [receiverAvatar, setReceiverAvatar] = useState('')

  const flatListRef = useRef<FlatList>(null)

  const { pb } = usePocketBase()
  const currentUserId = pb?.authStore.model?.id // Get currently logged-in user ID
  // const userId = useGlobalSearchParams()
  const user = useLocalSearchParams()
  const userId = useLocalSearchParams().userId

  // console.log('Current user ID:', currentUserId)
  // console.log('User ID:', user)
  // console.log(`(sender = '${currentUserId}' && receiver = '${userId}') || (sender = '${userId}' && receiver = '${currentUserId}')`)

  // Function to scroll to the end
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }

  const fetchUserDetail = async () => {
    try {
      setIsLoading(true)
      if (pb && userId) {
        const userIdString = Array.isArray(userId) ? userId[0] : userId
        const userData = await pb?.collection('users').getOne(userIdString)
        // setUser(userData);
        setReceiverName(userData?.username)
        if (userData?.avatar) {
          const avatarUrl = `https://gate-member.pockethost.io/api/files/users/${userIdString}/${userData.avatar}`;
          setReceiverAvatar(avatarUrl)

          // Add this: Update the avatar store for the receiver
          const { setAvatarUrl } = useAvatarStore.getState()
          setAvatarUrl(userIdString, avatarUrl)

        } else {
          setReceiverAvatar(''); // or null, depending on how you want to handle no avatar
        }
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const messages = await pb
        ?.collection('messages')
        .getFullList<Message>(200, {
          sort: 'created',
          expand: 'sender, receiver',
          filter: `(sender = '${currentUserId}' && receiver = '${userId}') || (sender = '${userId}' && receiver = '${currentUserId}')`,
        })
      setMessages(messages)

      console.log('Fetched messages:', messages)
    } catch (error) {
      console.log('Failed to fetch messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserDetail()
  }, [pb, userId])

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchMessages()
  //   }, [pb, currentUserId, userId]),
  // )

  // Fetch posts when component mounts
  useEffect(() => {
    let unsubscribeMessage: UnsubscribeFunc | undefined
    let unsubscribeTyping: UnsubscribeFunc | undefined

    fetchMessages()

    const subscribeToChanges = async () => {
      unsubscribeMessage = await pb
        ?.collection('messages')
        .subscribe('*', async ({ action, record }) => {
          // Check if the message belongs to this chat
          if (
            (record.sender === currentUserId && record.receiver === userId) ||
            (record.sender === userId && record.receiver === currentUserId)
          ) {
            console.log('Processing message update:', action)

            if (action === 'create') {
              // Fetch the complete message data
              try {
                const newMessage = await pb
                  ?.collection('messages')
                  .getOne<Message>(record.id, {
                    // expand: 'author_id, likes(post)',
                    // sort: 'created',
                  })
                // Ensure the new post starts with a correct like count
                setMessages((prevMessages) => [
                  ...(prevMessages || []),
                  newMessage,
                ])
                // fetchMessages()
              } catch (error) {
                console.error('Error fetching new message:', error)
              }
            }
          }
        })

      unsubscribeTyping = await pb
        ?.collection('typing_indicators')
        .subscribe('*', async ({ action, record }) => {
          if (record.userId === userId) {
            // Check if the typing indicator is for the other user
            if (action === 'create' && record.isTyping) {
              setIsTyping(true) // User is typing
            } else if (action === 'delete') {
              setIsTyping(false) // User stopped typing
            }
          }
        })
    }

    subscribeToChanges()

    return () => {
      unsubscribeMessage?.()
      unsubscribeTyping?.()
    }
  }, [pb, currentUserId, userId])
  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      await pb?.collection('messages').create({
        text: newMessage,
        sender: currentUserId,
        receiver: userId,
      })
      setNewMessage('')
      // fetchMessages()
      setIsTyping(false) // Reset typing state after sending
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  // Optional: Add debounced typing indicator
  useEffect(() => {
    if (newMessage) {
      setIsTyping(true)
      const timeout = setTimeout(() => setIsTyping(false), 500)
      return () => clearTimeout(timeout)
    } else {
      setIsTyping(false)
    }
  }, [newMessage])

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`flex-row my-2 items-center ${item.sender === currentUserId
        ? 'justify-end pr-2'
        : 'justify-start pl-2'
        }`}
    >
      {/* Show avatar only for messages from the other user */}
      {item.sender !== currentUserId && (
        // <Image
        //   source={
        //     receiverAvatar
        //       ? { uri: receiverAvatar }
        //       : require('@/assets/images/blank_avatar.png')
        //   }
        //   className='w-[30px] h-[30px] rounded-full mr-2'
        //   transition={1000}
        //   cachePolicy='memory-disk' // Enable caching
        // />
        <Avatar size={30} userId={Array.isArray(userId) ? userId[0] : userId} styles={{ marginRight: 10 }} />
      )}

      <View
        className={`p-3 rounded-lg max-w-[80%] ml-2 ${item.sender === currentUserId
          ? 'bg-blue-500 rounded-xl'
          : 'bg-gray-300 rounded-xl'
          }`}
      >
        <Text
          className={`${item.sender === currentUserId ? 'text-white' : 'text-black'
            } font-JakartaSemiBold`}
        >
          {item.text}
        </Text>
      </View>
    </View>
  )

  const ListFooterComponent = () =>
    isTyping ? (
      <View className='flex flex-row items-center'>
        {/* <Image
          source={
            receiverAvatar
              ? { uri: receiverAvatar }
              : require('@/assets/images/blank_avatar.png')
          }
          className='w-[30px] h-[30px] rounded-full mr-2 ml-2'
          transition={1000}
          cachePolicy='memory-disk' // Enable caching
        /> */}
        <Avatar size={30} userId={Array.isArray(userId) ? userId[0] : userId} />
        <View className='ml-2 mb-2 '>
          <DotIndicator
            color='#666'
            interval={1400}
            count={3}
            style={{
              backgroundColor: '#d1d5db',
              width: 60,
              height: 40,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
            }}
          />
        </View>
      </View>
    ) : null

  return (
    <SafeAreaView className='flex-1 bg-general-800'>
      {/* Header */}
      <View className='flex-row items-center p-4 shadow'>
        {/* Back button positioned absolutely on the left */}
        <TouchableOpacity
          onPress={() => router.back()}
          className='absolute left-1 z-10 bg-general-500 p-2 rounded-full'
        >
          <Entypo name='chevron-left' size={34} color='#f3ebe5' />
        </TouchableOpacity>
        {/* Center container for avatar and name */}
        <View className='flex-1 flex-row justify-center items-center'>
          <View className='flex-row items-center'>
            {/* <Image
              source={
                receiverAvatar
                  ? { uri: receiverAvatar }
                  : require('@/assets/images/blank_avatar.png')
              }
              className='w-[40px] h-[40px] rounded-full mr-2'
              transition={1000}
              cachePolicy='memory-disk' // Enable caching
            /> */}
            <Avatar size={30} userId={Array.isArray(userId) ? userId[0] : userId} styles={{ marginRight: 10 }} />
            <Text className='font-JakartaSemiBold text-lg text-foreground-default'>{receiverName}</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessage}
          ListFooterComponent={ListFooterComponent}
          keyboardShouldPersistTaps={'handled'}
          onContentSizeChange={scrollToBottom} // Scroll when content size changes
          onLayout={scrollToBottom} // Scroll on initial layout
          inverted={false} // Set to true if you want newest comments at the bottom
        />

        <View className='flex-row items-center p-2'>
          <TextInput
            className='flex-1 bg-general-600 rounded-[20px] px-[15px] py-[12px] mr-2 font-JakartaSemiBold font-2xl text-foreground-default'
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder='Type a message...'
            placeholderTextColor={'#f3ebe5'}
            editable={!isLoading}
            multiline={true}
          />
          <TouchableWithoutFeedback
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`justify-center items-center w-12 h-12 rounded-full ${newMessage.trim() ? 'bg-blue-500' : 'bg-gray-300'
              }`}
          >
            <FontAwesome
              name='send'
              size={24}
              color={newMessage.trim() ? '#0286ff' : 'gray'}
            // color='white'
            />
          </TouchableWithoutFeedback>
        </View>

        {Platform.OS === 'ios' && (
          // <View style={{ height: 20, backgroundColor: 'white' }} />
          <View style={{ height: 20 }} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatRoom
