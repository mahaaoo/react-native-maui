import * as React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import {Divider} from 'react-native-maui';

const Width = Dimensions.get('window').width;

export default function DividerExample() {
  return (
    <View style={styles.container}>
      <View style={{ height: 20, justifyContent: 'center' }}>
        <Divider start={30} end={Width-30} width={3} />
      </View>
      <View style={{ height: 20, justifyContent: 'center' }}>
        <Divider start={30} end={Width-30} />
      </View>
      <View style={{ height: 20, justifyContent: 'center' }}>
        <Divider start={30} end={Width-30} width={3} color={'red'} />
      </View>
      <View style={{ height: 20, justifyContent: 'center' }}>
        <Divider start={30} end={Width-30} color={'red'} />
      </View>
      <View style={{ height: 20, justifyContent: 'center' }}>
        <Divider start={30} end={Width-30} width={3} strokeDasharray={'5,5'} />
      </View>
      <View style={{ height: 20, justifyContent: 'center' }}>
        <Divider start={30} end={Width-30} width={3} color={'red'} strokeDasharray={'5,5'}  />
      </View>
      <View style={{ height: 100, justifyContent: 'center', flexDirection: 'row' }}>
        <View style={{ width: 20, justifyContent: 'center' }}>
          <Divider vertical start={0} end={100} width={3} />
        </View>
        <View style={{ width: 20, justifyContent: 'center' }}>
          <Divider vertical start={0} end={100} width={3} strokeDasharray={'5,5'}  />
        </View>
        <View style={{ width: 20, justifyContent: 'center' }}>
          <Divider vertical start={0} end={100} width={3} color={'red'} />
        </View>
        <View style={{ width: 20, justifyContent: 'center' }}>
          <Divider vertical start={0} end={100} width={3} color={'red'} strokeDasharray={'5,5'}  />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
