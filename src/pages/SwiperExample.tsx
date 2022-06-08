import React, { useCallback, useRef, useState } from 'react';
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

const card2 = new Array(100).fill(0);
card2.forEach((_, i) => {
  card2[i] = i;
})

export default function SwiperExample() {
  const ref = useRef<SwiperRef>(null);
  const [autoplay, setAutoplay] = useState(false);
  const [curIndx, setCurrent] = useState<number>(0);

  const handeEnd = useCallback(() => {
    const nowIndex = ref.current?.getCurrentIndex();
    // setCurrent(nowIndex);
    // console.log(index);
    // setCurrent(nowIndex);
  }, []);

  const handeStart = useCallback(() => {
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Swiper
        ref={ref}
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={{ width: '100%', height: '100%'}} />
        }}
        onScollStart={handeStart}
        onScollEnd={handeEnd}
        auto={autoplay}
        horizontal={true}
        style={{
          width,
          height: 200,
        }}
      />
      <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{curIndx}</Text>
      </View>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
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
          ref.current?.next();
        }} style={{height: 50, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
      <Swiper
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={{ width: '100%', height: '100%' }} />
        }}
        layoutOption={{
          layout: ScaleLayout,
          options: {
            mainAxisSize: 200,
            margin: 10,
          }
        }}
        auto={false}
        horizontal={false}
        style={{
          width,
          height: 260,
        }}
      />
      <Swiper
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={{ width: '100%', height: '100%' }} />
        }}
        layoutOption={{
          layout: ScaleLayout,
          options: {
            mainAxisSize: width - 60,
            margin: 10,
          }
        }}
        auto={false}
        horizontal={true}
        style={{
          width,
          height: 200,
          marginTop: 40,
          marginBottom: 100,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
