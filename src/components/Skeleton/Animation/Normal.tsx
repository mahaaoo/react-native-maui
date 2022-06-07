import React from 'react';
import {View, StyleSheet} from 'react-native';

interface NormalProps {
};

const Normal: React.FC<NormalProps> = props => {
  const {} = props;

  return (
    <View style={styles.mask} />
  )
};

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D8D8D8',
  },
})

export default Normal;
