import React from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  TextStyle,
} from 'react-native';
import { LoadingProps } from './Loading';

interface LoadingTitleProps extends LoadingProps {
  title?: string;
  titleStyle?: TextStyle;
}

const LoadingTitle: React.FC<LoadingTitleProps> = (props) => {
  const { title = '', titleStyle, ...options } = props;

  return (
    <View style={styles.loading}>
      <ActivityIndicator {...{ ...options }} />
      {title.length > 0 && (
        <View style={styles.titleContainer}>
          <Text style={titleStyle}>{title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingTitle;
