import { useState } from 'react';
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
}

const SinglePage: React.FC<SinglePageProps> = (props) => {
  const {
    children,
    contentSize,
    currentIndex,
    index,
    lazy,
    lazyPreloadNumber,
  } = props;
  const [load, setLoad] = useState(() => {
    if (!lazy) return true;
    return (
      index >= currentIndex.value - lazyPreloadNumber ||
      index <= currentIndex.value + lazyPreloadNumber
    );
  });

  useAnimatedReaction(
    () => currentIndex.value,
    (value) => {
      if (!lazy) return;
      if (!!load) return;
      const canLoad =
        index >= currentIndex.value - lazyPreloadNumber ||
        index <= currentIndex.value + lazyPreloadNumber;
      if (!canLoad) return;
      runOnJS(setLoad)(canLoad);
    }
  );

  if (!children) return <View style={{ width: contentSize }} />;

  return <View style={{ width: contentSize }}>{!!load ? children : null}</View>;
};

export default SinglePage;
