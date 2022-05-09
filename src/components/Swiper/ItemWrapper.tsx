import React, {useState} from 'react';
import { Dimensions, View } from 'react-native';
import Animated, { 
  runOnJS, 
  useAnimatedReaction, 
  useAnimatedStyle,
} from 'react-native-reanimated';
import Pagination from '../Pagination';
import {useItemOffset, useJudgeRange} from './hook';
import { ItemWrapperProps } from './type';

const {width} = Dimensions.get('window');


const ItemWrapper: React.FC<ItemWrapperProps> = props => {
  const {currentIndex, index, translate, renderItem, item, size, options, stepDistance, horizontal} = props;
  const [hidden, setHidden] = useState(false);

  useAnimatedReaction(() => currentIndex.value, () => {
    const isRange = useJudgeRange(index, size, currentIndex.value, options);
    runOnJS(setHidden)(!isRange);
  })

  const style = useAnimatedStyle(() => {
    const itemOffset = useItemOffset(-currentIndex.value, index, size, currentIndex.value, options);
    if (horizontal) {
      return {
        transform: [{
          translateX: translate.value + (itemOffset * size * stepDistance),
        }, {
          translateY: 0,
        }]
      };  
    } else {
      return {
        transform: [{
          translateY: translate.value + (itemOffset * size * stepDistance),
        }, {
          translateX: 0,
        }]
      };  
    } 
  }, [currentIndex, horizontal]);

  if (hidden) {
    // TODO: 需要返回空View，此处暂时简单返回一个空View站位
    // 返回空View需要重新计算排列方式作为feature
    return <View style={{ width: '100%', height: '100%' }} />
  }

  return (
    <Animated.View 
      style={[{width: '100%', height: '100%'}, style]}
    >
      {renderItem && renderItem(item)}
    </Animated.View>
  );};

export default ItemWrapper;
