import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {
  Button,
  Badge,
  Switch,
  Avatar,
  Loading,
  Toast,
  Divider,
  Segmented,
  Shine,
  SkeletonContainer,
  SkeletonRect,
  Progress,
  AnimatedNumber,
  Shadow,
  Icon,
} from 'react-native-maui';
import Arrow from '../components/Icon/arrow';

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  listrow: {
    height: 40,
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  animatedNumber: {
    fontSize: 30,
    color: 'orange',
    fontWeight: 'bold',
  },
  shadow: {
    width: 45,
    height: 45,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
  },
  paginationWhite: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  paginationGrey: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D8D8D8',
    marginHorizontal: 8,
  },
  segmented: {
    width: 100,
  },
  refreshList: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshListContent: {
    backgroundColor: 'white',
    height: '70%',
    width: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  theme: {
    flexDirection: 'row',
  },
  themeLeft: {
    width: 20,
    height: 40,
    backgroundColor: '#fff',
  },
  themeRight: {
    width: 20,
    height: 40,
    backgroundColor: '#1e1e1e',
  },
  collapse: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  collapseTop: {
    height: 50,
    width: 100,
    backgroundColor: 'white',
    transform: [
      { perspective: 2000 },
      { rotateX: '-60deg' },
      { translateY: 25 },
    ],
  },
  collapseBottom: {
    height: 50,
    width: 100,
    backgroundColor: 'white',
    transform: [
      { perspective: 2000 },
      { rotateX: '60deg' },
      { translateY: -25 },
    ],
  },
  overlay: {
    width: '70%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  overlayContent: {
    margin: 10,
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#000',
    opacity: 0.2,
  },
  actionSheet: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSheet1: {
    height: '50%',
    width: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  actionSheet2: {
    flex: 1,
    backgroundColor: 'white',
  },
  actionSheet3: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: StyleSheet.hairlineWidth,
  },
  actionSheet4: {
    backgroundColor: 'white',
    height: '25%',
    width: 80,
    borderRadius: 8,
    marginTop: 5,
  },
  picker: {
    flex: 1,
    alignItems: 'center',
  },
  picker1: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  picker2: {
    marginTop: 5,
    color: '#888',
  },
  skeleton: {
    height: 44,
    width: 100,
    borderRadius: 8,
  },
  swiper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  swiperLeft: {
    backgroundColor: 'white',
    height: '80%',
    width: 30,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  swiperMid: {
    backgroundColor: 'white',
    height: '80%',
    width: 60,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  swiperRight: {
    backgroundColor: 'white',
    height: '80%',
    width: 30,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  imageViewer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewer1: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewer2: {
    width: 50,
    height: 50,
    backgroundColor: '#000',
    opacity: 0.1,
  },
  imageViewer3: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
  },
  waterFallList: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  waterFallListUp: {
    backgroundColor: 'white',
    height: '70%',
    width: '20%',
  },
  waterFallListDown: {
    backgroundColor: 'white',
    height: '70%',
    width: '20%',
    marginTop: 15,
    marginHorizontal: 1,
  },
  popover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popoverContainer: {
    width: 80,
    height: 40,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: '#333',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
  },
  popoverText: {
    color: 'white',
    fontSize: 18,
  },
  swipeAction: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  swipeAction1: {
    width: '50%',
    height: 40,
    backgroundColor: 'white',
  },
  swipeAction2: {
    width: '20%',
    height: 40,
    backgroundColor: 'orange',
  },
  swipeAction3: {
    width: '20%',
    height: 40,
    backgroundColor: '#d11a2d',
  },
  refreshControl: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refreshControlContent: {
    backgroundColor: 'white',
    height: '50%',
    width: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});

interface Example {
  title: string;
  content: React.ReactNode | null;
}

const exampleList: Example[] = [
  {
    title: 'Icon',
    content: <Icon name="code" size={50} color="#1491a8" />,
  },
  {
    title: 'Button',
    content: (
      <Button onPress={() => {}}>
        <Text>Button</Text>
      </Button>
    ),
  },
  {
    title: 'Badge',
    content: <Badge number={2} />,
  },
  {
    title: 'Divider',
    content: <Divider start={30} end={130} color={'white'} width={2} />,
  },
  {
    title: 'Avatar',
    content: (
      <Avatar
        style={styles.avatar}
        url={
          'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'
        }
      />
    ),
  },
  {
    title: 'ListRow',
    content: (
      <View style={styles.listrow}>
        <Text>Title</Text>
        <Arrow />
      </View>
    ),
  },
  {
    title: 'AnimatedNumber',
    content: (
      <AnimatedNumber
        style={styles.animatedNumber}
        delay={2000}
        value={0}
        toValue={100}
      />
    ),
  },
  {
    title: 'Progress',
    content: (
      <Progress
        height={12}
        width={120}
        radius
        value={10}
        toValue={80}
        activeColor="#d11a2d"
        inactiveColor="white"
      />
    ),
  },
  {
    title: 'Shadow',
    content: (
      <Shadow borderRadius={10} shadowWidth={10} color="white">
        <View style={styles.shadow} />
      </Shadow>
    ),
  },
  {
    title: 'Loading',
    content: <Loading />,
  },
  {
    title: 'Toast',
    content: <Toast title="提示" />,
  },
  {
    title: 'Pagination',
    content: (
      <View style={styles.theme}>
        <View style={styles.paginationWhite} />
        <View style={styles.paginationGrey} />
        <View style={styles.paginationGrey} />
      </View>
    ),
  },
  {
    title: 'Segmented',
    content: <Segmented style={styles.segmented} items={['one', 'two']} />,
  },
  {
    title: 'SwipeAction',
    content: (
      <View style={styles.swipeAction}>
        <View style={styles.swipeAction1} />
        <View style={styles.swipeAction2} />
        <View style={styles.swipeAction3} />
      </View>
    ),
  },
  {
    title: 'Switch',
    content: <Switch value={true} />,
  },
  {
    title: 'Theme',
    content: (
      <View style={styles.theme}>
        <View style={styles.themeLeft} />
        <View style={styles.themeRight} />
      </View>
    ),
  },
  {
    title: 'Collapse',
    content: (
      <View style={styles.collapse}>
        <View style={styles.collapseTop} />
        <View style={styles.collapseBottom} />
      </View>
    ),
  },
  {
    title: 'Overlay',
    content: (
      <View style={styles.overlay}>
        <View style={styles.overlayContent} />
      </View>
    ),
  },
  {
    title: 'RefreshList',
    content: (
      <View style={styles.refreshList}>
        <View style={styles.refreshListContent} />
      </View>
    ),
  },
  {
    title: 'RefreshControl',
    content: (
      <View style={styles.refreshControl}>
        <Loading />
        <View style={styles.refreshControlContent} />
      </View>
    ),
  },
  {
    title: 'ActionSheet',
    content: (
      <View style={styles.actionSheet}>
        <View style={styles.actionSheet1}>
          <View style={styles.actionSheet2} />
          <View style={styles.actionSheet3} />
        </View>
        <View style={styles.actionSheet4} />
      </View>
    ),
  },
  {
    title: 'Popover',
    content: (
      <View style={styles.popover}>
        <View style={styles.popoverContainer}>
          <Text style={styles.popoverText}>Hello</Text>
        </View>
        <View style={styles.arrow} />
      </View>
    ),
  },
  {
    title: 'Picker',
    content: (
      <View style={styles.picker}>
        <View style={styles.picker1}>
          <Text>Option1</Text>
        </View>
        <Text style={styles.picker2}>Option2</Text>
      </View>
    ),
  },
  {
    title: 'Skeleton',
    content: (
      <SkeletonContainer childAnimation={Shine}>
        <SkeletonRect style={styles.skeleton} />
      </SkeletonContainer>
    ),
  },
  {
    title: 'Swiper',
    content: (
      <View style={styles.swiper}>
        <View style={styles.swiperLeft} />
        <View style={styles.swiperMid} />
        <View style={styles.swiperRight} />
      </View>
    ),
  },
  {
    title: 'ImageViewer',
    content: (
      <View style={styles.imageViewer}>
        <View style={styles.imageViewer1}>
          <View style={styles.imageViewer2} />
        </View>
        <View style={styles.imageViewer3} />
      </View>
    ),
  },
  {
    title: 'WaterFallList',
    content: (
      <View style={styles.waterFallList}>
        <View style={styles.waterFallListUp} />
        <View style={styles.waterFallListDown} />
        <View style={styles.waterFallListUp} />
        <View style={styles.waterFallListDown} />
      </View>
    ),
  },
];

export { exampleList };
