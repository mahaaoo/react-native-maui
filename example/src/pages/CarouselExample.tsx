import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import {
  Carousel,
  CarouselRef,
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

const card2: any[] = [];
for (let i = 0; i < 10; i++) {
  card2.push(i);
}

export default function CarouselExample() {
  const ref = useRef<CarouselRef>(null);
  const [autoplay, setAutoplay] = useState(false);

  const handeEnd = useCallback((index) => {
    console.log('onScollEnd, currentIndex', index);
  }, []);

  const handeStart = useCallback(() => {
    // console.log('onScollStart');
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Carousel
        ref={ref}
        interval={1000}
        dataSource={card2}
        renderItem={(item) => {
          // return <Image source={item.source} style={styles.image2} />;
          return (
            <View
              style={{
                width,
                height: 200,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'pink',
              }}
            >
              <Text style={{ fontSize: 30 }}>{item}</Text>
            </View>
          );
        }}
        onScollStart={handeStart}
        onScollEnd={handeEnd}
        auto={autoplay}
        horizontal={true}
        style={styles.swiper}
        itemSize={width}
      />
      <View style={styles.buttonContent}>
        <TouchableOpacity
          onPress={() => {
            ref.current?.previous();
          }}
          style={styles.buton}
        >
          <Text>Pre</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setAutoplay((auto) => !auto);
          }}
          style={styles.buton}
        >
          <Text>{`isAuto: ${autoplay}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            ref.current?.next();
          }}
          style={styles.buton}
        >
          <Text>Next</Text>
        </TouchableOpacity>
      </View>
      <Carousel
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={styles.image1} />;
          // return (
          //   <View
          //     style={{
          //       width: 250,
          //       height: 180,
          //       justifyContent: 'center',
          //       alignItems: 'center',
          //       borderWidth: 1,
          //       borderColor: 'pink',
          //     }}
          //   >
          //     <Text style={{ fontSize: 30 }}>{item}</Text>
          //   </View>
          // );
        }}
        auto={false}
        layoutOption={{
          layout: RotateLayout,
          options: {
            mainAxisSize: 250,
          },
        }}
        snapToInterval={250}
        horizontal={true}
        style={styles.rotateCarousel}
      />
      {/* <Carousel
        interval={1000}
        dataSource={card}
        renderItem={(item) => {
          return <Image source={item.source} style={styles.image2} />;
        }}
        layoutOption={{
          layout: ScaleLayout,
          options: {
            mainAxisSize: 200,
            margin: -10,
          },
        }}
        auto={true}
        horizontal={false}
        style={styles.scaleCarouselV}
      />
      <Carousel
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
        style={styles.scaleCarousel}
      /> */}
      {/* <View
        style={{
          position: 'absolute',
          top: 100,
          left: 120,
          width: 20,
          height: 20,
          backgroundColor: 'black',
          transform: [{
            translateX: 50,
          }]
        }}
      /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContent: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buton: {
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image1: {
    width: 250,
    height: 180,
  },
  image2: {
    width: '100%',
    height: '100%',
  },
  swiper: {
    width,
    height: 200,
  },
  rotateCarousel: {
    width,
    height: 300,
  },
  scaleCarouselV: {
    width,
    height: 260,
  },
  scaleCarousel: {
    width,
    height: 200,
    marginTop: 40,
    marginBottom: 100,
  },
});
