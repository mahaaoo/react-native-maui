import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Toast,
  ToastUtil,
  TranslateContainer,
  OpacityContainer,
  Button,
} from 'react-native-maui';
import Section from '../components/Section';

interface ToastExampleProps {}

const ToastExample: React.FC<ToastExampleProps> = (props) => {
  const {} = props;

  return (
    <View>
      <Section title="基础用法">
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
          <Text>OpacityContainer Toast</Text>
        </Button>
        <Button
          style={styles.marginLeft}
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
          <Text>TranslateContainer Toast</Text>
        </Button>
      </Section>
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
  marginLeft: {
    marginLeft: 15,
  },
});

export default ToastExample;
