import React, { useRef, useState, useMemo, useEffect } from 'react'
import {
  ViewToken,
  SafeAreaView,
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native'
// import { FlashList } from '@shopify/flash-list'

import { ImageData } from '@/data/SliderData'
import ReelsItem from './ReelsItem'
import Camera from './Camera'
import ReelsFooter from './ReelsFooter'
import { usePocketBase } from '@/context/pocketbase'
import { RecordModel } from 'pocketbase'
import { Post } from '@/types/type'
import { UnsubscribeFunc } from 'pocketbase'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

console.log(windowWidth)

const ImageReels = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const [posts, setPosts] = useState<Post[]>()
  const [isLoading, setIsLoading] = useState(true)

  const { pb } = usePocketBase()

  const fetchPosts = async () => {
    try {
      const records = await pb?.collection('posts').getFullList<Post>(200, {
        sort: '-created',
        // expand: 'author_id, likes(post)',
        expand: 'author_id',
      })
      // For each post, get the likes count
      const postsWithLikes = await Promise.all(
        records?.map(async (post) => {
          const likesCount = await pb?.collection('likes').getList(1, 1, {
            filter: `post="${post.id}"`,
            $autoCancel: false,
          });

          return {
            ...post,
            likes_count: likesCount?.totalItems || 0,
          };
        }) || []
      );
      setPosts(postsWithLikes)

      // Setup real-time subscription for Posts
      // unsubscribePosts = await pb?.collection('posts').subscribe('*', async ({ action, record }) => {
      //   if (action === 'create') {
      //     try {
      //       const newPost = await pb?.collection('posts').getOne<Post>(record.id, {
      //         expand: 'author_id',
      //       })
      //       // this make the new post appear at the top of the list(bottom of the feed screen)
      //       // setPosts((prevPosts) => [...(prevPosts || []), newPost])
      //       setPosts(prevPosts => [newPost, ...(prevPosts || [])])
      //       console.log('New post added:', newPost)
      //     } catch (error) {
      //       console.error('Error fetching new post:', error)
      //     }
      //   }
      // })
    } catch (error) {
      // console.error('Error fetching posts:', error)
      console.log('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }
  // Fetch posts when component mounts
  useEffect(() => {
    // let unsubscribe: UnsubscribeFunc | undefined
    let unsubscribePosts: UnsubscribeFunc | undefined
    let unsubscribeLikes: UnsubscribeFunc | undefined

    fetchPosts()

    const subscribeToChanges = async () => {
      unsubscribePosts = await pb
        ?.collection('posts')
        .subscribe('*', async ({ action, record }) => {
          if (action === 'create') {
            try {
              const newPost = await pb
                ?.collection('posts')
                .getOne<Post>(record.id, {
                  // expand: 'author_id, likes(post)',
                  expand: 'author_id', // Expand author and likes
                })
              // Ensure the new post starts with a correct like count
              const initialLikesCount = newPost?.likes_count || 0 // Default to 0 if no likes
              setPosts((prevPosts) => [
                { ...newPost, likes_count: initialLikesCount },
                ...(prevPosts || []),
              ])

              // Get initial likes count for the new post
              // const likesCount = await pb
              //   ?.collection('likes')
              //   .getList(1, 1, {
              //     filter: `post="${record.id}"`,
              //     $autoCancel: false,
              //   });

              // // Add the new post with likes count to the state
              // setPosts((prevPosts) => [
              //   { ...newPost, likes_count: likesCount?.totalItems || 0 },
              //   ...(prevPosts || []),
              // ]);
              console.log('New post added:', newPost)
            } catch (error) {
              // console.error('Error fetching new post:', error)
              console.log('Error fetching new post:', error)
            }
          }
        })

      // Setup real-time subscription for Likes
      unsubscribeLikes = await pb
        ?.collection('likes')
        .subscribe('*', async ({ action, record }) => {
          if (action === 'create' || action === 'delete') {
            // Update likes count for the associated post
            const postId = record.post // Assuming the like record has a reference to the post

            const newLikesCount = await pb
              ?.collection('likes')
              .getList(1, 1, {
                filter: `post="${postId}"`,
                $autoCancel: false,
              });

            setPosts((prevPosts) =>
              prevPosts?.map((post) =>
                post.id === postId
                  ? { ...post, likes_count: newLikesCount?.totalItems || 0 }
                  : post
              )
            );
          }
        });

      //     setPosts((prevPosts) =>
      //       prevPosts?.map((post) => {
      //         if (post.id === postId) {
      //           const newLikesCount =
      //             action === 'create'
      //               ? (post.likes_count || 0) + 1
      //               : (post.likes_count || 0) - 1
      //           return { ...post, likes_count: newLikesCount }
      //         }
      //         return post
      //       }),
      //     )
      //     console.log(
      //       `${action === 'create' ? 'Like added' : 'Like removed'} for post ID: ${postId}`,
      //     )
      //   }
      // })
    }
    subscribeToChanges()

    return () => {
      unsubscribePosts?.()
      unsubscribeLikes?.()
    }

    // // Cleanup subscription
    // return () => {
    //   // if (unsubscribe) {
    //   //   unsubscribe() // Call unsubscribe if it's defined
    //   // }
    //   if (unsubscribePosts) {
    //     unsubscribePosts(); // Call unsubscribe for posts
    //   }
    //   if (unsubscribeLikes) {
    //     unsubscribeLikes(); // Call unsubscribe for likes
    //   }
    // }
  }, [pb])

  const flatListRef = useRef<FlatList>(null)

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        const index = viewableItems[0].index
        setCurrentIndex(index !== null ? index : 0)
      }
    },
  ).current

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
    // minimumViewTime: 100,
  }

  const getItemLayout = (_: any, index: number) => ({
    length: windowHeight,
    offset: windowHeight * (index ?? 0),
    index,
  })

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({
      offset: 0, // This will scroll to the very top (Camera view)
      animated: true,
    })
  }

  const renderItem = ({ item, index, onPress, ...props }: any) => (
    <View>
      <ReelsItem item={item} index={index} onPress={scrollToTop} {...props} />
    </View>
  )

  // use this to optimize performance by memoizing expensive computations.
  // does not re-render the component after every scrolled image
  const renderListHeaderComponent = useMemo(() => {
    return (
      <View style={{ height: windowHeight }}>
        <Camera />
      </View>
    )
  }, [])

  return (
    //   <FlatList
    //     data={ImageData} // Data for FlatList
    //     renderItem={renderItem} // Render each image
    //     style={{ width: windowWidth, paddingTop: 20 }}
    //     ListHeaderComponent={rederListHeaderComponent}
    //     keyExtractor={(item, index) => index.toString()} // Unique key for each item
    //     horizontal={false} // Scroll horizontally
    //     pagingEnabled={true} // Snap to each image
    //     showsVerticalScrollIndicator={false}
    //     snapToInterval={windowHeight}
    //     snapToAlignment="start"
    //     decelerationRate="fast"
    //     // invertStickyHeaders={true}
    //     stickyHeaderHiddenOnScroll={true}
    //     minimumZoomScale={2}
    //     removeClippedSubviews={true} //property unloads off-screen views, freeing up resources.
    //     getItemLayout={getItemLayout}
    //     scrollEventThrottle={8}
    //     viewabilityConfig={viewabilityConfig}
    //     // onViewableItemsChanged={viewAbilityConfigCallbackPairs.current}
    //     onViewableItemsChanged={onViewableItemsChanged}
    //     maxToRenderPerBatch={5}
    //     windowSize={5}
    //   />
    <View className='flex-1 items-center'>
      <FlatList
        ref={flatListRef}
        data={posts} // Data for FlatList
        renderItem={renderItem} // Render each image
        contentContainerStyle={{ paddingTop: 20 }}
        ListHeaderComponent={renderListHeaderComponent}
        // ListFooterComponent={renderListFooterComponent}
        keyExtractor={(item, index) => index.toString()} // Unique key for each item
        horizontal={false} // Scroll horizontally
        pagingEnabled={true} // Snap to each image
        showsVerticalScrollIndicator={false}
        snapToInterval={windowHeight}
        snapToAlignment='start'
        decelerationRate='fast'
        stickyHeaderHiddenOnScroll={true}
        minimumZoomScale={2}
        removeClippedSubviews={true} //property unloads off-screen views, freeing up resources.
        scrollEventThrottle={8}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
      // estimatedItemSize={200}
      />
      {/* { showFooter && <ReelsFooter onPress={scrollToTop} />} */}
    </View>
  )
}

export default ImageReels
