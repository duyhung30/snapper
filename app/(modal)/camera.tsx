import {
  SafeAreaView,
  View,
  Text,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { Image } from 'expo-image'
import {
  CameraView,
  CameraType,
  CameraCapturedPicture,
  CameraPictureOptions,
  useCameraPermissions,
} from 'expo-camera'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated'
import { router } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useState, useRef } from 'react'
import { useAuth } from '@/context/auth'
import CustomAlert from '@/components/CustomAlert'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

const CameraModal = () => {
  const [facing, setFacing] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions()
  //preview and captured image
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] =
    useState<CameraCapturedPicture | null>()
  const [isLoading, setIsLoading] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'success' as 'success' | 'error' | 'warning',
    title: '',
    message: '',
  })
  const cameraRef = useRef<CameraView>(null)

  const { updateUserAvatar } = useAuth()

  const rotation = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    }
  })

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'))
    rotation.value = withSpring(rotation.value + 180, {
      damping: 20,
      stiffness: 90,
      restSpeedThreshold: 2,
    })
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options: CameraPictureOptions = {
          quality: 0,
          base64: true,
          skipProcessing: true,
          exif: false,
          mirror: true,
          shutterSound: false,
        }
        let photo = await cameraRef.current.takePictureAsync(options)
        setPreviewVisible(true)
        setCapturedImage(photo)
        console.log('Photo data', photo?.uri)
        // setImageUri(photo?.uri || '')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    // setImageUri(null)
  }

  const saveImage = async () => {
    if (!capturedImage?.uri) return

    setIsLoading(true)
    try {
      await updateUserAvatar(capturedImage.uri)
      setAlertConfig({
        visible: true,
        type: 'success',
        title: 'Success!',
        message: 'Profile picture updated successfully.',
      })
      // Wait for the alert to be dismissed before routing back
      setTimeout(() => {
        router.back()
      }, 1500)
    } catch (error) {
      console.error('Error saving image:', error)
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to update profile picture. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!permission) {
    // Camera permissions are still loading.
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className='flex flex-1 justify-start items-center h-full'>
        <Text className='text-center'>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title='grant permission' />
      </View>
    )
  }

  return (
    <>
      <View>
        {/* <Text> Camera Modal </Text> */}
        {/* <View> */}
        {/*   <CameraView */}
        {/*     ref={cameraRef} */}
        {/*     style={{ width: windowWidth, height: windowHeight * 0.78 }} */}
        {/*     facing={facing} */}
        {/*     autofocus={'on'} */}
        {/*   /> */}
        {/*   <View className='flex flex-row items-center justify-around'> */}
        {/*     <TouchableOpacity onPress={() => router.back()}> */}
        {/*       <Ionicons name='close' size={44} color='black' /> */}
        {/*     </TouchableOpacity> */}
        {/**/}
        {/*     <TouchableOpacity onPress={takePicture}> */}
        {/*       <Ionicons name='radio-button-on-sharp' size={90} color='black' /> */}
        {/*     </TouchableOpacity> */}
        {/**/}
        {/*     <TouchableOpacity onPress={toggleCameraFacing}> */}
        {/*       <Animated.View style={animatedStyle}> */}
        {/*         <Ionicons name='sync-sharp' size={44} color='black' /> */}
        {/*       </Animated.View> */}
        {/*     </TouchableOpacity> */}
        {/*   </View> */}
        {/* </View> */}

        {!previewVisible ? (
          <>
            <View className='flex flex-col h-full bg-black'>
              {/* Top Section - Header */}
              <View className='h-[12%]'></View>

              {/* Middle Section - Camera View */}
              <View className=''>
                <CameraView
                  ref={cameraRef}
                  style={{ width: windowWidth, height: windowHeight * 0.6 }}
                  facing={facing}
                  autofocus={'on'}
                />
              </View>

              {/* Bottom Section - Controls */}
              <View className='h-[20%] w-full flex-row justify-around items-center'>
                <TouchableOpacity onPress={() => router.back()}>
                  <Ionicons name='close' size={44} color='white' />
                </TouchableOpacity>

                <TouchableOpacity onPress={takePicture}>
                  <Ionicons
                    name='radio-button-on-sharp'
                    size={90}
                    color='white'
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={toggleCameraFacing}>
                  <Ionicons name='sync-sharp' size={44} color='white' />
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <View className='flex flex-col h-full bg-black'>
              <View className='h-[12%]'></View>
              <View className='relative'>
                <Image
                  source={{ uri: capturedImage?.uri }}
                  style={{ width: windowWidth, height: windowHeight * 0.6 }}
                  contentFit='cover'
                  transition={150}
                  cachePolicy='memory-disk'
                  recyclingKey={capturedImage?.uri}
                  priority='high'
                />
                {/* {isLoading && (
                  <View className="absolute items-center justify-center">
                    <ActivityIndicator size="large" style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }} color="#ffffff" />
                  </View>
                )} */}
                {isLoading && (
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut}
                    className='absolute inset-0 items-center justify-center bg-black/30'
                    style={{ width: windowWidth, height: windowHeight * 0.6 }}
                  >
                    <ActivityIndicator
                      size='large'
                      style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
                      color='#ffffff'
                    />
                  </Animated.View>
                )}
              </View>
              <View className='h-[20%] w-full flex-row justify-around items-center'>
                <TouchableOpacity onPress={retakePicture} disabled={isLoading}>
                  {/* <Text className={`font-JakartaSemiBold text-xl ${isLoading ? 'text-gray-400' : 'text-white'}`}> */}
                  {/*   Retake */}
                  {/* </Text> */}
                  <Ionicons name='close' size={54} color='white' />
                </TouchableOpacity>

                <TouchableOpacity onPress={saveImage} disabled={isLoading}>
                  {/* <Text className={`font-JakartaSemiBold text-xl ${isLoading ? 'text-gray-400' : 'text-white'}`}> */}
                  {/*   Save */}
                  {/* </Text> */}
                  <Ionicons name='save' size={44} color='white' />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </>
  )
}
export default CameraModal
