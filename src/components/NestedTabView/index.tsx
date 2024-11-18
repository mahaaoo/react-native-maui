import NestedTabView from './NestedTabView';
import NestedScene from './NestedScene';
import Animated from 'react-native-reanimated';
import { ScrollViewProps, FlatListProps } from 'react-native';

const NestedScrollView: React.FC<ScrollViewProps> = (props: any) => {
  const AnimateScrollView = Animated.ScrollView;

  return <NestedScene ScrollableComponent={AnimateScrollView} {...props} />;
};

const NestedFlatList: React.FC<FlatListProps<any>> = (props: any) => {
  const AnimateFlatList = Animated.FlatList;

  return <NestedScene ScrollableComponent={AnimateFlatList} {...props} />;
};

const Nested = {
  ScrollView: NestedScrollView,
  FlatList: NestedFlatList,
};

export { NestedTabView, Nested };
