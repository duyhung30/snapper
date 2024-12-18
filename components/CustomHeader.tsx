import { View, Text, TouchableOpacity } from 'react-native'
import { Link, router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const CustomHeader = () => {
  return (
    <View
      className='flex-row items-center justify-between ml-3 mr-3 '
      style={{}}
    >
      <Link href={'/(root)/(tabs)/profile'} asChild>
        <TouchableOpacity className='p-3 rounded-full'>
          {/*
          <MaterialIcons name='account-circle' size={34} color='black' />
          */}
          <Ionicons name='person-circle-outline' size={34} color='black' />
        </TouchableOpacity>
      </Link>
      <Link href={'/(root)/(tabs)/(chat)'} asChild>
        <TouchableOpacity className='p-3 rounded-full'>
          {/*
          <MaterialCommunityIcons name='chat-outline' size={34} color='black' />
          */}
          <Ionicons name='chatbubble-outline' size={30} color='black' />
        </TouchableOpacity>
      </Link>
    </View>
  )
}

export default CustomHeader
