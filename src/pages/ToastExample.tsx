import React from 'react';
import {View, Text} from 'react-native';
import Button from '../components/Button';
import { TranslateContainer, OpacityContainer } from '../components/Overlay';
import { Toast, ToastUtil } from '../components/Toast';

interface ToastExampleProps {
};

const ToastExample: React.FC<ToastExampleProps> = props => {
  const {} = props;

  return (
    <View>
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 50}}>
        <Button onPress={() => {
          ToastUtil.template = (title: string) => (
            <OpacityContainer mask={false} pointerEvents="none" containerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
              <Toast title={title} />
            </OpacityContainer>
          )
          ToastUtil.show('This is toast one');
        }}>
          <Text>show toast one</Text>
        </Button>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 20}}>
        <Button onPress={() => {
          ToastUtil.template = (title: string) => (
            <TranslateContainer mask={false} pointerEvents="none" containerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
              <Toast title={title} style={{ marginBottom: 50 }} />
            </TranslateContainer>
          )
          ToastUtil.show('This is toast two');
        }}>
          <Text>show toast two</Text>
        </Button>
      </View>
    </View>
  )
};

export default ToastExample;
