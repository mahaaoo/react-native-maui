import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { RefreshControl } from 'react-native-maui';

const { width, height } = Dimensions.get('window');

interface RefreshControlExampleProps {}

const RefreshControlExample: React.FC<RefreshControlExampleProps> = (props) => {
  const {} = props;
  const [refresh, setFresh] = useState(false);

  return (
    <RefreshControl
      refreshing={refresh}
      onRefresh={() => {
        setFresh(true);
        console.log('下拉刷新');
        setTimeout(() => {
          setFresh(false);
        }, 2000);
      }}
    >
      <View style={styles.item} />
      <View style={styles.item} />
      <View style={styles.item} />
    </RefreshControl>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    width,
    height,
    backgroundColor: 'pink',
  },
});

export default RefreshControlExample;
