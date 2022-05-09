import React, {useContext} from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import {ThemeContext, ThemeType} from '../components/Theme';

export default function ThemeExample() {
  const { theme, changeTheme } = useContext(ThemeContext);
  return (
    <View style={styles.container}>
      <View style={{
        width: 50,
        height: 50,
        backgroundColor: theme.themeColor,
      }} />
      <TouchableOpacity onPress={() => {
        changeTheme(ThemeType.Dark);
      }}>
        <Text style={{ marginTop: 20, fontSize: 20 }}>暗色主题</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {
        changeTheme(ThemeType.Default);
      }}>
        <Text style={{ marginTop: 20, fontSize: 20 }}>亮色主题</Text>
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
});
