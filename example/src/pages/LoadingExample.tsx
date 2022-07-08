import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import {
  Button,
  LoadingUtil,
  Loading,
  LoadingTitle,
  OpacityContainer,
  OpacityContainerRef,
  Spinner,
  CircleLoading,
  GrowLoading,
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
            <CircleLoading color="#3E2AD1" />
          </View>
          <View style={styles.content}>
            <GrowLoading />
          </View>
          <View style={styles.content} />
        </View>
      </Section>
      <Button
        onPress={() => {
          LoadingUtil.template = () => {
            return (
              <OpacityContainer containerStyle={styles.containerStyle}>
                <Loading color="white" />
              </OpacityContainer>
            );
          };
          LoadingUtil.show();
        }}
      >
        <Text>show loading</Text>
      </Button>
      <Button
        onPress={() => {
          LoadingUtil.template = () => {
            return (
              <OpacityContainer
                ref={ref}
                mask={false}
                modal={true}
                containerStyle={styles.containerStyle}
              >
                <LoadingTitle />
              </OpacityContainer>
            );
          };
          LoadingUtil.show();
          setTimeout(() => {
            LoadingUtil.hide();
          }, 2000);
        }}
      >
        <Text>show loading title auto close after 2000ms</Text>
      </Button>
      <Button
        onPress={() => {
          LoadingUtil.template = () => {
            return (
              <OpacityContainer containerStyle={styles.containerStyle}>
                <Spinner />
              </OpacityContainer>
            );
          };
          LoadingUtil.show();
        }}
      >
        <Text>show spinner</Text>
      </Button>
      <Button
        onPress={() => {
          LoadingUtil.template = () => {
            return (
              <OpacityContainer containerStyle={styles.containerStyle}>
                <CircleLoading color="white" />
              </OpacityContainer>
            );
          };
          LoadingUtil.show();
        }}
      >
        <Text>show CircleLoading</Text>
      </Button>
      <Button
        onPress={() => {
          LoadingUtil.template = () => {
            return (
              <OpacityContainer containerStyle={styles.containerStyle}>
                <GrowLoading color="white" />
              </OpacityContainer>
            );
          };
          LoadingUtil.show();
        }}
      >
        <Text>show GrowLoading</Text>
      </Button>
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
