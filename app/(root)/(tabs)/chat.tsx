import { Link } from 'expo-router';
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
import { Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const Chat = () => {
  return (
    <SafeAreaView style={{
      // backgroundColor: "black",
      height: windowHeight,
      width: windowWidth,
    }}>
      <Text>Chat </Text>
      <Link href={"/(root)/(tabs)/home"} asChild>
        <TouchableOpacity>
          <Text>Go to Home</Text>
        </TouchableOpacity>
      </Link>
      <Link href={"/(chat)/chat"} asChild>
        <TouchableOpacity>
          <Text>Go to chat room</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  )
}

export default Chat
