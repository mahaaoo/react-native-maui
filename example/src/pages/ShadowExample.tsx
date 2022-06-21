import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Shadow} from 'react-native-maui';

const BORDER_RADIUS = 90;

interface ShadowExampleProps {
};

const ShadowExample: React.FC<ShadowExampleProps> = props => {
  return (
    <View style={styles.container}>
      <Shadow borderRadius={BORDER_RADIUS} color={"red"} shadowWidth={30}>
        <View style={{ 
          width: 200, height: 300, backgroundColor: 'pink', borderRadius: BORDER_RADIUS,
        }} />
      </Shadow>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
})

export default ShadowExample;
