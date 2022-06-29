import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AnimatedNumber} from 'react-native-maui';
import Section from '../components/Section';

interface AnimatedNumberExampleProps {
};

const AnimatedNumberExample: React.FC<AnimatedNumberExampleProps> = props => {
  const {} = props;

  return (
    <View style={styles.container}>
      <Section title="基础用法" style={{ paddingVertical: 30 }}>
        <AnimatedNumber style={{ fontSize: 40, fontWeight: 'bold', marginHorizontal: 10 }} value={10} toValue={113} />
        <AnimatedNumber 
          style={{ fontSize: 40, color: 'orange', fontWeight: 'bold', marginHorizontal: 10 }} 
          toFixed={2} 
          value={0.11} 
          toValue={1.23}
        />
      </Section>
      <Section title="自定义属性" style={{ paddingVertical: 30 }}>
        <AnimatedNumber 
          easing={'ease'} 
          style={{ fontSize: 40, fontWeight: 'bold', marginHorizontal: 10, color: '#f1441d' }} 
          value={0} 
          toValue={100}
          duration={2000}
        />
      </Section>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default AnimatedNumberExample;
