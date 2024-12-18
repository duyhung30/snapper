import { ImageStyle } from 'expo-image'
import { StyleProp, TextInputProps, TouchableOpacityProps } from 'react-native'

declare interface ButtonProps extends TouchableOpacityProps {
  title: string
  bgVariant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'success'
  textVariant?: 'primary' | 'default' | 'secondary' | 'danger' | 'success'
  IconLeft?: React.ComponentType<any>
  IconRight?: React.ComponentType<any>
  className?: string
}

declare interface InputFieldProps extends TextInputProps {
  label?: string
  icon?: any
  secureTextEntry?: boolean
  labelStyle?: string
  containerStyle?: string
  inputStyle?: string
  iconStyle?: string
  className?: string
}

declare interface AvatarProps {
  size?: number
  userId?: string
  // className?: string
  styles?: StyleProp<ImageStyle>
}


declare interface User {
  id: string
  username: string
  email: string
  avatar: string
}

declare interface Like {
  id: string
  post: string
  author: string
  expand?: {
    author?: {
      id: string
      username: string
      avatar: string
    }
    post?: {
      id: string
    }
  }
}

declare interface Post {
  id: string
  caption: string
  image: string
  author_id: string
  likes_count?: number // Optional total likes count
  expand?: {
    author_id: {
      id: string
      username: string
      avatar: string
    }
    likes?: Like[] // Array of like records
  }
  // comments: number; // Hoặc kiểu dữ liệu phù hợp
  // likes: number;    // Hoặc kiểu dữ liệu phù hợp
}

declare interface Comment {
  id: string
  text: string
  author: string
  post: string
  created: string

  expand?: {
    author?: {
      id: string
      username: string
      avatar: string
    }
    post?: {
      id: string
    }
  }
}

declare interface Message {
  id: string
  text: string
  sender: string
  receiver: string
  created: string

  expand?: {
    sender?: {
      id: string
      username: string
      avatar: string
    }
    receiver?: {
      id: string
      username: string
      avatar: string
    }
  }
}

// declare interface AvatarStore {
//   avatarUrl: string | null
//   setAvatarUrl: (url: string) => void
// }

declare interface AvatarStore {
  avatars: Record<string, string>;  // Map of userId to avatar URL
  getAvatarUrl: (userId: string) => string | null;
  setAvatarUrl: (userId: string, url: string) => void;
  clearAvatars: () => void;
}
