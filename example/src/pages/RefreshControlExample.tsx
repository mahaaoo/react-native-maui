import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { RefreshContainer, NormalControl } from 'react-native-maui';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useHeaderHeight } from '@react-navigation/elements';

const { width, height } = Dimensions.get('window');

interface RefreshControlExampleProps {}

const RefreshControlExample: React.FC<RefreshControlExampleProps> = (props) => {
  const {} = props;
  const [refresh, setFresh] = useState(false);

  // const insets = useSafeAreaInsets();
  // const headerHeight = useHeaderHeight();

  return (
    <RefreshContainer
      refreshing={refresh}
      refreshComponent={<NormalControl position="top" />}
      loadComponent={<NormalControl position="bottom" />}
      onRefresh={() => {
        setFresh(true);
        console.log('下拉刷新');
        setTimeout(() => {
          setFresh(false);
        }, 2000);
      }}
      handleOnLoadMore={() => {
        setFresh(true);
        console.log('上拉加载');
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
    height: 500,
    backgroundColor: 'pink',
  },
  item2: {
    width,
    height: 500,
    backgroundColor: 'orange',
  },
  item3: {
    width,
    height: 500,
    backgroundColor: 'pink',
  },
});

export default RefreshControlExample;
