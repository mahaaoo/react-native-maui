/**
 * if use this componet wrapper overlay componet 
 * onAppear will be called when it mount,
 * onDisappear will be called when it unMount
 */
import React, {forwardRef, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

interface NormalContainerProps {
  children: React.ReactNode,
  onAppear?: () => void;
  onDisappear?: () => void;
}

interface NormalContainerRef {
}

const NormalContainer = forwardRef<NormalContainerRef, NormalContainerProps>((props, ref) => {
  const {
    children, 
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
      <View style={styles.container}>
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
    justifyContent: 'center', 
    alignItems: 'center'
  }
})

export default NormalContainer;
