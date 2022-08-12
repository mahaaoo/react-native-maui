import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { navigate } from '../navigate';

import Card from '../components/Card';
import { exampleList } from './thumbnail';

import { useTheme } from 'react-native-maui';
import WaterMark from '../components/WaterMark';

export default function ComponentScreen() {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <WaterMark />
      <FlatList
        style={styles.flatList}
        data={exampleList}
        numColumns={2}
        keyExtractor={(_, index) => `example_${index}`}
        renderItem={({ item }) => {
          return (
            <Card
              title={item.title}
              style={styles.card}
              content={
                item.content ? (
                  item.content
                ) : (
                  <Text style={{ color: theme.cardTitleColor }}>
                    {item.title}
                  </Text>
                )
              }
              onPress={() => {
                navigate(`${item.title}Example`);
              }}
            />
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },
  flatList: {
    flex: 1,
  },
  card: {
    margin: 10,
  },
});
