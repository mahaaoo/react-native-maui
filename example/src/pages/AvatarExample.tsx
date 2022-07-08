import * as React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Avatar } from 'react-native-maui';
import Section from '../components/Section';

export default function AvatarExample() {
  return (
    <View style={styles.container}>
      <Section title="基础用法">
        <Avatar
          style={styles.avatar1}
          url={
            'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'
          }
        />
        <Avatar
          style={styles.avatar2}
          url={
            'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'
          }
        />
      </Section>
      <Section title="占位视图">
        <Avatar
          style={styles.avatar3}
          url={
            'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'
          }
          placeholder={<Text>加载中</Text>}
        />
        <Avatar
          style={styles.avatar4}
          url={
            'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'
          }
          placeholder={<ActivityIndicator />}
        />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar1: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
  avatar2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  avatar3: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginHorizontal: 10,
  },
  avatar4: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
  },
});
