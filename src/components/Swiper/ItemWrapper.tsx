import React, {useState} from 'react';
import { View } from 'react-native';
import { 
  runOnJS, 
  useAnimatedReaction, 
} from 'react-native-reanimated';
import {useJudgeRange} from './utils';
import { ItemWrapperProps } from './type';

const ItemWrapper: React.FC<ItemWrapperProps> = props => {
  const {currentIndex, index, children, size, options} = props;
  const [hidden, setHidden] = useState(true);

  useAnimatedReaction(() => currentIndex.value, () => {
    const isRange = useJudgeRange(index, size, currentIndex.value, options);
    runOnJS(setHidden)(!isRange);
  })

  if (hidden) {
    // TODO: 需要返回空View，此处暂时简单返回一个空View站位
    // 返回空View需要重新计算排列方式
    return <View style={{ width: '100%', height: '100%' }} />
  }

  return (
    <>
      {children}
    </>
  );
};

export default ItemWrapper;
