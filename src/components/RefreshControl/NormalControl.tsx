import React, { useState } from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useAnimatedReaction,
  runOnJS,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { RefreshStatus, useRefresh } from './type';
import { Icon } from '../Icon';
import { Loading } from '../Loading';

const { width } = Dimensions.get('window');

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
  const { scrollBounse, transitionY, triggleHeight, refreshStatus } =
    useRefresh();
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
    },
    [transitionY]
  );

  const refreshView = useAnimatedStyle(() => {
    if (scrollBounse.value) {
      return {
        height: 0,
        opacity: 0,
      };
    }
    return {
      height: transitionY.value,
      opacity: interpolate(
        transitionY.value,
        [0, triggleHeight / 3, triggleHeight],
        [0, 0, 1]
      ),
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    degree.value = withTiming(transitionY.value >= triggleHeight ? 180 : 0, {
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
    <Animated.View style={[styles.refresh, refreshView]}>
      {loading ? (
        <Loading />
      ) : (
        <Animated.View style={arrowStyle}>
          <Icon name={'arrow-line-down'} size={18} color={'grey'} />
        </Animated.View>
      )}
      <Text style={styles.textStyle}>{refreshText}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  refresh: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  textStyle: {
    marginHorizontal: 10,
  },
});

export default NormalControl;
