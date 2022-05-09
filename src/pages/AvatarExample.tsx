import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Avatar from '../components/Avatar';

export default function AvatarExample() {
  return (
    <View style={styles.container}>
      <Avatar
        url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
      />
      <Avatar
        size={60}
        url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
      />
      <Avatar
        square
        size={60}
        url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
      />
      <Avatar
        square
        size={60}
        borderRadius={10}
        url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
      />
      <Avatar
        placeholder={<Text>M</Text>}
      />
      <Avatar
        size={60}
        placeholder={<Text>A</Text>}
      />
      <Avatar
        square
        size={60}      
        placeholder={<Text>U</Text>}
      />
      <Avatar
        square
        size={60}
        borderRadius={10}      
        placeholder={<Text>I</Text>}
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
