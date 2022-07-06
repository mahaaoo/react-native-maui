import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import {navigate} from '../navigate';

import Card from '../components/Card'

import {
  Button,
  Badge,
  Switch,
  Avatar,
  Loading,
  useTheme,
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
  AsyncImage
} from 'react-native-maui';
import WaterMark from '../components/WaterMark';
import Arrow from '../components/Icon/arrow';

interface Example {
  title: string;
  content: React.ReactNode | null;
}

const exampleList: Example[] = [{
  title: 'Icon',
  content: <Icon name="code" size={50} color='#1491a8' />,
},{
  title: 'Button',
  content: (
    <Button onPress={() => {}}>
      <Text>Button</Text>
    </Button>  
  ),
}, {
  title: 'Badge',
  content: <Badge number={2} />,
}, {
  title: 'Divider',
  content: <Divider start={30} end={140} color={'white'} width={2} />,
}, {
  title: 'Avatar',
  content: (
    <Avatar
      style={{ width: 40, height: 40, borderRadius: 20 }}
      url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
    />
  ),
}, {
  title: 'ListRow',
  content: (
    <View style={{ height: 40, width: '100%', backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, justifyContent: 'space-between', borderRadius: 8 }}>
      <Text>Title</Text>
      <Arrow />
    </View>
  ),
}, {
  title: 'AnimatedNumber',
  content: <AnimatedNumber style={{ fontSize: 30, color: 'orange', fontWeight: 'bold' }} delay={2000} value={0} toValue={100} />,
}, {
  title: 'Progress',
  content: <Progress height={12} width={120} radius value={10} toValue={80} activeColor="pink" inactiveColor='white' />
}, {
  title: 'Shadow',
  content: (
    <Shadow borderRadius={10} shadowWidth={10} color="white">
      <View style={{ 
        width: 45, height: 45, backgroundColor: '#F8F8F8', borderRadius: 10,
      }} />
    </Shadow>
  )
}, {
  title: 'AsyncImage',
  content: <AsyncImage url={'https://picsum.photos/100/50/?random'} style={{ width: 100, height: 50 }} />,
}, {
  title: 'Loading',
  content: <Loading />,
}, {
  title: 'Toast',
  content: <Toast title="提示" />,
}, {
  title: 'Pagination',
  content: (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'white' }} />
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#D8D8D8', marginHorizontal: 8 }} />
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#D8D8D8' }} />
    </View>
  ),
}, {
  title: 'Segmented',
  content: <Segmented style={{ width: 100 }} items={['one', 'two']} />,
}, {
  title: 'RefreshList',
  content: (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ backgroundColor: 'white', height: '70%', width: 100, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}/>
    </View>
  ),
}, {
  title: 'Switch',
  content: (
    <Switch value={true} />
  ),
},{
  title: 'Theme',
  content: (
    <View style={{flexDirection: 'row'}}>
      <View style={{width: 20, height: 40, backgroundColor: '#fff'}}/>
      <View style={{width: 20, height: 40, backgroundColor: '#000'}}/>
    </View>
  ),
}, {
  title: 'Collapse',
  content: (
    <View style={{width: '100%',height: '100%',justifyContent: 'center',alignItems: 'center'}}>
      <View style={{ height: 50, width: 100, backgroundColor: 'white', transform: [{perspective: 2000},{rotateX: '-60deg'}, {translateY: 25}] }} />
      <View style={{ height: 50, width: 100, backgroundColor: 'white', transform: [{perspective: 2000},{rotateX: '60deg'},  {translateY: -25}] }} />
    </View>
  ),
}, {
  title: 'Overlay',
  content: (
    <View style={{width: '70%',height: '100%', backgroundColor: 'white', borderRadius: 8}}>
      <View style={{ margin: 10, flex: 1, borderRadius: 8, backgroundColor: '#000', opacity: 0.2}} />
    </View>
  ),
}, {
  title: 'ActionSheet',
  content: (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ height: '50%', width: 80, borderRadius: 8, overflow: 'hidden' }}>
        <View style={{ flex: 1, backgroundColor: 'white' }} />
        <View style={{ flex: 1, backgroundColor: 'white', marginTop: StyleSheet.hairlineWidth }} />
      </View>
      <View style={{ backgroundColor: 'white', height: '25%', width: 80, borderRadius: 8, marginTop: 5 }}/>
    </View>
  )
}, {
  title: 'Picker',
  content: (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 }}>
        <Text>Option1</Text>
      </View>
      <Text style={{ marginTop: 5, color: '#888' }}>Option2</Text>
    </View>
  ),
}, {
  title: 'Skeleton',
  content: (
    <SkeletonContainer childAnimation={Shine}>
      <SkeletonRect style={{ height: 44, width: 100, borderRadius: 8 }} />
    </SkeletonContainer>
  ),
}, {
  title: 'Swiper',
  content: (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ backgroundColor: 'white', height: '80%', width: 30, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}/>
      <View style={{ backgroundColor: 'white', height: '80%', width: 60, marginHorizontal: 20, borderRadius: 8 }}/>
      <View style={{ backgroundColor: 'white', height: '80%', width: 30, borderTopLeftRadius: 8, borderBottomLeftRadius: 8}}/>
    </View>
  ),
}, {
  title: 'ImageViewer',
  content: (
    <View style={{width: '100%',height: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{ width: 50, height: 50, backgroundColor: '#000', opacity: 0.1 }} />
      </View>
      <View style={{ width: 30, height: 30, backgroundColor: 'white' }} />
    </View>
  ),
}, {
  title: 'WaterFallList',
  content: (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
      <View style={{ backgroundColor: 'white', height: '70%', width: '20%' }}/>
      <View style={{ backgroundColor: 'white', height: '70%', width: '20%', marginTop: 15, marginHorizontal: 1 }}/>
      <View style={{ backgroundColor: 'white', height: '70%', width: '20%' }}/>
      <View style={{ backgroundColor: 'white', height: '70%', width: '20%', marginTop: 15, marginHorizontal: 1 }}/>
    </View>
  ),
}];

export default function ComponentScreen() {
  const {theme} = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <WaterMark />
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        data={exampleList}
        numColumns={2}
        keyExtractor={(item, index) => `example_${index}` }
        renderItem={({item, index}) => {
          return (
            <Card
              title={item.title}
              style={{ margin: 10 }}
              content={
                item.content ? item.content : <Text style={{color: theme.cardTitleColor}}>{item.title}</Text>
              }
              onPress={() => { 
                navigate(`${item.title}Example`);
               }}
            />
          )
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },
});
