import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

import Card from '../components/Card'
import Button from '../components/Button';
import Badge from '../components/Badge';
import Switch from '../components/Switch';
import Avatar from '../components/Avatar';
import {Loading} from '../components/Loading';

import useTheme from '../hooks/useTheme';
import {navigate} from '../navigate';
import { Toast } from '../components/Toast';

interface Example {
  title: string;
  content: React.ReactNode | null;
}

const exampleList: Example[] = [{
  title: 'Button',
  content: (
    <Button onPress={() => {}}>
      <Text>按钮</Text>
    </Button>  
  ),
}, {
  title: 'Badge',
  content: <Badge number={2} />,
}, {
  title: 'Divider',
  content: null,
}, {
  title: 'Avatar',
  content: (
    <Avatar
      style={{ width: 40, height: 40, borderRadius: 20 }}
      url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
    />
  ),
}, {
  title: 'Loading',
  content: <Loading />,
}, {
  title: 'Toast',
  content: <Toast title="提示" />,
}, {
  title: 'SliderSelect',
  content: null,
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
  content: null,
}, {
  title: 'Overlay',
  content: null,
}, {
  title: 'Swiper',
  content: null,
}, {
  title: 'SliderSheet',
  content: null,
}, {
  title: 'Picker',
  content: null,
}, {
  title: 'Skeleton',
  content: null,
}, {
  title: 'RefreshList',
  content: null,
}, {
  title: 'ListRow',
  content: null,
}, {
  title: 'ImageViewer',
  content: null,
}, {
  title: 'Pagination',
  content: null,
}];

export default function ComponentScreen() {
  const {theme} = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
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
              onPress={() => { navigate(`${item.title}Example`); }}
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
