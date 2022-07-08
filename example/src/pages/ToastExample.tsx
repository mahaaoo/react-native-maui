import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Toast,
  ToastUtil,
  TranslateContainer,
  OpacityContainer,
  Button,
} from 'react-native-maui';

interface ToastExampleProps {}

const ToastExample: React.FC<ToastExampleProps> = (props) => {
  const {} = props;

  return (
    <View>
      <View style={styles.container}>
        <Button
          onPress={() => {
            ToastUtil.template = (title: string) => (
              <OpacityContainer
                mask={false}
                pointerEvents="none"
                containerStyle={styles.containerStyle}
              >
                <Toast title={title} />
              </OpacityContainer>
            );
            ToastUtil.show('This is toast one');
          }}
        >
          <Text>show toast one</Text>
        </Button>
      </View>
      <View style={styles.container2}>
        <Button
          onPress={() => {
            ToastUtil.template = (title: string) => (
              <TranslateContainer
                mask={false}
                pointerEvents="none"
                containerStyle={styles.containerStyle}
              >
                <Toast title={title} style={styles.margin} />
              </TranslateContainer>
            );
            ToastUtil.show('This is toast two');
          }}
        >
          <Text>show toast two</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  margin: {
    marginBottom: 50,
  },
});

export default ToastExample;
