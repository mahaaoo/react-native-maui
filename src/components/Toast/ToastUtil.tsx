import React from 'react';
import { StyleSheet } from 'react-native';

import { overlayRef } from '../Overlay';
import Toast from './Toast';
import { TranslateContainer } from '../Overlay';

export interface ToastOptions {
  duration?: number;
  animation?: 'translate' | 'opacity';
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

export const ToastUtil = {
  key: 'global-toast',
  template: (title: string, options?: ToastOptions) => {
    return (
      <TranslateContainer
        mask={false}
        pointerEvents="none"
        containerStyle={styles.container}
        duration={options?.duration}
      >
        <Toast title={title} style={styles.toast} />
      </TranslateContainer>
    );
  },
  show: (title: string, options?: ToastOptions) => {
    const duration = options?.duration || 2000;
    if (!ToastUtil.isExist()) {
      const time = setTimeout(() => {
        ToastUtil.hide();
        clearTimeout(time);
      }, duration);
    }
    overlayRef.current?.add(ToastUtil.template(title, options), ToastUtil.key);
  },
  hide: () => overlayRef.current?.remove(ToastUtil.key),
  isExist: () => overlayRef.current?.isExist(ToastUtil.key),
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    marginBottom: 50,
  },
});
