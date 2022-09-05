import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  AnimatedNumber,
  ScrollNumber,
  Button,
  ButtonType,
} from 'react-native-maui';
import Section from '../components/Section';

interface AnimatedNumberExampleProps {}

const AnimatedNumberExample: React.FC<AnimatedNumberExampleProps> = (props) => {
  const {} = props;
  const [value, setValue] = useState(0);

  return (
    <View style={styles.container}>
      <Section title="基础用法" style={styles.section}>
        <AnimatedNumber
          easing={'ease'}
          style={styles.animatedNumber3}
          value={value}
          duration={1000}
        />
      </Section>
      <Section title="自定义属性" style={styles.section}>
        <AnimatedNumber
          style={styles.animatedNumber2}
          toFixed={2}
          value={value / 100}
          duration={1000}
        />
      </Section>
      <Section title="滚动" style={styles.section}>
        <ScrollNumber value={value} />
      </Section>
      <Button
        type={ButtonType.Link}
        onPress={() => {
          const randomValue = Math.floor(Math.random() * 1000000);
          setValue(randomValue);
        }}
      >
        <Text>Random: {value}</Text>
      </Button>
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
