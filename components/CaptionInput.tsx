import React from "react"
import {
  View, TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native"

const CaptionInput = React.memo(({ caption, setCaption, isUploading }: {
  caption: string;
  setCaption: (text: string) => void;
  isUploading: boolean;
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // Adjust this value as needed
      className='absolute bottom-2 w-full'
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className='items-center'>
          <TextInput
            className='bg-black/50 w-1/2 h-[44px] rounded-3xl items-center justify-center text-gray-200 tex-xl'
            placeholder='Add a caption'
            placeholderTextColor="gray"
            textAlign='center'
            value={caption}
            onChangeText={setCaption}
            editable={!isUploading}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
});

export default CaptionInput
