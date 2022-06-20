import React, { useMemo } from 'react';
import {View, StyleSheet} from 'react-native';
import {Shadow} from 'react-native-maui';

interface ShadowExampleProps {
};

const ShadowExample: React.FC<ShadowExampleProps> = props => {
  return (
    <View style={styles.container}>
      <Shadow>
        <View style={{ 
          width: 150, height: 200, backgroundColor: 'white', borderRadius: 15,
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
