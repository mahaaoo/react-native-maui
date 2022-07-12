import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useTheme, ThemeType, Button } from 'react-native-maui';
import Section from '../components/Section';

export default function ThemeExample() {
  const { theme, changeTheme } = useTheme();
  return (
    <View style={styles.container}>
      <Section title="基础用法">
        <Button
          onPress={() => {
            changeTheme(ThemeType.Default);
          }}
        >
          <Text style={styles.themeTitle}>默认主题</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            changeTheme(ThemeType.Dark);
          }}
        >
          <Text style={styles.themeTitle}>暗色主题</Text>
        </Button>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rect: {
    width: 50,
    height: 50,
  },
  themeTitle: {
    fontSize: 16,
  },
  marginLeft: {
    marginLeft: 15,
  },
});
