/**
 * Refresh Control Implement
 * Every Control can get props from useRefresh()
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedReaction,
  runOnJS,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { RefreshStatus } from './type';
import { Icon } from '../Icon';
import { Loading } from '../Loading';
import { useRefreshController } from './hooks';

interface NormalControlProps {
  textConfig?: {
    normal: string;
    release: string;
    refresing: string;
    done: string;
  };
}

const NormalControl: React.FC<NormalControlProps> = (props) => {
  const {
    textConfig = {
      normal: '下拉刷新',
      release: '释放以刷新',
      refresing: '努力刷新中',
      done: '刷新成功',
    },
  } = props;
  const { scrollOffset, triggerHeight, refreshStatus } = useRefreshController();
  const [refreshText, setRefreshText] = useState(textConfig.normal);
  const [loading, setLoading] = useState(false);
  const degree = useSharedValue(0);

  const setRefreshTextByStatus = (text: string) => {
    setRefreshText(text);
  };

  useAnimatedReaction(
    () => refreshStatus.value,
    (value) => {
      if (value === RefreshStatus.Idle) {
        runOnJS(setRefreshTextByStatus)(textConfig.normal);
      }
      if (value === RefreshStatus.Pulling) {
        runOnJS(setRefreshTextByStatus)(textConfig.normal);
      }
      if (value === RefreshStatus.Reached) {
        runOnJS(setRefreshTextByStatus)(textConfig.release);
      }
      if (value === RefreshStatus.Holding) {
        runOnJS(setRefreshTextByStatus)(textConfig.refresing);
        runOnJS(setLoading)(true);
      }
      if (value === RefreshStatus.Done) {
        runOnJS(setRefreshTextByStatus)(textConfig.done);
        runOnJS(setLoading)(false);
      }
    }
  );

  const arrowStyle = useAnimatedStyle(() => {
    degree.value = withTiming(scrollOffset.value >= triggerHeight ? 180 : 0, {
      duration: 200,
    });

    return {
      transform: [
        {
          rotateZ: `${degree.value}deg`,
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <Loading />
      ) : (
        <Animated.View style={arrowStyle}>
          <Icon name={'arrow-line-down'} size={18} color={'grey'} />
        </Animated.View>
      )}
      <Text style={styles.textStyle}>{refreshText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  textStyle: {
    marginHorizontal: 10,
  },
});

export default NormalControl;
