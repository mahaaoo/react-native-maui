/**
 * if use this componet wrapper overlay componet 
 * onAppear will be called when it mount,
 * onDisappear will be called when it unMount
 */
import React, {forwardRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import { BaseContainerProps } from './type';

interface NormalContainerProps extends BaseContainerProps {
}

interface NormalContainerRef {
}

const NormalContainer = forwardRef<NormalContainerRef, NormalContainerProps>((props, ref) => {
  const {
    children, 
    containerStyle,
    onAppear,
    onDisappear
  } = props;

  useEffect(() => {
    onAppear && onAppear();
    return () => {
      onDisappear && onDisappear();
    }
  }, [onAppear, onDisappear]);

  return (
    <View style={styles.overlay}>
      <View style={[styles.container, containerStyle]}>
        {children}
      </View>
    </View>
  )
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1, 
  }
})

NormalContainer.displayName = "NormalContainer";

export default NormalContainer;
