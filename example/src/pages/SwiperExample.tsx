import React, { useRef } from 'react';
import { Dimensions, StyleSheet, Image, ScrollView } from 'react-native';
import {
  Swiper,
  SwiperRef,
  RotateLayout,
  ScaleLayout,
} from 'react-native-maui';

const { width } = Dimensions.get('window');

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
];

let card2: any[] = [];
for (let i = 0; i < 1; i++) {
  card2 = card2.concat(card);
}

export default function SwiperExample() {
  const ref = useRef<SwiperRef>(null);
  // const [autoplay, setAutoplay] = useState(false);
  // const [curIndx, setCurrent] = useState<number>(0);

  // const handeEnd = useCallback((index) => {
  //   // console.log('onScollEnd, currentIndex', index);
  //   // setCurrent(index);
  // }, []);

  // const handeStart = useCallback(() => {
  //   // console.log('onScollStart');
  // }, []);

  return (
    <ScrollView style={styles.container}>
      {/* <Swiper
        ref={ref}
        interval={1000}
        dataSource={card2}
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
      </View> */}
      <Swiper
        ref={ref}
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={styles.image1} />;
        }}
        auto={false}
        layoutOption={{
          layout: RotateLayout,
          options: {
            mainAxisSize: 250,
          },
        }}
        horizontal={true}
        style={styles.rotateSwiper}
      />
      {/* <Swiper
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
        horizontal={false}
        style={{
          width,
          height: 260,
        }}
      /> */}
      <Swiper
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={styles.image2} />;
        }}
        layoutOption={{
          layout: ScaleLayout,
          options: {
            mainAxisSize: width - 60,
            margin: -50,
          },
        }}
        auto={false}
        horizontal={true}
        style={styles.scaleSwiper}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image1: {
    width: 250,
    height: 180,
  },
  image2: {
    width: '100%',
    height: '100%',
  },
  rotateSwiper: {
    width,
    height: 300,
  },
  scaleSwiper: {
    width,
    height: 200,
    marginTop: 40,
    marginBottom: 100,
  },
});
