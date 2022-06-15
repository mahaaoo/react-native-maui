import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import {Collapse} from 'maui';

const {width} = Dimensions.get('window');

export default function ButtonExample() {

  return (
    <ScrollView style={styles.container}>
      <Collapse title={"折叠面板一"}>
        <View style={styles.content}>
          <Text>内容内容内容内容</Text>
        </View>
      </Collapse>
      <Collapse title={"折叠面板二"}>
        <View style={styles.content}>
          <Text>内容内容内容内容</Text>
        </View>
      </Collapse>
      <Collapse title={"折叠面板三"}>
        <View style={styles.content}>
          <Text>内容内容内容内容</Text>
        </View>
      </Collapse>
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
