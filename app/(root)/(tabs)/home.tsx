// import React from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
// import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler'
// import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import ImageReels from '@/components/ImageReels'
// import Camera from '@/components/Camera'
import CustomHeader from '@/components/CustomHeader'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

const Home = () => {

  return (
    <View style={{ flex: 1 }} >
      {/* <Camera /> */}
      {/* 
      */}
        <CustomHeader />
      <ImageReels />
    </View>
  )
}

export default Home
