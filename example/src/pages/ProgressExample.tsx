import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Progress, CircleProgress } from 'react-native-maui';

interface ProgressExampleProps {
};

const ProgressExample: React.FC<ProgressExampleProps> = props => {
  const {} = props;
  return (
    <View style={styles.container}>
      <Progress style={{ marginTop: 20 }} height={10} width={200} radius value={10} />
      <Progress style={{ marginTop: 20 }} value={74} activeColor="orange" radius />
      <Progress style={{ marginTop: 20 }} value={60} activeColor={['pink', 'white']} inactiveColor='white' radius />
      <Progress style={{ marginTop: 20 }} value={49} />
      <Progress style={{ marginTop: 20 }} value={10} toValue={90} radius />
      <CircleProgress style={{ marginTop: 20 }} size={60} value={75} activeColor={['white', 'pink']} />
      <CircleProgress style={{ marginTop: 20 }} width={15} value={10} toValue={90}  />
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
