import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Progress, CircleProgress } from 'react-native-maui';

interface ProgressExampleProps {
};

const ProgressExample: React.FC<ProgressExampleProps> = props => {
  const {} = props;
  return (
    <View style={styles.container}>
      <Progress style={{ width: 300, height: 20, borderRadius: 10, marginTop: 20 }} value={10} />
      <Progress style={{ width: 300, height: 20, borderRadius: 10, marginTop: 20 }} value={74} activeColor="orange" />
      <Progress style={{ width: 300, height: 20, borderRadius: 10, marginTop: 20 }} value={20} activeColor="pink" inactiveColor='white' />
      <Progress style={{ width: 300, height: 15, borderRadius: 10, marginTop: 20 }} value={38} />
      <Progress style={{ width: 300, height: 15, marginTop: 20 }} value={49} />
      <Progress style={{ width: 300, height: 15, borderRadius: 10, marginTop: 20 }} value={10} toValue={90} />
      <CircleProgress style={{ marginTop: 20 }} size={60} value={30} activeColor="pink" />
      <CircleProgress style={{ marginTop: 20 }} value={10} toValue={90} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  }
})

export default ProgressExample;
