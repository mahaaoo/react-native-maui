import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { Progress, CircleProgress } from 'react-native-maui';
import Section from '../components/Section';

interface ProgressExampleProps {}

const ProgressExample: React.FC<ProgressExampleProps> = (props) => {
  const {} = props;
  return (
    <ScrollView style={styles.container}>
      <Section title="条状进度条" style={styles.section}>
        <Progress
          style={styles.margin}
          height={15}
          width={200}
          radius
          value={10}
        />
        <Progress
          style={styles.margin}
          activeColor={'#1781b5'}
          inactiveColor={'#63bbd0'}
          height={15}
          width={340}
          value={78}
        />
      </Section>
      <Section title="条状进度条渐变" style={styles.padding}>
        <Progress
          width={180}
          height={20}
          style={styles.margin}
          value={60}
          activeColor={['#eea6b7', '#e9ccd3']}
          inactiveColor="#F8F8F8"
          radius
        />
      </Section>
      <Section title="条状进度条动画" style={styles.padding}>
        <Progress
          delay={3000}
          duration={3000}
          width={300}
          height={15}
          style={styles.margin}
          value={10}
          toValue={90}
          radius
        />
      </Section>
      <Section title="圆形进度条">
        <CircleProgress
          size={60}
          value={75}
          renderCenter={(percent: number) => (
            <Text style={styles.circle}>{percent}%</Text>
          )}
        />
        <CircleProgress
          size={75}
          value={30}
          activeColor="#c6dfc8"
          inactiveColor="white"
        />
      </Section>
      <Section title="圆形进度条渐变" style={styles.padding}>
        <CircleProgress
          size={60}
          value={100}
          activeColor={['#f7da94', '#f9d27d', '#fbb929']}
          renderCenter={(percent: number) => (
            <Text style={styles.circle2}>{percent}%</Text>
          )}
        />
      </Section>
      <Section title="动画" style={styles.section}>
        <CircleProgress
          delay={3000}
          duration={3000}
          style={styles.margin}
          width={15}
          value={10}
          toValue={90}
          renderCenter={(percent: number) => (
            <Text style={styles.circle3}>{percent}%</Text>
          )}
        />
      </Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  margin: {
    marginVertical: 10,
  },
  padding: {
    paddingVertical: 30,
  },
  circle: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  circle2: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#fbb929',
  },
  circle3: {
    fontWeight: 'bold',
    fontSize: 45,
  },
  section: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export default ProgressExample;
