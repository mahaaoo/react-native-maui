import React, {useState} from 'react';
import { View } from 'react-native';
import { 
  runOnJS, 
  useAnimatedReaction, 
} from 'react-native-reanimated';
import {useJudgeRange} from './hook';
import { ItemWrapperProps } from './type';

const ItemWrapper: React.FC<ItemWrapperProps> = props => {
  const {currentIndex, index, children, size, options} = props;
  const [hidden, setHidden] = useState(false);

  useAnimatedReaction(() => currentIndex.value, () => {
    const isRange = useJudgeRange(index, size, currentIndex.value, options);
    runOnJS(setHidden)(!isRange);
  })

  return (
    <>
      {hidden ? <View /> : children}
    </>
  )
};

export default ItemWrapper;
