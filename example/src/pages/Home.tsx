import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { navigate } from '../navigate';

import { exampleList } from '../thumbnail';

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
        testID="EXAMPLE-FLAT-LIST"
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        data={exampleList}
        keyExtractor={(_, index) => `example_${index}`}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              testID={`Navigate-Button-${item.title}`}
              style={[
                styles.listItem,
                { backgroundColor: theme.cardBackgroundColor },
              ]}
              onPress={() => {
                navigate(`${item.title}Example`);
              }}
            >
              <Text
                style={[styles.listItemText, { color: theme.cardTitleColor }]}
              >
                {item.title}
              </Text>
              <Text style={{ color: theme.clickTextColor }}>›</Text>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => (
          <View
            style={[
              styles.separator,
              { backgroundColor: theme.backgroundColor },
            ]}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingTop: 10,
    paddingBottom: 100,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 10,
  },
});
