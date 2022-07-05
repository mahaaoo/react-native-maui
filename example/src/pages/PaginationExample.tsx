import React, { useState } from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {Pagination, Dot, Percent} from 'react-native-maui';
import Section from '../components/Section';
interface PaginationExampleProps {
};

const PaginationExample: React.FC<PaginationExampleProps> = props => {
  const {} = props;
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Section title="基本用法" style={{ flexDirection: 'column' }}>
        <View style={{ width: '100%', height: 50, backgroundColor: '#000', justifyContent: 'center' }}>
          <Pagination currentIndex={currentIndex} total={5}>
            <Dot />
          </Pagination>
        </View>
        <View style={{ width: '100%', height: 100, backgroundColor: '#000' }}>
          <Pagination position="left" currentIndex={currentIndex} total={5}>
            <Dot direction="column" />
          </Pagination>
        </View>
      </Section>
      <Section title="自定义样式" style={{ flexDirection: 'column' }}>
        <View style={{ width: '100%', height: 50, backgroundColor: '#000', justifyContent: 'center' }}>
          <Pagination currentIndex={currentIndex} total={5} position='left'>
            <Dot activeColor='red' inActiveColor='cyan' />
          </Pagination>
        </View>
        <View style={{ width: '100%', height: 50, backgroundColor: '#000', justifyContent: 'center' }}>
          <Pagination currentIndex={currentIndex} total={5} position='right'>
            <Dot shape='cube' />
          </Pagination>
        </View>
      </Section>
      <Section title="数字类型" style={{ flexDirection: 'column' }}>
        <View style={{ width: '100%', height: 50, backgroundColor: '#000', justifyContent: 'center' }}>
          <Pagination currentIndex={currentIndex} total={5}>
            <Percent />
          </Pagination>
        </View>
      </Section>
      <View style={{ width: '100%', height: 50, flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => {
          let newIndex = currentIndex;
          if (currentIndex === 0) {
            newIndex = 4
          } else {
            newIndex = newIndex - 1;
          }
          setCurrentIndex(newIndex);
        }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Pre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          let newIndex = currentIndex;
          if (currentIndex === 4) {
            newIndex = 0
          } else {
            newIndex = newIndex + 1;
          }
          setCurrentIndex(newIndex);
        }}style={{ flex: 1, justifyContent: 'center', alignItems: 'center'  }}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default PaginationExample;
