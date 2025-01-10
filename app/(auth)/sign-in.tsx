import { Text, View, SafeAreaView, Alert } from 'react-native'
import { useState } from 'react'
import { Link, router } from 'expo-router'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { useAuth } from '@/context/auth'

const SignIn = () => {
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  // const handleInputChange = (field: keyof typeof form) => (value: string) => {
  //   setFormData(prev => ({ ...prev, [field]: value }))
  //   // Clear error when user starts typing
  //   if (error) setError('')
  // }

  const validateForm = () => {
    if (!form.email || !form.password) {
      setError('All fields are required')
      return false
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSignIn = async () => {
    try {
      if (!validateForm()) return

      setIsLoading(true)
      setError('')

      const result = await signIn(form.email, form.password)

      if (result.success) {
        console.log('Signed in successfully')
        router.replace('/(root)/(tabs)/home')
      } else {
        setError(result.error || 'Failed to sign in')
        Alert.alert('Sign In Error', result.error || 'Failed to sign in')
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError('An unexpected error occurred')
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className='flex-1 items-center bg-background-default pt-10'>
      <Text className='font-JakartaBold text-2xl text-foreground-default pt-10'>Welcome Back</Text>

      <View className='p-10 w-full'>
        {error ? (
          <Text className='text-red-500 text-center mb-4'>{error}</Text>
        ) : null}

        <InputField
          label='Email'
          placeholder='Enter email'
          value={form.email}
          placeholderTextColor={'#b3a398'}
          labelStyle='text-foreground-default'
          inputStyle='bg-general-600'
          // onChangeText={handleInputChange('email')}
          onChangeText={(value) => setForm({ ...form, email: value })}
          autoCapitalize='none'
          keyboardType='email-address'
          textContentType='emailAddress'
          autoComplete='email'
          editable={!isLoading}
        />

        <InputField
          label='Password'
          placeholder='Enter password'
          value={form.password}
          placeholderTextColor={'#b3a398'}
          labelStyle='text-foreground-default'
          inputStyle='bg-general-600'
          // onChangeText={handleInputChange('password')}
          onChangeText={(value) => setForm({ ...form, password: value })}
          secureTextEntry={true}
          textContentType='password'
          autoComplete='password'
          editable={!isLoading}
        />

        <CustomButton
          title={isLoading ? 'Signing In...' : 'Sign In'}
          onPress={handleSignIn}
          disabled={isLoading}
          className='items-center mt-4'
        />

        <Link
          href='/(auth)/sign-up'
          className='text-lg text-center text-general-200 mt-10'
        >
          <Text>Don't have an account? </Text>
          <Text className='text-foreground-default'> Sign Up</Text>
        </Link>

        {/* Optional: Add Forgot Password link */}
        {/* <Link
          href='/(auth)/forgot-password'
          className='text-sm text-center text-general-200 mt-4'
        >
          <Text className='text-primary-500'>Forgot Password?</Text>
        </Link> */}
      </View>
    </SafeAreaView>
  )
}

export default SignIn
