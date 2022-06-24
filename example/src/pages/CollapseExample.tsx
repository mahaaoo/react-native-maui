import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import {Collapse} from 'react-native-maui';

const {width} = Dimensions.get('window');

export default function ButtonExample() {

  return (
    <ScrollView style={styles.container}>
      <Collapse title={"collapse1"}>
        <View style={styles.content}>
          <Text>contentcontentcontentcontent</Text>
        </View>
      </Collapse>
      <Collapse title={"collapse2"} toggle={true}>
        <View style={styles.content}>
          <Text>contentcontentcontentcontent</Text>
        </View>
      </Collapse>
      <Collapse title={"collapse3"} onChange={() => {
        console.log('open/close');
      }}>
        <View style={styles.content}>
          <Text>contentcontentcontentcontent</Text>
        </View>
        <View style={styles.content}>
          <Text>contentcontentcontentcontent</Text>
        </View>
        <View style={styles.content}>
          <Text>contentcontentcontentcontent</Text>
        </View>
        <View style={styles.content}>
          <Text>contentcontentcontentcontent</Text>
        </View>
      </Collapse>
      <Text>contentcontentcontentcontent</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width,
    height: 100,
    backgroundColor: 'white'
  }
});
