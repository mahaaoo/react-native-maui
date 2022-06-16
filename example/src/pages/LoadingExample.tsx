import * as React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Button, LoadingUtil, Loading, LoadingTitle, OpacityContainer, OpacityContainerRef, Spinner, CircleLoad } from "react-native-maui";

export default function LoadingExample() {

  const ref = React.createRef<OpacityContainerRef>();

  return (
    <ScrollView style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 50}}>
        <Loading />
      </View>
      <Button onPress={() => {
        LoadingUtil.template = () => {
          return (
            <OpacityContainer containerStyle={{ justifyContent: 'center', alignItems: 'center'}}>
              <Loading color="white" />
            </OpacityContainer>
          )
        }        
        LoadingUtil.show();
      }}>
        <Text>show loading</Text>
      </Button>
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 50}}>
        <LoadingTitle title="wait" />
      </View>
      <Button onPress={() => {
        LoadingUtil.template = () => {
          return (
            <OpacityContainer ref={ref} mask={false} containerStyle={{ justifyContent: 'center', alignItems: 'center'}}>
              <LoadingTitle />
            </OpacityContainer>    
          )
        }
        LoadingUtil.show();
        setTimeout(() => {
          LoadingUtil.hide();
        }, 2000);
      }}>
        <Text>show loading title auto close after 2000ms</Text>
      </Button>
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 50}}>
        <Spinner />
      </View>
      <Button onPress={() => {
        LoadingUtil.template = () => {
          return (
            <OpacityContainer containerStyle={{ justifyContent: 'center', alignItems: 'center'}}>
              <Spinner />
            </OpacityContainer>
          )
        }        
        LoadingUtil.show();
      }}>
        <Text>show spinner</Text>
      </Button>
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 50}}>
        <CircleLoad />
      </View>
      <Button onPress={() => {
        LoadingUtil.template = () => {
          return (
            <OpacityContainer containerStyle={{ justifyContent: 'center', alignItems: 'center'}}>
              <CircleLoad color='white' />
            </OpacityContainer>
          )
        }        
        LoadingUtil.show();
      }}>
        <Text>show circleLoad</Text>
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
