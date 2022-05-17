import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, Image, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Swiper, SwiperRef, ScaleLayout } from '../components/Swiper';

const {width} = Dimensions.get('window');

const card = [
  {
    source: require('../../assets/a.jpg'),
  },
  {
    source: require('../../assets/b.jpg'),
  },
  {
    source: require('../../assets/c.jpg'),
  },
  {
    source: require('../../assets/d.jpg'),
  },
]

export default function SwiperExample() {
  const ref = useRef<SwiperRef>(null);
  const [autoplay, setAutoplay] = useState(false);
  const [horizontal, setHorizontal] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <Swiper
        ref={ref}
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={{ width: '100%', height: '100%'}} />
        }}
        onScollStart={() => {
          // console.log('滚动开始');
        }}
        onScollEnd={() => {
          // console.log('滚动结束');
        }}
        auto={autoplay}
        horizontal={horizontal}
        style={{
          width,
          height: 200,
        }}
      />
      <View style={{ flexDirection: 'row', marginTop: 100 }}>
        <TouchableOpacity onPress={() => {
          ref.current?.previous();
        }} style={{height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Pre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setAutoplay(auto => !auto);
        }} style={{height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{`isAuto: ${autoplay}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          setHorizontal(auto => !auto);
        }} style={{height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>{`isHorizontal: ${horizontal}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          ref.current?.next();
        }} style={{height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
      <Swiper
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={{ width: width - 60, marginHorizontal: 10,  height: '100%'}} />
        }}
        layoutOption={{
          layout: ScaleLayout,
          options: {
            width: width - 60,
            margin: 10,
          }
        }}
        auto={false}
        horizontal={true}
        style={{
          width,
          height: 200,
        }}
      />
      {/* <Swiper
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={{ width: '100%', height: '100%'}} />
        }}
        auto={true}
        horizontal={true}
        style={{
          width,
          height: 200,
        }}
      />
      <Swiper
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={{ width: '100%', height: '100%'}} />
        }}
        auto={true}
        horizontal={false}
        style={{
          width,
          height: 200,
        }}
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
