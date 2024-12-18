import { Stack, Tabs } from 'expo-router'
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs'
import { withLayoutContext } from 'expo-router'
import { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { View, SafeAreaView, StyleSheet } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'

const { Navigator } = createMaterialTopTabNavigator()

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator)

export default function TabsLayout() {
  return (
    <SafeAreaView className='flex-1 bg-[#181614]'>
      <MaterialTopTabs
        // className='mt-10'
        tabBarPosition='bottom'
        screenOptions={{
          // tabBarShowLabel: false,
          tabBarStyle: {
            paddingBottom: 20,
            display: 'none'
          },
          tabBarIndicatorStyle: {
            backgroundColor: 'black',
            // position: 'absolute',
            // top: 0,
            position: 'relative',
            // height: 3,
          },
          // tabBarGap: 5,
        }}
      >
        <MaterialTopTabs.Screen
          name='profile'
          options={{
            tabBarShowLabel: false,
            tabBarIconStyle: {
              height: 30,
              width: 30,
            },
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              // focused ? <FontAwesome name="user" size={26} color="black" /> : <FontAwesome name="user-o" size={24} color="black" />
              focused ? <Ionicons name="person" size={30} color="black" /> : <Ionicons name="person-outline" size={30} color="black" />
              // focused ? <Octicons name="person-fill" size={24} color="black" /> :<Octicons name="person" size={24} color="black" />
              // <Feather name="user" size={24} color="black" />
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name='home'
          options={{
            tabBarShowLabel: false,
            tabBarIconStyle: {
              height: 30,
              width: 30,
            },
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              // <Feather name="home" size={24} color="black" />
              focused ? <Ionicons name="home" size={30} color="black" /> : <Ionicons name="home-outline" size={30} color="black" />
            )
          }}
        />
        <MaterialTopTabs.Screen
          name='(chat)'
          options={{
            tabBarShowLabel: false,
            tabBarIconStyle: {
              height: 30,
              width: 30,
            },
            tabBarIcon: ({ focused }: { focused: boolean }) => (
              // <Feather name='message-circle' size={27} color='black' />
              // <Feather name="message-square" size={24} color="black" />
              focused ? <Ionicons name="chatbubble-sharp" size={30} color="black" /> : <Ionicons name="chatbubble-outline" size={30} color="black" />
            ),
          }}
        />
      </MaterialTopTabs>
    </SafeAreaView>

    // <Tabs screenOptions={{ headerShown: false }}>
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       // title: "profile",
    //       tabBarShowLabel: false,
    //       headerShown: false,
    //       tabBarIcon: ({ focused }: { focused: boolean }) => (
    //         focused ? <Ionicons name="person" size={30} color="black" /> : <Ionicons name="person-outline" size={30} color="black" />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="home"
    //     options={{
    //       // title: "home",
    //       tabBarShowLabel: false,
    //       headerShown: false,
    //       tabBarIcon: ({ focused }: { focused: boolean }) => (
    //         focused ? <Ionicons name="home" size={30} color="black" /> : <Ionicons name="home-outline" size={30} color="black" />
    //       )
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="chat"
    //     options={{
    //       // title: "chat",
    //       tabBarShowLabel: false,
    //       headerShown: false,
    //       tabBarIcon: ({ focused }: { focused: boolean }) => (
    //         focused ? <Ionicons name="chatbubble-sharp" size={30} color="black" /> : <Ionicons name="chatbubble-outline" size={30} color="black" />
    //       ),
    //     }}
    //   />
    // </Tabs>
  )
}

const styles = StyleSheet.create({
  indicator: {
    backgroundColor: 'black',
  },
})
