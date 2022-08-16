import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { RefreshContainer, NormalControl } from 'react-native-maui';

const { width, height } = Dimensions.get('window');

interface RefreshControlExampleProps {}

const RefreshControlExample: React.FC<RefreshControlExampleProps> = (props) => {
  const {} = props;
  const [refresh, setFresh] = useState(false);

  return (
    <RefreshContainer
      refreshing={refresh}
      refreshControl={<NormalControl />}
      onRefresh={() => {
        setFresh(true);
        console.log('下拉刷新');
        setTimeout(() => {
          setFresh(false);
        }, 2000);
      }}
    >
      <View style={styles.item1} />
      <View style={styles.item2} />
      <View style={styles.item3} />
    </RefreshContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item1: {
    width,
    height,
    backgroundColor: 'pink',
  },
  item2: {
    width,
    height,
    backgroundColor: 'orange',
  },
  item3: {
    width,
    height,
    backgroundColor: 'red',
  },
});

export default RefreshControlExample;
