import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ModalLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='camera' options={{
        presentation: 'modal',
        animation: 'slide_from_bottom',
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
          height: '90%',
        }
      }} />
    </Stack>
  )
}

export default ModalLayout
