import React, { useState, useEffect, useCallback, useRef, memo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Alert,
  Share,
} from 'react-native'
// import * as Sharing from 'expo-sharing'
import { router, Link } from 'expo-router'
import ReactNativeModal from 'react-native-modal'
// import { Image } from "react-native"
import { Image } from 'expo-image'
import { ImageSliderType } from '@/data/SliderData'
// import ReelsFooter from "./ReelsFooter";
import Ionicons from '@expo/vector-icons/Ionicons'
import CommentModal from './Comment'
import { Post } from '@/types/type'
import { usePocketBase } from '@/context/pocketbase'

type Props = {
  // item: ImageSliderType
  item: Post
  index: number
  onPress: () => void
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

// Debounce function
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>

  return function (this: any, ...args: Parameters<T>) {
    const context = this

    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(context, args)
    }, delay)
  }
}

const ReelsItem = React.memo(({ item, index, onPress }: Props) => {
  const { pb } = usePocketBase()
  const [showComments, setShowComments] = useState(false) // Add this
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  const ShareImage = () => {
    const imageUrl = `https://gate-member.pockethost.io/api/files/posts/${item.id}/${item.image}`
    Share.share({
      url: imageUrl,
      title: 'Check out this image!',
      message: `Check out this image!`,
    })
  }

  // Function to handle sharing the post
  // const ShareImage = async () => {
  //   const imageUrl = `https://gate-member.pockethost.io/api/files/posts/${item.id}/${item.image}`;

  //   // Check if sharing is available
  //   const isAvailable = await Sharing.isAvailableAsync();

  //   if (!isAvailable) {
  //     Alert.alert("Sharing is not available on this device");
  //     return;
  //   }

  //   try {
  //     await Sharing.shareAsync(imageUrl, {
  //       dialogTitle: 'Check out this post',
  //       // UTI: 'public.image', // Set UTI for image sharing
  //     });
  //   } catch (error) {
  //     console.error('Error sharing:', error);
  //   }
  // };

  // Check if current user has liked the post
  useEffect(() => {
    const checkUserLike = async () => {
      const userId = pb?.authStore.model?.id
      if (userId) {
        try {
          const userLike = await pb
            ?.collection('likes')
            .getFirstListItem(`post="${item.id}" && author="${userId}"`)
          // // Optionally fetch likes count dynamically if needed
          // const totalLikes = await pb.collection('likes').getFullList({
          //   filter: `post="${item.id}"`,
          // })
          // setLikesCount(totalLikes.length) // Update likes count based on actual number of likes

          // Get total likes count
          const likesCount = await pb
            ?.collection('likes')
            .getList(1, 1, {
              filter: `post="${item.id}"`,
              $autoCancel: false,
            });
          setIsLiked(!!userLike)
          setLikesCount(likesCount?.totalItems || 0)
        } catch {
          setIsLiked(false)
        }
      }
    }
    checkUserLike()
  }, [item.id])

  const handleLikeToggle = async () => {
    const userId = pb?.authStore.model?.id
    if (!userId) return
    // Optimistically update heart color immediately
    setIsLiked(!isLiked)
    // Optimistically update likes count
    const newLikesCount = isLiked ? likesCount - 1 : likesCount + 1
    setLikesCount(newLikesCount)

    try {
      if (isLiked) {
        // Unlike logic
        const existingLike = await pb
          .collection('likes')
          .getFirstListItem(`post="${item.id}" && author="${userId}"`)
        await pb.collection('likes').delete(existingLike.id)
        // await pb.collection('posts').update(item.id, )
      } else {
        // Like logic
        await pb.collection('likes').create({
          post: item.id,
          author: userId
        })
      }
    } catch (error) {
      console.error('Like toggle failed:', error)
      // Revert UI changes if operation fails
      setIsLiked(isLiked)
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1)
    }
  }

  // Create a debounced version of handleLikeToggle to handle rapid clicks
  const debouncedHandleLikeToggle = useCallback(
    debounce(handleLikeToggle, 500),
    [isLiked],
  )

  // const imageUrl = `http://127.0.0.1:8090/api/files/posts/${item.id}/${item.image}`;
  const imageUrl = `https://gate-member.pockethost.io/api/files/posts/${item.id}/${item.image}`
  // console.log('Image URL:', imageUrl);
  return (
    <>
      <View
        style={{
          height: windowHeight,
          width: windowWidth,
          // paddingTop: 50,
          // justifyContent: "center",
          alignItems: 'center',
          // backgroundColor: 'black',
        }}
      >
        <View className='flex-0.5 items-center mt-5'>
          <Image
            // source={{ uri: imageUrl }}
            source={imageUrl}
            // cannot use this for android emulator
            // placeholder={{ blurhash }}
            transition={1000}
            cachePolicy='memory-disk' // Enable caching
            style={{
              width: windowWidth - 3,
              height: windowWidth,
              borderRadius: 30,
            }}
          />
          {item.caption && (<View className='absolute bottom-14 bg-black/50 w-1/2 h-[44px] rounded-3xl justify-center items-center'>
            <Text className='font-JakartaSemiBold text-[16px] text-gray-200'> {item.caption} </Text>
          </View>)}
          {/* <Text className='font-JakartaBold text-lg'> {pb?.authStore.model?.username} </Text> */}
          <View className='flex flex-row items-center pt-3'>
            <Image
              // src={item.expand?.author_id?.avatar}
              // source={require('@/assets/images/blank_avatar.png')}
              source={
                item.expand?.author_id?.avatar
                  ? { uri: `https://gate-member.pockethost.io/api/files/users/${item.expand.author_id.id}/${item.expand.author_id.avatar}` }
                  : require('@/assets/images/blank_avatar.png')
              }
              className='w-[30px] h-[30px] rounded-full border-0 border-black'
            // style={{
            //   width: 30,
            //   height: 30,
            //   borderRadius: 50,
            //   borderWidth: 2,
            //   borderColor: 'black',
            // }}
            />
            <Text className='font-JakartaBold text-xl pl-2'>
              {item.expand?.author_id?.username || 'Unknown user'}
            </Text>
          </View>
        </View>

        <View className='flex-0.5 items-center w-full mt-10'>
          <View className='flex-row w-5/6 items-center justify-center h-55 border-2 border-black shadow-2xl rounded-3xl'>
            <View className='flex-row w-full h-12 px-4 justify-center'>
              <View className='basis-2/3 items-center justify-center'>
                <TouchableOpacity
                  className='items-center justify-center py-2 px-6'
                  // onPress={() => router.push('/(modal)/comment')}
                  onPress={() => setShowComments(true)}
                >
                  <Text className='font-JakartaBold text-lg'>
                    Add a comment
                  </Text>
                </TouchableOpacity>
              </View>
              <View className='flex flex-row basis-1/3 justify-end items-center'>
                <TouchableOpacity
                  className='pl-2 py-2 pr-1'
                  onPress={ShareImage}
                >
                  <Ionicons name='share-outline' size={34} color='black' />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={debouncedHandleLikeToggle}
                  className='flex flex-row py-2 pr-1 pl-1 items-center'
                >
                  {/* <Ionicons name='heart-outline' size={34} color='black' /> */}
                  <Ionicons
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={34}
                    color={isLiked ? 'red' : 'black'}
                  />
                  <Text className='text-xl font-JakartaSemiBold'>
                    {/*
                      {item.likes_count}
                    */}
                    {likesCount}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/*
           */}
          <View className='flex-row items-center w-full justify-around'>
            <TouchableOpacity className='items-center mt-5' onPress={onPress}>
              <Ionicons name='radio-button-on-sharp' size={74} color='black' />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Comment Modal */}
      <CommentModal
        isVisible={showComments}
        onClose={() => setShowComments(false)}
        postId={item.id}
      />
    </>
  )
})

// Image.prefetch([blurhash])

export default ReelsItem
