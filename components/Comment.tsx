import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Modal,
} from 'react-native'
import { useRouter } from 'expo-router'
import { ReactNativeModal } from 'react-native-modal'
import Ionicons from '@expo/vector-icons/Ionicons'

const { height: windowHeight } = Dimensions.get('window')

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const CommentModal = ({ isVisible, onClose }: Props) => {
  const router = useRouter()

  return (
    <ReactNativeModal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection={['down']}
      onSwipeComplete={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={300}
      animationOutTiming={400}
      backdropTransitionInTiming={300}
      backdropTransitionOutTiming={400}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      swipeThreshold={50}
      coverScreen={true}
      propagateSwipe={true}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        backgroundColor: 'transparent',
      }}
      backdropColor='transparent'
    // backdropOpacity={0.5}
    // coverScreen={false}
    >
      <View
        style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: windowHeight * 0.6,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        {/* Handle for pull-down gesture */}
        <View
          style={{
            alignSelf: 'center',
            width: 40,
            height: 4,
            backgroundColor: '#DEDEDE',
            borderRadius: 2,
            marginTop: 8,
            marginBottom: 8,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            Comment section
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name='close' size={34} color='black' />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
        >
          {/* Add your comment section content here */}
          {/* Example content */}
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={{
                padding: 10,
                marginBottom: 10,
                backgroundColor: '#f5f5f5',
                borderRadius: 8,
              }}
            >
              <Text>Comment {i + 1}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ReactNativeModal>

    // <Modal
    //   visible={true}
    //   transparent={true}
    //   animationType="slide"
    //   onRequestClose={() => router.back()}
    //   statusBarTranslucent
    // >
    //   <Pressable
    //     className="flex-1 bg-black/0"
    //     onPress={() => router.back()}
    //   >
    //     <View className="flex-1 justify-end">
    //       <Pressable
    //         className="w-full"
    //         onPress={e => e.stopPropagation()}
    //       >
    //         <View
    //           className="bg-white rounded-t-[20px]"
    //           style={{
    //             height: windowHeight * 0.6,
    //           }}
    //         >
    //           {/* Pull Bar */}
    //           <View className="w-10 h-1 bg-[#DEDEDE] rounded-full self-center mt-2 mb-2" />

    //           {/* Header */}
    //           <View className="flex-row justify-between items-center px-5 mb-2.5">
    //             <Text className="text-lg font-bold">Comment section</Text>
    //             <TouchableOpacity onPress={() => router.back()}>
    //               <Ionicons name="close" size={34} color="black" />
    //             </TouchableOpacity>
    //           </View>

    //           {/* Comments List */}
    //           <ScrollView
    //             className="flex-1"
    //             contentContainerStyle={{ padding: 20 }}
    //           >
    //             {[...Array(20)].map((_, i) => (
    //               <View
    //                 key={i}
    //                 className="p-2.5 mb-2.5 bg-[#f5f5f5] rounded-lg"
    //               >
    //                 <Text>Comment {i + 1}</Text>
    //               </View>
    //             ))}
    //           </ScrollView>
    //         </View>
    //       </Pressable>
    //     </View>
    //   </Pressable>
    // </Modal>
  )
}

export default CommentModal
