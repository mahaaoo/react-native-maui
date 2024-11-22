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
  pageMargin: number;
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
      console.log('首次加载', index);
      runOnJS(setLoad)(canLoad);
    }
  );

  const marginLeft = index === 0 ? 0 : pageMargin;

  if (!children) return <View style={{ width: contentSize, marginLeft }} />;

  return (
    <View style={{ width: contentSize, marginLeft }}>
      {!!load ? children : null}
    </View>
  );
};

export default SinglePage;
