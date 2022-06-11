import React, { useCallback, useEffect, useRef } from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Dimensions} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { OpacityContainer, useOverlay } from '../components/Overlay';
import {ImageViewer} from '../components/ImageViewer'

const {width: Width, height: Height} = Dimensions.get('window');

interface ImageViewerExampleProps {
};

const card = [
  {
    source: require('../../assets/a.jpg'),
  },
  {
    source: require('../../assets/b.jpg'),
  },
  {
    source: require('../../assets/c.jpg'),
  },
  {
    source: require('../../assets/d.jpg'),
  },
]

type Position = {
  height: number,
  width: number,
  x: number,
  y: number,
}

const ImageViewerExample: React.FC<ImageViewerExampleProps> = props => {
  const {} = props;

  return (
    <View style={styles.container}>
      <ImageViewer
        data={card}
        renderItem={(item, index) => {
          return <Image source={item.source} style={{ width: 150, height: 150, margin: 10 }} resizeMode={"cover"} />
        }}
      />
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default ImageViewerExample;
