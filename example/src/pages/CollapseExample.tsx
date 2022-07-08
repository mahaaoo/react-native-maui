import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { Collapse, CollapseGroup } from 'react-native-maui';
import Section from '../components/Section';

const { width } = Dimensions.get('window');

export default function ButtonExample() {
  return (
    <ScrollView style={styles.container}>
      <Section title="基本使用" style={styles.section1}>
        <Collapse title={'collapse1'} tag="1">
          <View style={styles.content}>
            <Text>contentcontentcontentcontent</Text>
          </View>
        </Collapse>
        <Collapse title={'collapse2'} tag="2">
          <View style={styles.content}>
            <Text>contentcontentcontentcontent</Text>
          </View>
        </Collapse>
      </Section>
      <Section title="手风琴" style={styles.section2}>
        <CollapseGroup accordion={true} defaultActive={'2'}>
          <Collapse title={'collapse1'} tag="1">
            <View style={styles.content}>
              <Text>contentcontentcontentcontent</Text>
            </View>
          </Collapse>
          <Collapse title={'collapse2'} tag="2">
            <View style={styles.content}>
              <Text>contentcontentcontentcontent</Text>
            </View>
          </Collapse>
          <Collapse title={'collapse3'} tag="cc1123">
            <View style={styles.content}>
              <Text>contentcontentcontentcontent</Text>
            </View>
          </Collapse>
        </CollapseGroup>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section1: {
    backgroundColor: '#F8F8F8',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    width: width - 30,
    height: 100,
    backgroundColor: 'white',
  },
  section2: {
    backgroundColor: '#F8F8F8',
  },
});
