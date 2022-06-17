import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AnimatedNumber} from 'react-native-maui';

interface AnimatedNumberExampleProps {
};

const AnimatedNumberExample: React.FC<AnimatedNumberExampleProps> = props => {
  const {} = props;

  return (
    <View style={styles.container}>
      <AnimatedNumber style={{ fontSize: 40 }} value={10} toValue={113} />
      <AnimatedNumber 
        easing={'ease'} 
        style={{ fontSize: 40, color: 'orange' }} 
        toFixed={2} 
        value={0.11} 
        toValue={1.23}
        duration={2000}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default AnimatedNumberExample;
