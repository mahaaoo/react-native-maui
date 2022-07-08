import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  SkeletonContainer,
  SkeletonRect,
  Breath,
  Shine,
  Normal,
  Load,
  ShineOver,
} from 'react-native-maui';
import Section from '../components/Section';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width: '100%',
    height: 200,
  },
  flex: {
    flexDirection: 'row',
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  flex1: {
    flex: 1,
  },
  rect1: {
    marginLeft: 15,
    marginTop: 15,
    height: 20,
    width: 150,
  },
  rect2: {
    height: 30,
    marginHorizontal: 15,
    marginTop: 15,
  },
  rect3: {
    height: 30,
    marginLeft: 15,
    marginRight: 100,
    marginTop: 15,
  },
  buttonContainer: {
    marginVertical: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: 50,
    width: 200,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
});

const Content = (
  <View style={styles.content}>
    <View style={styles.flex}>
      <View>
        <SkeletonRect style={styles.avatar} />
      </View>
      <View style={styles.flex1}>
        <SkeletonRect style={styles.rect1}>
          <Text>Test Shine</Text>
        </SkeletonRect>
        <SkeletonRect style={styles.rect2} />
      </View>
    </View>
    <SkeletonRect style={styles.rect3} />
    <SkeletonRect style={styles.rect2} />
  </View>
);

interface SkeletonExampleProps {}

const SkeletonExample: React.FC<SkeletonExampleProps> = (props) => {
  const {} = props;
  const [finished, setFinish] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Section title="基础用法">
        <SkeletonContainer childAnimation={Normal} finished={finished}>
          {Content}
        </SkeletonContainer>
      </Section>
      <Section title="动画效果-Breath">
        <SkeletonContainer
          childAnimation={Breath}
          finished={finished}
          reverse={true}
        >
          {Content}
        </SkeletonContainer>
      </Section>
      <Section title="动画效果-Load">
        <SkeletonContainer
          childAnimation={Normal}
          finished={finished}
          containerAnimation={Load}
        >
          {Content}
        </SkeletonContainer>
      </Section>
      <Section title="动画效果-Shine">
        <SkeletonContainer
          childAnimation={Shine}
          finished={finished}
          reverse={false}
        >
          {Content}
        </SkeletonContainer>
      </Section>
      <Section title="动画效果-ShineOver">
        <SkeletonContainer
          childAnimation={Normal}
          finished={finished}
          reverse={false}
          containerAnimation={ShineOver}
        >
          {Content}
        </SkeletonContainer>
      </Section>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => {
            setFinish(!finished);
          }}
          style={styles.button}
        >
          <Text>stop</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SkeletonExample;
