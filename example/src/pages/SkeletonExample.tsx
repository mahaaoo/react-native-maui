import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import {SkeletonContainer, SkeletonRect, Breath, Shine, Normal, Load, ShineOver} from 'react-native-maui';
import Section from '../components/Section';

const {width} = Dimensions.get('window');

interface SkeletonExampleProps {
};

const Content = (
  <View style={{width, height: 200, backgroundColor: 'white',}}>
    <View style={{ flexDirection: 'row' }}>
      <View>
        <SkeletonRect style={{ height: 50, width: 50, borderRadius: 25 }} />
      </View>
      <View style={{ flex: 1 }}>
        <SkeletonRect style={{ marginLeft: 15, marginTop: 15, height: 20, width: 150 }}>
          <Text>Test Shine</Text>
        </SkeletonRect>
        <SkeletonRect style={{ height: 30, marginHorizontal: 15, marginTop: 15 }} />
      </View>
    </View>
    <SkeletonRect style={{ height: 30, marginLeft: 15, marginRight: 100, marginTop: 15 }} />
    <SkeletonRect style={{ height: 30, marginHorizontal: 15, marginTop: 15 }} />
  </View>
)

const SkeletonExample: React.FC<SkeletonExampleProps> = props => {
  const {} = props;
  const [finished, setFinish] = useState(false);

  useEffect(() => {
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Section title="基础用法">
        <SkeletonContainer childAnimation={Normal} finished={finished}>
          {Content}
        </SkeletonContainer>
      </Section>
      <Section title="动画效果-Breath">
        <SkeletonContainer childAnimation={Breath} finished={finished} reverse={true}>
          {Content}
        </SkeletonContainer>
      </Section>
      <Section title="动画效果-Load">
        <SkeletonContainer childAnimation={Normal} finished={finished} containerAnimation={Load}>
          {Content}
        </SkeletonContainer>
      </Section>
      <Section title="动画效果-Shine">
        <SkeletonContainer childAnimation={Shine} finished={finished} reverse={false}>
          {Content}
        </SkeletonContainer>
      </Section>
      <Section title="动画效果-ShineOver">
        <SkeletonContainer childAnimation={Normal} finished={finished} reverse={false} containerAnimation={ShineOver}>
          {Content}
        </SkeletonContainer>
      </Section>
      <View style={{ marginVertical: 50, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={() => {
            setFinish(!finished);
          }}
          style={{ height: 50, width: 200, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginTop: 14 }}
        >
          <Text>stop</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default SkeletonExample;
