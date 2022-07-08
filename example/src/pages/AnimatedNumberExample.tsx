import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AnimatedNumber } from 'react-native-maui';
import Section from '../components/Section';

interface AnimatedNumberExampleProps {}

const AnimatedNumberExample: React.FC<AnimatedNumberExampleProps> = (props) => {
  const {} = props;

  return (
    <View style={styles.container}>
      <Section title="基础用法" style={styles.section}>
        <AnimatedNumber
          style={styles.animatedNumber1}
          value={10}
          toValue={113}
        />
        <AnimatedNumber
          style={styles.animatedNumber2}
          toFixed={2}
          value={0.11}
          toValue={1.23}
        />
      </Section>
      <Section title="自定义属性" style={styles.section}>
        <AnimatedNumber
          easing={'ease'}
          style={styles.animatedNumber3}
          value={0}
          toValue={100}
          duration={2000}
        />
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingVertical: 30,
  },
  animatedNumber1: {
    fontSize: 40,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  animatedNumber2: {
    fontSize: 40,
    color: 'orange',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  animatedNumber3: {
    fontSize: 40,
    fontWeight: 'bold',
    marginHorizontal: 10,
    color: '#f1441d',
  },
});

export default AnimatedNumberExample;
