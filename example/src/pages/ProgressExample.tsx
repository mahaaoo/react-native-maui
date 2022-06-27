import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import { Progress, CircleProgress } from 'react-native-maui';
import Section from '../components/Section';

interface ProgressExampleProps {
};

const ProgressExample: React.FC<ProgressExampleProps> = props => {
  const {} = props;
  return (
    <ScrollView style={styles.container}>
      <Section title="条状进度条" style={{ flexDirection: 'column', alignItems: 'flex-start'}}>
        <Progress style={{ marginVertical: 10 }} height={15} width={200} radius value={10} />
        <Progress style={{ marginVertical: 10 }} activeColor={"#1781b5"} inactiveColor={"#63bbd0"} height={15} width={340} value={78} />
      </Section>
      <Section title="条状进度条渐变">
        <Progress style={{ marginVertical: 10 }} value={60} activeColor={['#eea6b7', '#e9ccd3']} inactiveColor='#F8F8F8' radius />
      </Section>
      <Section title="圆形进度条">
        <CircleProgress size={60} value={75} renderCenter={(percent: number) => (
          <Text style={{ fontWeight: "bold", fontSize: 25 }}>
            {percent}%
          </Text> 
        )} />
        <CircleProgress size={75} value={30} activeColor="#c6dfc8" inactiveColor="white" />
      </Section>
      <Section title="圆形进度条渐变">
        <CircleProgress 
          size={60} 
          value={100} 
          activeColor={["#f7da94", "#f9d27d", "#fbb929"]}
          renderCenter={(percent: number) => (
            <Text style={{ fontWeight: "bold", fontSize: 25, color: "#fbb929" }}>
              {percent}%
            </Text> 
          )} 
        />
      </Section>
      <Section title="动画" style={{ flexDirection: 'column', alignItems: 'flex-start'}}>
        <Progress style={{ marginVertical: 10 }} value={10} toValue={90} radius />
        <CircleProgress 
          style={{ marginVertical: 10 }} 
          width={15} 
          value={10} 
          toValue={90}  
          renderCenter={(percent: number) => (
            <Text style={{ fontWeight: "bold", fontSize: 45 }}>
              {percent}%
            </Text> 
          )} 
        />
      </Section>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default ProgressExample;
