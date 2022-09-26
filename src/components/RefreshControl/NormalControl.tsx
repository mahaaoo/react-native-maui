/**
 * Refresh Control Implement
 * Every Control can get props from useRefresh()
 */
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
  position: 'top' | 'bottom';
}

const NormalControl: React.FC<NormalControlProps> = (props) => {
  const {
    textConfig = {
      normal: '下拉刷新',
      release: '释放以刷新',
      refresing: '努力刷新中',
      done: '刷新成功',
    },
    position,
  } = props;
  const { scrollBounse, transitionY, triggleHeight, refreshStatus, direction } =
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
    }
  );

  const refreshView = useAnimatedStyle(() => {
    if (
      scrollBounse.value ||
      (position === 'top' && direction.value === -1) ||
      (position === 'bottom' && direction.value === 1)
    ) {
      return {
        height: 0,
        opacity: 0,
      };
    }
    let positionStyle = {};
    if (position === 'top') {
      positionStyle = {
        top: 0,
      };
    } else {
      positionStyle = {
        bottom: 0,
      };
    }
    return {
      ...positionStyle,
      height: transitionY.value * direction.value,
      opacity: interpolate(
        transitionY.value * direction.value,
        [0, triggleHeight / 3, triggleHeight],
        [0, 0, 1]
      ),
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    degree.value = withTiming(
      transitionY.value >= triggleHeight * direction.value ? 180 : 0,
      {
        duration: 200,
      }
    );

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
          <Icon
            name={position === 'top' ? 'arrow-line-down' : 'arrow-line-up'}
            size={18}
            color={'grey'}
          />
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
    flexDirection: 'row',
    position: 'absolute',
  },
  textStyle: {
    marginHorizontal: 10,
  },
});

export default NormalControl;
