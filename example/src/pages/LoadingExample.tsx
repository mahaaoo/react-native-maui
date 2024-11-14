import * as React from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import {
  Loading,
  LoadingTitle,
  OpacityContainerRef,
  Spinner,
  CircleLoading,
  GrowLoading,
  ScaleLoading,
} from 'react-native-maui';
import Section from '../components/Section';

const { width } = Dimensions.get('window');
const Width = (width - 30) / 3;

export default function LoadingExample() {
  const ref = React.createRef<OpacityContainerRef>();

  return (
    <ScrollView style={styles.container}>
      <Section title="基本样式" style={styles.colum}>
        <View style={styles.row}>
          <View style={styles.content}>
            <Loading />
          </View>
          <View style={styles.content}>
            <LoadingTitle
              color="white"
              titleStyle={styles.loadingTitle}
              title="wait"
            />
          </View>
          <View style={styles.content}>
            <Spinner activeColor="#ff9900" inactiveColor="#f8e0b0" />
          </View>
        </View>
        <View style={styles.circleContainer}>
          <View style={styles.content}>
            <ScaleLoading color={'red'} />
          </View>
          <View style={styles.content}>
            <CircleLoading color="#3E2AD1" />
          </View>
          <View style={styles.content}>
            <GrowLoading />
          </View>
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    width: Width,
    height: Width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colum: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  loadingTitle: {
    color: 'white',
  },
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
