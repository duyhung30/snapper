import {
  ScrollView,
  View,
  SafeAreaView,
  Text,
  // Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Modal,
  // FlatList,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import {
  FlatList,
  GestureHandlerRootView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import { Image } from 'expo-image'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import { ReactNativeModal } from 'react-native-modal'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState, useEffect, memo } from 'react'
import { Comment } from '@/types/type'
import { usePocketBase } from '@/context/pocketbase'
import { UnsubscribeFunc } from 'pocketbase'

const { height: windowHeight } = Dimensions.get('window')

type Props = {
  isVisible: boolean
  onClose: () => void
  postId: string
}

const CommentModal = React.memo(({ isVisible, onClose, postId }: Props) => {
  // const router = useRouter()
  const [comments, setComments] = useState<Comment[]>()
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { pb } = usePocketBase()

  const fetchComments = async () => {
    try {
      setIsLoading(true)
      const records = await pb
        ?.collection('comments')
        .getFullList<Comment>(200, {
          sort: '-created',
          filter: `post = "${postId}"`,
          expand: 'author',
          $autoCancel: false,
        })
      console.log('Fetched records:', records)
      // Handle empty comments
      if (!records || records.length === 0) {
        setComments([]) // Set to empty array instead of undefined
        return
      }
      setComments(records)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true)
    try {
      fetchComments()
    } catch (error) {
      console.error('Error refreshing comments:', error)
    } finally {
      setRefreshing(false)
    }
  }, [postId])

  // Fetch initial comments
  useEffect(() => {
    let unsubscribeComment: UnsubscribeFunc | undefined
    fetchComments()

    // Subscribe to realtime updates
    const subscribeToChanges = async () => {
      unsubscribeComment = await pb
        ?.collection('comments')
        .subscribe('*', async ({ action, record }) => {
          if (record.post === postId) {
            switch (action) {
              case 'create':
                try {
                  const newComment = await pb
                    ?.collection('comments')
                    .getOne<Comment>(record.id, {
                      filter: `post = "${postId}"`,
                      expand: 'author',
                      $autoCancel: false,
                    })
                  // Add new comment to the list
                  setComments((prevComments) => [
                    newComment,
                    ...(prevComments || []),
                  ])
                } catch (error) {
                  console.error('Error fetching posts:', error)
                }

                // const newComment = record as Comment
                // setComments((prevComments) => [
                //   record as any,
                //   ...(prevComments || []),
                // ])
                console.log('Fetched record:', record)
                break
              // case 'update':
              //   // Update existing comment
              //   setComments(prevComments =>
              //     prevComments.map(comment =>
              //       comment.id === record.id ? record : comment
              //     )
              //   );
              //   break;
              // case 'delete':
              //   // Remove deleted comment
              //   setComments(prevComments =>
              //     prevComments.filter(comment => comment.id !== record.id)
              //   );
              //   break;
            }
          }
        })
    }

    // subscribeToChanges()
    //
    // // Cleanup subscription on unmount
    // return () => {
    //   unsubscribeComment?.()
    // }
  }, [postId])

  const handleSendComment = async () => {
    if (!newComment.trim()) {
      return // Prevent submission if the comment is empty
    }

    try {
      const data = {
        text: newComment.trim(),
        author: pb?.authStore.model?.id,
        post: postId,
      }

      await pb?.collection('comments').create(data)
      setNewComment('') // Clear input
      Keyboard.dismiss()

      fetchComments()
    } catch (error) {
      // console.error('Error sending comment:', error);
      console.log('Error sending comment:', error)
    }
  }

  // Optional: Add debounced typing indicator
  const [isTyping, setIsTyping] = useState(false)
  useEffect(() => {
    if (newComment) {
      setIsTyping(true)
      const timeout = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timeout)
    }
  }, [newComment])

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    const commentDate = new Date(dateString)
    const secondsAgo = Math.floor(
      (now.getTime() - commentDate.getTime()) / 1000,
    )

    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`
    } else if (secondsAgo < 3600) {
      const minutes = Math.floor(secondsAgo / 60)
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    } else if (secondsAgo < 86400) {
      const hours = Math.floor(secondsAgo / 3600)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(secondsAgo / 86400)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    }
  }

  const renderComment = ({ item }: { item: Comment }) => (
    <View
      // style={{
      //   padding: 12,
      //   marginBottom: 8,
      //   backgroundColor: '#f5f5f5',
      //   borderRadius: 8,
      // }}
      className='flex flex-row p-[10px] mb-[8px] bg-[#f5f5f5] rounded-xl'
    >
      <Image
        // src={item.expand?.author?.avatar}
        // source={require('@/assets/images/blank_avatar.png')}
        source={
          item.expand?.author?.avatar
            ? {
              uri: `https://gate-member.pockethost.io/api/files/users/${item.expand.author.id}/${item.expand.author.avatar}`,
            }
            : require('@/assets/images/blank_avatar.png')
        }
        className='w-[30px] h-[30px] rounded-full border-0 border-black mr-3'
      />
      <View>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>
          {item.expand?.author?.username || 'Anonymous'}
        </Text>
        <Text>{item.text}</Text>
        <Text style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
          {/*
        {new Date(item.created).toLocaleDateString()}
        */}
          {formatTimeAgo(item.created)}
        </Text>
      </View>
    </View>
  )

  const ListFooterComponent = () =>
    isTyping ? (
      <View className='p-2 bg-[#f5f5f5] rounded-xl'>
        <Text style={{ fontStyle: 'italic', color: '#666' }}>
          Someone is typing...
        </Text>
      </View>
    ) : null

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection={['down']}
      onSwipeComplete={onClose}
      animationIn='slideInUp'
      animationOut='slideOutDown'
      animationInTiming={300}
      animationOutTiming={400}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={400}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      swipeThreshold={50}
      coverScreen={true}
      propagateSwipe={true}
      avoidKeyboard={true}
      deviceHeight={windowHeight * 0.6}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        backgroundColor: 'transparent',
        // height: windowHeight,
      }}
      backdropColor='transparent'
    // backdropOpacity={0.5}
    // coverScreen={false}
    >
      {/* Input Bar with KeyboardAvoidingView */}
      {/*
<KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      // style={{ flex: 1 }}
      >
      */}
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          // height: windowHeight * 0.6,
          height: windowHeight * 0.5,
          // marginTop: 80,
          // height: '80%',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          bottom: 0,
        }}
      >
        {/* Handle for pull-down gesture */}
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 4,
            backgroundColor: '#DEDEDE',
            borderRadius: 2,
            marginTop: 8,
            marginBottom: 8,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            // marginBottom: 5,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Comment section
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name='close' size={34} color='black' />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          {isLoading ? (
            <ActivityIndicator style={{ flex: 1 }} />
          ) : (
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ padding: 20 }}
              style={{ flex: 1 }}
              ListFooterComponent={ListFooterComponent}
              keyboardShouldPersistTaps={'handled'}
              inverted={false} // Set to true if you want newest comments at the bottom
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </GestureHandlerRootView>

        <GestureHandlerRootView style={{ margin: 0 }}>
          {/* Input Bar */}
          <View
            style={{
              flexDirection: 'row',
              padding: 12,
              borderTopWidth: 1,
              borderTopColor: '#eee',
              backgroundColor: 'white',
              // marginBottom: Platform.OS === 'ios' ? 40 : 20,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                borderRadius: 20,
                backgroundColor: '#f5f5f5',
                paddingHorizontal: 15,
                paddingVertical: 12,
                marginRight: 10,
                // justifyContent: 'center',
                // alignItems: 'center',
              }}
              className='text-black'
              placeholder='Write a comment...'
              value={newComment}
              onChangeText={setNewComment}
              editable={!isLoading}
              multiline
            />
            <TouchableWithoutFeedback
              onPress={handleSendComment}
              disabled={!newComment.trim()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: newComment.trim() ? '#007AFF' : '#B0B0B0',
                width: 40,
                height: 40,
                borderRadius: 20,
              }}
            >
              <Ionicons name='send' size={20} color='white' />
            </TouchableWithoutFeedback>
          </View>
        </GestureHandlerRootView>
      </View>

      {/* Add bottom padding for iOS devices */}
      {Platform.OS === 'ios' && (
        <View style={{ height: 20, backgroundColor: 'white' }} />
      )}
      {/* </KeyboardAvoidingView> */}
    </ReactNativeModal>

    // <Modal
    //   visible={true}
    //   transparent={true}
    //   animationType="slide"
    //   onRequestClose={() => router.back()}
    //   statusBarTranslucent
    // >
    //   <Pressable
    //     className="flex-1 bg-black/0"
    //     onPress={() => router.back()}
    //   >
    //     <View className="flex-1 justify-end">
    //       <Pressable
    //         className="w-full"
    //         onPress={e => e.stopPropagation()}
    //       >
    //         <View
    //           className="bg-white rounded-t-[20px]"
    //           style={{
    //             height: windowHeight * 0.6,
    //           }}
    //         >
    //           {/* Pull Bar */}
    //           <View className="w-10 h-1 bg-[#DEDEDE] rounded-full self-center mt-2 mb-2" />

    //           {/* Header */}
    //           <View className="flex-row justify-between items-center px-5 mb-2.5">
    //             <Text className="text-lg font-bold">Comment section</Text>
    //             <TouchableOpacity onPress={() => router.back()}>
    //               <Ionicons name="close" size={34} color="black" />
    //             </TouchableOpacity>
    //           </View>

    //           {/* Comments List */}
    //           <ScrollView
    //             className="flex-1"
    //             contentContainerStyle={{ padding: 20 }}
    //           >
    //             {[...Array(20)].map((_, i) => (
    //               <View
    //                 key={i}
    //                 className="p-2.5 mb-2.5 bg-[#f5f5f5] rounded-lg"
    //               >
    //                 <Text>Comment {i + 1}</Text>
    //               </View>
    //             ))}
    //           </ScrollView>
    //         </View>
    //       </Pressable>
    //     </View>
    //   </Pressable>
    // </Modal>
  )
})

export default CommentModal
