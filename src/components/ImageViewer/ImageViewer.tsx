import React, { useCallback, useRef } from 'react';
import {View, StyleSheet} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useOverlay } from '../Overlay';
import ImageContainer, { Position } from './ImageContainer';
import ImageOverlay from './ImageOverlay';

interface ImageViewerProps {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
};

const ImageViewer: React.FC<ImageViewerProps> = props => {
  const {data, renderItem} = props;
  const {add} = useOverlay();
  const positionList = useRef<Position[]>([]);
  const currentIndex = useSharedValue(-1);

  const handlePress = useCallback((index: number) => {
    currentIndex.value = index;
    add(<ImageOverlay positionList={positionList.current} data={data} initialIndex={index} onScroll={(index: number) => {
      currentIndex.value = index;
    }} /> , 'image-viewer');
  }, [])

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <ImageContainer 
            key={`ImageContainer_${index}`} 
            onPress={() => {
              handlePress(index)
            }}
            index={index}
            currentIndex={currentIndex}
            onLayout={(position) => {
              positionList.current.push(position);
            }}
          >
            {renderItem && renderItem(item, index)}
          </ImageContainer>
        )
      })}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
})

export default ImageViewer;
