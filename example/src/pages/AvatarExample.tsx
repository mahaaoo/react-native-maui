import * as React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import {Avatar} from '@maui';

export default function AvatarExample() {
  return (
    <View style={styles.container}>
      <Avatar
        style={{ width: 60, height: 60 }}
        url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
      />
      <Avatar
        style={{ width: 60, height: 60, borderRadius: 30 }}
        url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
      />
      <Avatar
        style={{ width: 60, height: 60, borderRadius: 30 }}
        url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
        placeholder={<Text>加载中</Text>}
      />
      <Avatar
        style={{ width: 60, height: 60 }}
        url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
        placeholder={<ActivityIndicator />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
});
