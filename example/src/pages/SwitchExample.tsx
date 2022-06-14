import React, {useState, useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import {Switch} from '@maui';

export default function SwitchExample() {
  const [on, setOn] = useState(true);
  useEffect(() => {

  })
  return (
    <View style={styles.container}>
      <Switch />
      <Switch activeBackgroundColor={'cyan'} inactiveBackgroundColor={'pink'} />
      <Switch value={on} onChange={(value) => {
        console.log('switch,',value);
      }} />
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
