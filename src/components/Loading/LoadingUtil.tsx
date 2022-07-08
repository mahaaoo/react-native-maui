import React from 'react';
import { overlayRef } from '../Overlay';
import Loading from './Loading';
import { OpacityContainer } from '../Overlay';
import { StyleSheet } from 'react-native';

export const LoadingUtil = {
  key: 'global-loading',
  template: () => {
    return (
      <OpacityContainer containerStyle={styles.container}>
        <Loading />
      </OpacityContainer>
    );
  },
  show: () => {
    overlayRef.current?.add(LoadingUtil.template(), LoadingUtil.key);
  },
  hide: () => overlayRef.current?.remove(LoadingUtil.key),
  isExist: () => overlayRef.current?.isExist(LoadingUtil.key),
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
