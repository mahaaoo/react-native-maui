import React from 'react';
import {View, ScrollView, Text} from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

interface RefreshProps {
};

const data = new Array(100).fill(0);
for (let index = 0; index < data.length; index++) {
  data[index] = 1000+index;  
}

const snapPoints = [0, -50]

const Refresh: React.FC<RefreshProps> = props => {
  const {} = props;
  const y = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // const dest =
      y.value = event.contentOffset.y;
    },
    onEndDrag: (event) => {
      y.value = 50;
    }
  })

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      decelerationRate="fast"
      bounces={false}
      style={{
        transform: [{
          translateY: 50
        }]
      }}
    >
      {
        data.map((item, index) => {
          return (
            <View key={`data${index}`} style={{marginVertical: 10}}>
              <Text>{item}</Text>
            </View>
          )
        })
      }
    </Animated.ScrollView>
  )
};

export default Refresh;
