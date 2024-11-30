import { ImageSourcePropType } from "react-native";

export type ImageSliderType = {
  id: number;
  image: ImageSourcePropType;
  description: string;
}

export const ImageData = [
  {
    id: 0,
    image: require('../assets/images/1.jpg'),
    description: 'nothing new',
  },
  {
    id: 1,
    image: require('../assets/images/2.jpg'),
    description: 'nothing new',
  },
  {
    id: 2,
    image: require('../assets/images/3.jpg'),
    description: 'nothing new',
  },
  {
    id: 3,
    image: require('../assets/images/4.jpg'),
    description: 'nothing new',
  },
  {
    id: 4,
    image: require('../assets/images/5.jpg'),
    description: 'nothing new',
  },
]
