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

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

console.log(windowWidth)

const ImageReels = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  // const [showFooter, setShowFooter] = useState(false)

  const flatListRef = useRef<FlatList>(null)

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        const index = viewableItems[0].index;
        setCurrentIndex(index !== null ? index : 0);
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
        data={ImageData} // Data for FlatList
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
