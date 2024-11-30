import { Text, View, SafeAreaView, Alert } from 'react-native'
import { useState } from 'react'
import { Link, router } from 'expo-router'
import InputField from '@/components/InputField'
import CustomButton from '@/components/CustomButton'
import { useAuth } from '@/context/auth'
const SignUp = () => {
  const { signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
  })

  // const handleInputChange = (field: keyof typeof form) => (value: string) => {
  //   setFormData(prev => ({ ...prev, [field]: value }))
  //   // Clear error when user starts typing
  //   if (error) setError('')
  // }

  const validateForm = () => {
    if (!form.email || !form.password || !form.username) {
      setError('All fields are required')
      return false
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email address')
      return false
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return false
    }
    return true
  }

  const handleSignUp = async () => {
    try {
      if (!validateForm()) return

      setIsLoading(true)
      setError('')

      const result = await signUp({
        email: form.email,
        password: form.password,
        passwordConfirm: form.password,
        username: form.username,
      })

      if (result.success) {
        console.log('Account created successfully')
        router.replace('/(root)/(tabs)/home')
      } else {
        setError(result.error || 'Failed to create account')
        Alert.alert('Sign Up Error', result.error || 'Failed to create account')
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setError('An unexpected error occurred')
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView className='flex-1 items-center bg-white'>
      <Text className='font-JakartaBold text-2xl'>Create your account</Text>

      <View className='p-10 w-full'>
        {error ? (
          <Text className='text-red-500 text-center mb-4'>{error}</Text>
        ) : null}

        <InputField
          label='Name'
          placeholder='Enter name'
          value={form.username}
          // onChangeText={handleInputChange('username')}
          onChangeText={(value) => setForm({ ...form, username: value })}
          autoCapitalize='words'
          editable={!isLoading}
        />

        <InputField
          label='Email'
          placeholder='Enter email'
          value={form.email}
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
          // onChangeText={handleInputChange('password')}
          onChangeText={(value) => setForm({ ...form, password: value })}
          secureTextEntry
          textContentType='newPassword'
          autoComplete='password-new'
          editable={!isLoading}
        />

        <CustomButton
          title={isLoading ? 'Creating Account...' : 'Sign Up'}
          onPress={handleSignUp}
          disabled={isLoading}
          className='items-center mt-4'
        />

        <Link
          href='/(auth)/sign-in'
          className='text-lg text-center text-general-200 mt-10'
        >
          <Text> Already have an account?{' '} </Text>
          <Text className='text-primary-500'>Log In</Text>
        </Link>
      </View>
    </SafeAreaView>
  )
}

export default SignUp
