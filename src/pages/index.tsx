import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';

import Card from '../components/Card'
import Button from '../components/Button';
import Badge from '../components/Badge';
import SliderSelect from '../components/SliderSelect';
import Switch from '../components/Switch';
import Avatar from '../components/Avatar';
import {Loading} from '../components/Loading';

import useTheme from '../hooks/useTheme';
import {navigate} from '../navigate';

const Margin = 15;
const HalfCardWidth = (Dimensions.get('window').width - 3 * Margin) / 2;
const CardWidth = Dimensions.get('window').width - 2 * Margin;

export default function ComponentScreen() {
  const {theme} = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Card 
            title={'Button'}
            style={{ width: HalfCardWidth }}
            content={
              <Button onPress={() => {}}>
                <Text>按钮</Text>
              </Button>  
            }
            onPress={() => { 
              navigate("ButtonExample");
            }}
          />
          <View style={{ width: Margin }} />
          <Card
            title={'Badge'}
            style={{ width: HalfCardWidth }}        
            content={
              <Badge number={2} />      
            }
            onPress={() => { navigate("BadgeExample"); }}
          />
        </View>
        <View style={styles.card}>
          <Card 
            title={'SliderSelect'}
            style={{ width: CardWidth }}
            content={
              <SliderSelect items={['选项一', '选项二', '选项三', '选项四']} />
            }
            onPress={() => { navigate("SliderSelectExample"); }}
          />
        </View>
        <View style={styles.card}>
          <Card 
            title={'Switch'}
            style={{ width: HalfCardWidth }}
            content={
              <Switch />
            }
            onPress={() => { navigate("SwitchExample"); }}
          />
          <View style={{width: Margin}} />
          <Card 
            title={'Theme'}
            style={{ width: HalfCardWidth }}
            content={
              <View style={{flexDirection: 'row'}}>
                <View style={{width: 20, height: 40, backgroundColor: '#fff'}}/>
                <View style={{width: 20, height: 40, backgroundColor: '#000'}}/>
              </View>
            }
            onPress={() => { navigate("ThemeExample"); }}
          />
        </View>
        <View style={styles.card}>
          <Card 
            title={'Divider'}
            style={{ width: HalfCardWidth }}
            content={
              <Text>分割线</Text>
            }
            onPress={() => { navigate("DividerExample"); }}
          />
          <View style={{width: Margin}} />
          <Card 
            title={'Avatar'}
            style={{ width: HalfCardWidth }}
            content={
              <Avatar
                style={{ width: 40, height: 40, borderRadius: 20 }}
                url={'https://avatars.githubusercontent.com/u/16695567?s=400&u=fd8d6249fa408e1e606015a06868a99993171938&v=4'}
              />
            }
            onPress={() => { navigate("AvatarExample"); }}
          />
        </View>
        <View style={styles.card}>
          <Card 
            title={'Collapse'}
            style={{ width: HalfCardWidth }}
            content={
              <Text>折叠面板</Text>
            }
            onPress={() => { navigate("CollapseExample"); }}
          />
          <View style={{width: Margin}} />
          <Card 
            title={'Overlay'}
            style={{ width: HalfCardWidth }}
            content={
              <Text>浮层</Text>
            }
            onPress={() => { navigate("OverlayExample"); }}
          />
        </View>
        <View style={styles.card}>
          <Card 
            title={'Swiper'}
            style={{ width: HalfCardWidth }}
            content={
              <Text>轮播</Text>
            }
            onPress={() => { navigate("SwiperExample"); }}
          />
          <View style={{width: Margin}} />
          <Card 
            title={'SliderSheet'}
            style={{ width: HalfCardWidth }}
            content={
              <Text>下拉窗口</Text>
            }
            onPress={() => { navigate("SliderSheetExample"); }}
          />
        </View>
        <View style={styles.card}>
          <Card 
            title={'Picker'}
            style={{ width: HalfCardWidth }}
            content={
              <Text>Picker</Text>
            }
            onPress={() => { navigate("PickerExample"); }}
          />
          <View style={{width: Margin}} />
          <Card 
            title={'Skeleton'}
            style={{ width: HalfCardWidth }}
            content={
              <Text>骨架屏</Text>
            }
            onPress={() => { navigate("SkeletonExample"); }}
          />
        </View>
        <View style={styles.card}>
          <Card 
            title={'Refresh'}
            style={{ width: HalfCardWidth }}
            content={
              <Text>Refresh</Text>
            }
            onPress={() => { navigate("Refresh"); }}
          />
          <View style={{width: Margin}} />
          <Card 
            title={'Loading'}
            style={{ width: HalfCardWidth }}
            content={
              <Loading />
            }
            onPress={() => { navigate("LoadingExample"); }}
          />
        </View>
        <View style={styles.card}>
          <Card 
            title={'Toast'}
            style={{ width: HalfCardWidth }}
            content={
              <Text>Toast</Text>
            }
            onPress={() => { navigate("ToastExample"); }}
          />
          {/* <View style={{width: Margin}} />
          <Card 
            title={'Loading'}
            style={{ width: HalfCardWidth }}
            content={
              <Loading />
            }
            onPress={() => { navigate("LoadingExample"); }}
          /> */}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    marginTop: Margin,
  }
});
