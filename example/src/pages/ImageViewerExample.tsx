import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ImageViewer } from 'react-native-maui';

interface ImageViewerExampleProps {}

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
];

const ImageViewerExample: React.FC<ImageViewerExampleProps> = (props) => {
  const {} = props;

  return (
    <View style={styles.container}>
      <ImageViewer
        data={card}
        renderItem={(item) => {
          return (
            <Image
              source={item.source}
              style={styles.image}
              resizeMode={'cover'}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 150,
    height: 150,
    margin: 10,
  },
});

export default ImageViewerExample;
