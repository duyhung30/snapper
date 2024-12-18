import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { View, Text } from 'react-native'
import PocketBase, { AsyncAuthStore } from 'pocketbase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import eventsource from 'react-native-sse';
// @ts-ignore
global.EventSource = eventsource;
// import { POCKETBASE_URL } from '../config/constants';

interface PocketBaseContextType {
  pb: PocketBase | null
  isConnected: boolean
}

const PocketBaseContext = createContext<PocketBaseContextType>({
  pb: null,
  isConnected: false,
})

export const usePocketBase = () => useContext(PocketBaseContext)

export const PocketBaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pb, setPb] = useState<PocketBase | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  // const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const initializePocketBase = async () => {
      try {
        // console.log('Initializing PocketBase with URL:', POCKETBASE_URL);

        const store = new AsyncAuthStore({
          save: async (serialized) => {
            try {
              await AsyncStorage.setItem('pb_auth', serialized)
              console.log('Auth stored successfully')
            } catch (e) {
              // console.error('Failed to save auth:', e)
              console.log('Failed to save auth:', e)
              // setErrorMessage('Failed to save authentication data.') // Set error message
            }
          },
          initial: (await AsyncStorage.getItem('pb_auth')) || '',
          clear: async () => {
            try {
              await AsyncStorage.removeItem('pb_auth')
              console.log('Auth cleared successfully')
            } catch (e) {
              // console.error('Failed to clear auth:', e)
              console.log('Failed to clear auth:', e)
              // setErrorMessage('Failed to clear authentication data.') // Set error message
            }
          },
        })

        console.log('Creating PocketBase instance...')
        // use ngrok to host the pocketbase server
        const pbInstance = new PocketBase('https://gate-member.pockethost.io/', store);
        // const pbInstance = new PocketBase('http://10.0.2.2:8090', store) //works for android emulator
        // const pbInstance = new PocketBase('https://pocketbase.io', store) //works for android emulator

        // Add this for debugging
        pbInstance.beforeSend = function (url, options) {
          // console.log('Making request to:', url)
          // console.log('Request options:', options)
          return { url, options }
        }

        // Add error listener
        pbInstance.authStore.onChange((auth) => {
          console.log('Auth state changed:', auth)
        })
        // pbInstance.autoCancellation(false) // Disable auto-cancellation if needed

        // Test connection
        // await pbInstance.health.check();
        console.log('PocketBase connection successful')
        setIsConnected(true)
        setPb(pbInstance)
      } catch (error) {
        // console.error('PocketBase initialization failed:', error)
        setIsConnected(false)
        // setErrorMessage('PocketBase initialization failed.') // Set error message
      }
    }

    initializePocketBase()
  }, [])

  return (
    <PocketBaseContext.Provider value={{ pb, isConnected }}>
      {children}
      {/*
      {errorMessage && (
         <View>
           <Text style={{ color: '#e74c3c', fontSize: 14 }}>
             {errorMessage}
           </Text>
         </View>
       )}

      */}
    </PocketBaseContext.Provider>
  )
}
