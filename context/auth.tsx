import { Text } from 'react-native'
import { useSegments, useRouter } from 'expo-router'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { usePocketBase } from './pocketbase'
import { useAvatarStore } from '@/store'

interface User {
  id: string;
  email: string
  password: string
  username?: string
  // Add other user properties as needed
  avatar?: string // Added avatar field
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>
  signUp: (data: SignUpData) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateUserAvatar: (imageUri: string) => Promise<{ success: boolean; error?: string }>

}

interface SignUpData {
  email: string
  password: string
  passwordConfirm: string
  username?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { pb } = usePocketBase()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const segments = useSegments()
  const { setAvatarUrl } = useAvatarStore()

  // Check authentication state when app loads
  useEffect(() => {
    if (pb) {
      const model = pb.authStore.model
      if (model) {
        setUser(
          model
            ? {
              id: model.id,
              email: model.email,
              username: model.username,
              password: model.password,
              avatar: model.avatar,
            }
            : null,
        )
        // Initialize avatar URL if avatar exists
        if (model.avatar) {
          setAvatarUrl(model.id, `https://gate-member.pockethost.io/api/files/users/${model.id}/${model.avatar}`)
        }
      } else {
        setUser(null)
      }

      setIsLoading(false)
    }
  }, [pb])

  // Handle routing based on auth state
  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!user && !inAuthGroup) {
      // Redirect to sign in if user is not authenticated
      router.replace('/(auth)/welcome')
    } else if (user && inAuthGroup) {
      // Redirect to home if user is authenticated
      router.replace('/(root)/(tabs)/home')
    }
  }, [user, segments, isLoading])

  const updateUserAvatar = async (imageUri: string) => {
    try {
      if (!pb || !user) throw new Error('Not authenticated')

      // Create FormData object
      const formData = new FormData()
      formData.append('avatar', {
        uri: imageUri,
        name: 'avatar.jpg',
        type: 'image/jpeg',
      } as any)

      // Update user record in PocketBase
      const updatedRecord = await pb.collection('users').update(user.id, formData)

      // Update local user state with new avatar
      setUser(prev =>
        prev ? {
          ...prev,
          avatar: updatedRecord.avatar,
        } : null
      )


      // setAvatarUrl(`https://gate-member.pockethost.io/api/files/users/${user.id}/${user.avatar}?timestamp=${new Date().getTime()}`)

      setAvatarUrl(user.id, `https://gate-member.pockethost.io/api/files/users/${user.id}/${updatedRecord.avatar}`)

      return { success: true }
    } catch (error) {
      // console.error('Avatar update error:', error)
      console.log('Avatar update error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update avatar',
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      if (!pb) throw new Error('PocketBase not initialized')

      console.log('Attempting to sign in with:', { email }) // Log the email for debugging

      const authData = await pb
        .collection('users')
        .authWithPassword(email, password)

      console.log('Sign in successful:', authData) // Log successful sign-in data

      setUser({
        id: authData.record.id,
        email: authData.record.email,
        username: authData.record.username,
        password: authData.record.password,
        avatar: authData.record.avatar,
      })

      // After successful sign in, set the avatar URL
      if (authData.record.avatar) {
        setAvatarUrl(authData.record.id, `https://gate-member.pockethost.io/api/files/users/${authData.record.id}/${authData.record.avatar}`)
      }

      return { success: true }
    } catch (error) {
      // console.error('Sign in error:', error)
      console.log('Sign in error:', error)
      // setErrorMessage(
      //   error instanceof Error ? error.message : 'Failed to sign in account',
      // )
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign in',
      }
    }
  }

  const signUp = async ({
    email,
    password,
    passwordConfirm,
    username,
  }: SignUpData) => {
    try {
      if (!pb) throw new Error('PocketBase not initialized')

      const userData = {
        email,
        password,
        passwordConfirm,
        username: username || '',
        emailVisibility: true,
      }

      // Create the user
      const record = await pb.collection('users').create(userData)
      console.log('User created:', record)

      // Automatically sign in after creation
      await signIn(email, password)

      // const authData = await pb
      //   .collection('users')
      //   .authWithPassword(email, password)

      // setUser({
      //   email: authData.record.email,
      //   name: authData.record.name,
      //   password: authData.record.password,
      // })

      return { success: true }
    } catch (error) {
      // console.error('Sign up error:', error)
      console.log('Sign up error:', error)
      // setErrorMessage(
      //   error instanceof Error ? error.message : 'Failed to create account',
      // )
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create account',
      }
    }
  }

  const signOut = async () => {
    try {
      if (!pb) throw new Error('PocketBase not initialized')

      pb.authStore.clear()
      setUser(null)

      // setAvatarUrl('')
    } catch (error) {
      // console.error('Sign out error:', error)
      console.log('Sign out error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateUserAvatar,
    }}>
      {/*
        {errorMessage && (
        <Text style={{ color: '#e74c3c', fontSize: 14 }}>{errorMessage}</Text>
      )}
      */}
      {children}
    </AuthContext.Provider>
  )
}
