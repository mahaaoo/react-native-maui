import { ScrollViewProps, FlatListProps } from 'react-native';
import Animated from 'react-native-reanimated';

import NestedTabView from './NestedTabView';
import NestedScene from './NestedScene';
import NestedRefresh from './NestedRefresh';

const NestedScrollView: React.FC<ScrollViewProps> = (props: any) => {
  const AnimateScrollView = Animated.ScrollView;

  return <NestedScene ScrollableComponent={AnimateScrollView} {...props} />;
};

const NestedFlatList: React.FC<FlatListProps<any>> = (props: any) => {
  const AnimateFlatList = Animated.FlatList;

  return <NestedScene ScrollableComponent={AnimateFlatList} {...props} />;
};

// const createNestedComponent = (ScrollableComponent: any) => {
//   const AnimateList = Animated.createAnimatedComponent(ScrollableComponent);
//   return forwardRef((props: any, ref) => {
//     return <NestedScene {...props} ScrollableComponent={AnimateList} />;
//   });
// };

const Nested = {
  ScrollView: NestedScrollView,
  FlatList: NestedFlatList,
};

export { NestedTabView, Nested, NestedRefresh };
