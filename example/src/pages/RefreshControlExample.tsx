import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { RefreshContainer, NormalControl } from 'react-native-maui';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useHeaderHeight } from '@react-navigation/elements';

const { width, height } = Dimensions.get('window');

interface RefreshControlExampleProps {}

let random = 0;

const RefreshControlExample: React.FC<RefreshControlExampleProps> = (props) => {
  const {} = props;
  const [dataSource, setDataSource] = useState(new Array(3).fill(0));
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
          random = Math.floor(Math.random() * 100);
          setFresh(false);
        }, 2000);
      }}
      handleOnLoadMore={() => {
        setFresh(true);
        console.log('上拉加载');
        setTimeout(() => {
          const newLength = dataSource.length + 1;
          setDataSource(new Array(newLength).fill(0));
          setFresh(false);
        }, 2000);
      }}
    >
      {dataSource.map((item, index) => {
        const backgroundColor = (index & 1) === 0 ? 'pink' : 'orange';
        return (
          <View key={index} style={[styles.item1, { backgroundColor }]}>
            <Text style={styles.title}>{index + random}</Text>
          </View>
        );
      })}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
  },
});

export default RefreshControlExample;
