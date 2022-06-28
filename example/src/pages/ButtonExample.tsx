import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Button, ButtonType, GradientButton, Loading, CircleLoading} from "react-native-maui";
import Section from '../components/Section';
import Plus from '../components/Icon/plus'

export default function ButtonExample() {
  return (
    <View style={styles.container}>
      <Section title="基础样式">
        <Button style={{ marginHorizontal: 10 }} onPress={() => {}}>
          <Text>Default</Text>
        </Button>
        <Button style={{ marginHorizontal: 10 }} onPress={() => {}} disabled type={ButtonType.Disabled}>
          <Text>Disabled</Text>
        </Button>
        <Button style={{ marginHorizontal: 10 }} onPress={() => {}} type={ButtonType.Primary}>
          <Text style={{ color: 'white' }}>Primary</Text>
        </Button>
        <Button 
          style={{ marginHorizontal: 10 }} 
          onPress={() => {}} 
          type={ButtonType.Link}
          textStyle={{ color: '#fcb70a' }}
        >
          Link
        </Button> 
      </Section>
      <Section title="自定义样式">
        <Button 
          onPress={() => {}} 
          style={{
            borderRadius: 15,
            borderWidth: 2,
            borderColor: '#80766e',
            backgroundColor: '#93b5cf',
            marginHorizontal: 10
          }}
          withoutFeedback
        >
          <Text style={{ color: 'white' }}>WithoutFeedback</Text>
        </Button>
        <Button 
          onPress={() => {}} 
          type={ButtonType.None}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#990033',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10
          }}
        >
          <Text style={{ color: 'white' }}>Round</Text>
        </Button>
        <Button 
          onPress={() => {}} 
          type={ButtonType.None}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#99CC99',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10
          }}
        >
          <Plus />
        </Button>
      </Section>
      <Section title="等待视图">
        <Button 
          onPress={() => {}} 
          type={ButtonType.None}
          style={{
            width: 100,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#2593FC',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10
          }}
        >
          <Loading color="white" />
        </Button>
        <Button
          disabled
          onPress={() => {}} 
          type={ButtonType.None}
          style={{
            width: 60,
            height: 60,
            backgroundColor: '#6666CC',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10
          }}
        >
          <CircleLoading color="white" size={20} />
        </Button>
      </Section>
      <Section title="渐变">
        <GradientButton
          colors={['#f2cac9', '#efafad', '#f1908c']} 
          width={150} 
          height={50}
          onPress={() => {}}
          borderRadius={10}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>GradientButton</Text>
        </GradientButton>
      </Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
