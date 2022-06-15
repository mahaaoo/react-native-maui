import React, { useEffect, useRef } from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {ImageViewer} from 'maui'

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

const ImageViewerExample: React.FC<ImageViewerExampleProps> = props => {
  const {} = props;
  const refs = useRef<View>();

  useEffect(() => {
    refs.current && refs.current.measure((x, y, width, height, pageX, pageY) => {
      console.log({
        x, y, width, height, pageX, pageY
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <ImageViewer
        data={card}
        renderItem={(item, index) => {
          return <Image source={item.source} style={{ width: 150, height: 150, margin: 10 }} resizeMode={"cover"} />
        }}
      />
      {/* <View 
        style={{
          marginTop: 100,
          marginLeft: 100,
          backgroundColor: 'red',
          width: 150,
          height: 120
        }} 
        ref={(ref) => {
          refs.current = ref;
        }}
      /> */}
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default ImageViewerExample;
