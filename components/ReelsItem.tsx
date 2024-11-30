import { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native'
import { router, Link } from 'expo-router'
import ReactNativeModal from 'react-native-modal'
// import { Image } from "react-native"
import { Image } from 'expo-image'
import { ImageSliderType } from '@/data/SliderData'
// import ReelsFooter from "./ReelsFooter";
import Ionicons from '@expo/vector-icons/Ionicons'
import CommentModal from './Comment'

type Props = {
  item: ImageSliderType
  index: number
  onPress: () => void
}

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj['

const ReelsItem = ({ item, index, onPress }: Props) => {
  const [showComments, setShowComments] = useState(false) // Add this
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
            source={item.image}
            placeholder={{ blurhash }}
            transition={1000}
            cachePolicy='memory-disk' // Enable caching
            style={{
              width: windowWidth - 3,
              height: windowWidth,
              borderRadius: 30,
            }}
          />
          <Text className='font-JakartaBold text-lg'> user name </Text>
        </View>

        <View className='flex-0.5 items-center w-full mt-10'>
          <View className='flex-row w-5/6 items-center justify-center h-55 border-2 border-black shadow-2xl rounded-3xl'>
            <View className='flex-row w-full h-12 px-4 justify-center'>
              {/*
            <TouchableOpacity className='p-2'>
              <Ionicons name='heart-outline' size={34} color='black' />
            </TouchableOpacity>
            <TouchableOpacity className='p-2'>
              <Ionicons name='chatbubble-outline' size={34} color='black' />
            </TouchableOpacity>
            <TouchableOpacity className='p-2'>
              <Ionicons name='bookmark-outline' size={34} color='black' />
            </TouchableOpacity>
            <TouchableOpacity className='p-2'>
              <Ionicons name='share-outline' size={34} color='black' />
            </TouchableOpacity>
          */}
              <View className='basis-1/2 items-center justify-center'>
                <TouchableOpacity className='items-center justify-center pb-1'
                  // onPress={() => router.push('/(modal)/comment')}
                  onPress={() => setShowComments(true)}
                >
                  <Text className='font-JakartaBold text-lg'>
                    Add a comment
                  </Text>
                </TouchableOpacity>
              </View>
              <View className='flex flex-row basis-1/2 justify-end gap-2 items-center'>
                <TouchableOpacity>
                  <Ionicons name='share-outline' size={34} color='black' />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Ionicons name='heart-outline' size={34} color='black' />
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
      <CommentModal isVisible={showComments} onClose={() => setShowComments(false)} />
    </>
  )
}

Image.prefetch([blurhash])

export default ReelsItem
