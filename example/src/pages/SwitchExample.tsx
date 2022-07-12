import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch } from 'react-native-maui';
import Section from '../components/Section';

export default function SwitchExample() {
  useEffect(() => {});
  return (
    <View style={styles.container}>
      <Section title="基础用法">
        <Switch />
      </Section>
      <Section title="自定义样式">
        <Switch
          activeBackgroundColor={'cyan'}
          inactiveBackgroundColor={'pink'}
        />
        <Switch
          style={styles.switch1}
          activeBackgroundColor={'cyan'}
          inactiveBackgroundColor={'orange'}
        />
      </Section>
      <Section title="默认属性及回调">
        <Switch value={true} onChange={() => {}} />
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switch1: {
    width: 80,
    height: 50,
    marginHorizontal: 20,
  },
});
