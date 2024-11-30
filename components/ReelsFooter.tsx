import { TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

interface ReelsFooterProps {
  onPress: () => void;
}

const ReelsFooter = ({ onPress }: ReelsFooterProps) => {
  return (
    <View className="absolute bottom-9">
      <TouchableOpacity className="items-center" onPress={onPress}>
        <Ionicons name="radio-button-on-sharp" size={54} color="black" />
      </TouchableOpacity>
    </View>
  )
}
export default ReelsFooter;
