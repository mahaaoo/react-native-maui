import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useTheme, ThemeType } from 'react-native-maui';

export default function ThemeExample() {
  const { theme, changeTheme } = useTheme();
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.rect,
          {
            backgroundColor: theme.themeColor,
          },
        ]}
      />
      <TouchableOpacity
        onPress={() => {
          changeTheme(ThemeType.Dark);
        }}
      >
        <Text style={styles.themeTitle}>暗色主题</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          changeTheme(ThemeType.Default);
        }}
      >
        <Text style={styles.themeTitle}>亮色主题</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rect: {
    width: 50,
    height: 50,
  },
  themeTitle: {
    marginTop: 20,
    fontSize: 20,
  },
});
