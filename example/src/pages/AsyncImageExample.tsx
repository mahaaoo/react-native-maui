import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AsyncImage } from 'react-native-maui';

interface AsyncImageExampleProps {}

const getImageUrl = () => {
  const height = Math.round(Math.random() * (500 - 100) + 100);
  return `https://picsum.photos/200/${height}/?random`;
};

const randomUrl = getImageUrl();

const AsyncImageExample: React.FC<AsyncImageExampleProps> = () => {
  return (
    <View>
      <AsyncImage url={randomUrl} />
      <AsyncImage url={randomUrl} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
});

export default AsyncImageExample;
