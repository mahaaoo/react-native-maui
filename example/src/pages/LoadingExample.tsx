import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Button from "../components/Button";
import { LoadingUtil, Loading, LoadingTitle } from '../components/Loading';
import { OpacityContainer, OpacityContainerRef } from '../components/Overlay';

export default function LoadingExample() {

  const ref = React.createRef<OpacityContainerRef>();

  return (
    <View style={styles.container}>
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
        <LoadingTitle />
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
      <Button onPress={() => {
        LoadingUtil.hide();
      }}>
        <Text>dismiss loading</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
