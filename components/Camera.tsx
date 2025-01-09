import { CameraView, CameraType, CameraCapturedPicture, CameraPictureOptions, useCameraPermissions } from 'expo-camera'
// import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { useState, useRef } from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  // Image,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native'
import { Image } from 'expo-image'
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePocketBase } from '@/context/pocketbase';
import InputField from './InputField';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window')
// Add blur hash placeholder
const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const Camera = () => {
  const [facing, setFacing] = useState<CameraType>('back')
  const [permission, requestPermission] = useCameraPermissions()
  //preview and captured image
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<CameraCapturedPicture | null>()
  //picked image
  const [pickedImage, setPickedImage] = useState<string | null>(null)
  //caption
  const [caption, setCaption] = useState<string>('')
  // Add a new state for upload status
  const [isUploading, setIsUploading] = useState(false);

  const cameraRef = useRef<CameraView>(null)
  const { pb } = usePocketBase()

  const rotation = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`
        }
      ]
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setPickedImage(result.assets[0].uri)
      setPreviewVisible(true)
      // setImageUri(result.assets[0].uri)
      console.log(result.assets[0].uri)
    }
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
        // //flip the image if the camera is facing front
        // if (photo && facing == 'front') {
        //   photo = await manipulateAsync(
        //     photo.uri,
        //     [
        //       { rotate: 180 },
        //       { flip: FlipType.Vertical },
        //     ],
        //     { compress: 1, format: SaveFormat.JPEG }
        //   );
        // }
        setPreviewVisible(true)
        setCapturedImage(photo)
        setPickedImage(null)
        console.log('Photo data', photo?.uri)
        // setImageUri(photo?.uri || '')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const retakePicture = () => {
    setCapturedImage(null)
    setPickedImage(null)
    setPreviewVisible(false)
    setCaption('')
    // setImageUri(null)
  }

  const uploadPost = async (imageUri: string, caption: string) => {
    // try {
    //   const formData = new FormData();
    //   formData.append('image', {
    //     uri: imageUri,
    //     type: 'image/jpeg | image/png | image/jpg',
    //     // name: 'photo.jpg'
    //   } as any);
    //   formData.append('title', 'Photo from camera');
    //   formData.append('user', pb?.authStore.model?.id);

    //   const record = await pb?.collection('posts').create(formData);
    //   console.log('Upload successful:', record);

    // } catch (error) {
    //   console.error('Error uploading image:', error);
    // }

    try {
      const formData = new FormData();
      // Get the file name and extension
      const fileName = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(fileName);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri: imageUri,
        name: fileName,
        type,
      } as any);

      // Add metadata
      formData.append('caption', caption);
      formData.append('author_id', pb?.authStore.model?.id); // Get current user ID

      const record = await pb?.collection('posts').create(formData, {
        requestKey: null,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', record);
      // return record;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  // Modify the send button press handler
  const handleSend = async () => {
    if (!capturedImage?.uri && !pickedImage) return;

    setIsUploading(true);
    try {
      await uploadPost(pickedImage || capturedImage?.uri || '', caption);
      // Handle successful upload (e.g., navigate away)
      retakePicture(); // Reset the camera view
    } catch (error) {
      console.error('Error handling upload:', error);
      // Show error message to user
    } finally {
      setIsUploading(false);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title='grant permission' />
      </View>
    )
  }

  console.log('im being re-rendered')

  return (
    <View style={styles.container}>
      {!previewVisible ? (
        <>
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
              autofocus={'on'}
            />
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Ionicons name="images" size={40} color="#f3ebe5" />
            </TouchableOpacity>

            <TouchableOpacity onPress={takePicture}>
              <Ionicons name="radio-button-on-sharp" size={110} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCameraFacing}> <Animated.View style={animatedStyle}>
              <Ionicons name="sync-sharp" size={44} color="#f3ebe5" />
            </Animated.View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.cameraContainer}>
            <Image
              source={{ uri: pickedImage || capturedImage?.uri }}
              // source={{ uri: 'data:image/jpg;base64,' + capturedImage?.base64 }}
              style={styles.previewImage}
              placeholder={blurhash}
              contentFit="cover"
              transition={150} // Fast transition
              cachePolicy="memory-disk" // Cache in memory and disk
              recyclingKey={capturedImage?.uri} // Help with image recycling
              priority="high"
            />
            <View className='absolute bottom-2 w-full items-center'>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='absolute bottom-0 w-full items-center'
              >
                <TextInput
                  className='bg-black/50 w-1/2 py-3 rounded-full items-center justify-center font-JakartaSemiBold text-[16px] text-gray-200'
                  placeholder='Add a caption'
                  textAlign='center'
                  value={caption}
                  onChangeText={setCaption}
                  editable={!isUploading}
                  multiline={true}
                // textAlignVertical='center'
                />
              </KeyboardAvoidingView>
            </View>
          </View>

          <View style={styles.controlsContainer} className='mt-4'>
            <TouchableOpacity onPress={retakePicture}>
              <Ionicons name="close" size={44} color="black" />
            </TouchableOpacity>

            {/* <TouchableOpacity className='bg-gray-400 rounded-full' style={{ padding: 15 }} > */}
            {/* <TouchableOpacity className='pl-2 pr-2' >
              <Ionicons name="paper-plane-outline" size={64} color="black" />
            </TouchableOpacity> */}

            <TouchableOpacity
              className='pl-2 pr-2'
              onPress={handleSend}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="large" color="black" />
              ) : (
                <Ionicons name="paper-plane-outline" size={64} color="black" />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleCameraFacing}>
              <Animated.View style={animatedStyle}>
                <Ionicons name="sync-sharp" size={44} color="black" />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: windowHeight,
    // backgroundColor: "#0c0b0a",
    backgroundColor: "#181614",
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    // justifyContent: 'center',
  },
  camera: {
    height: windowWidth,
    width: windowWidth - 3,
  },
  controlsContainer: {
    paddingTop: 20,
    width: windowWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  previewContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
  },
  previewImage: {
    width: windowWidth - 3,
    height: windowWidth,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  retakeButton: {
    width: 130,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  retakeText: {
    color: '#000',
    fontSize: 16,
  },
})

Image.prefetch([blurhash]);

export default Camera
