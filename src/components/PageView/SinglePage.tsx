import { useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';

interface SinglePageProps {
  children: React.ReactNode;
  contentSize: number;
  currentIndex: SharedValue<number>;
  index: number;
  lazy: boolean;
  lazyPreloadNumber: number;
  pageMargin: number;
  isHorizontal: boolean;
}

const SinglePage: React.FC<SinglePageProps> = (props) => {
  const {
    children,
    contentSize,
    currentIndex,
    index,
    lazy,
    lazyPreloadNumber,
    pageMargin,
    isHorizontal,
  } = props;
  const [load, setLoad] = useState(() => {
    if (!lazy) return true;
    return (
      index >= currentIndex.value - lazyPreloadNumber &&
      index <= currentIndex.value + lazyPreloadNumber
    );
  });

  useAnimatedReaction(
    () => currentIndex.value,
    (value) => {
      if (!lazy) return;
      if (!!load) return;
      const canLoad =
        index >= value - lazyPreloadNumber &&
        index <= value + lazyPreloadNumber;
      if (!canLoad) return;
      runOnJS(setLoad)(canLoad);
    }
  );

  const margin = index === 0 ? 0 : pageMargin;

  const directionStyle = useMemo(() => {
    return isHorizontal
      ? {
          width: contentSize,
          marginLeft: margin,
        }
      : {
          height: contentSize,
          marginTop: margin,
        };
  }, [isHorizontal]);

  if (!children) return <View style={directionStyle} />;

  return <View style={directionStyle}>{!!load ? children : null}</View>;
};

export default SinglePage;
