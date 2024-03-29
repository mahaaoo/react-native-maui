import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { RefreshList, RefreshState } from 'react-native-maui';

const { width } = Dimensions.get('window');

interface RefreshProps {}

const mockArray = (count: number): number[] => {
  const data = new Array(count).fill(0);
  const randomIndex = Math.floor(Math.random() * 100);
  for (let index = 0; index < data.length; index++) {
    data[index] = randomIndex + index;
  }
  return data;
};

const Refresh: React.FC<RefreshProps> = () => {
  const [data, setData] = useState<number[]>([]);
  const [status, setStatus] = useState<RefreshState>(RefreshState.Idle);

  useEffect(() => {
    const list = mockArray(20);
    setData(list);
  }, []);

  return (
    <View style={styles.container}>
      <RefreshList
        refreshState={status}
        data={data}
        onRefresh={() => {
          setStatus(RefreshState.HeaderRefreshing);
          setTimeout(() => {
            const list = mockArray(20);
            setData(list);
            setStatus(RefreshState.Idle);
          }, 2000);
        }}
        onFooterRefresh={() => {
          setStatus(RefreshState.FooterRefreshing);
          setTimeout(() => {
            const list = mockArray(2);
            setData((data) => data.concat(list));
            setStatus(RefreshState.Idle);
          }, 2000);
        }}
        renderItem={({ item }) => {
          return (
            <View style={styles.item}>
              <Text>{item}</Text>
            </View>
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
  item: {
    width,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
});

export default Refresh;
